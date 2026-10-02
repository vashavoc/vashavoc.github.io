const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = 'assets/js/portraits.js';
const source = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';

function element(classes = '') {
  const listeners = {};
  const names = new Set(classes.split(' ').filter(Boolean));
  return {
    hidden: false, textContent: '', attrs: {}, listeners,
    classList: {
      toggle(name, active) { active ? names.add(name) : names.delete(name); },
      contains(name) { return names.has(name); }
    },
    setAttribute(name, value) { this.attrs[name] = value; },
    addEventListener(name, fn) { listeners[name] = fn; },
    emit(name, event = {}) { listeners[name]?.(event); }
  };
}
function run({ reduced = false } = {}) {
  const slides = Array.from({ length: 4 }, (_, i) => ({ ...element('stream-portrait' + (i ? '' : ' is-current')), complete: true, naturalWidth: 1200 }));
  const controls = element(); controls.hidden = true;
  const count = element(), pause = element(), previous = element(), next = element();
  const screen = element();
  let player = false, mediaChange, mutation;
  screen.querySelectorAll = () => slides;
  screen.contains = () => false;
  const nodes = { 'stream-screen': screen, 'portrait-controls': controls, 'portrait-count': count, 'portrait-toggle': pause, 'portrait-previous': previous, 'portrait-next': next };
  screen.querySelector = () => player ? {} : null;
  const document = { hidden: false, listeners: {}, getElementById: id => nodes[id], addEventListener(name, fn) { this.listeners[name] = fn; } };
  const media = { matches: reduced, addEventListener(_, fn) { mediaChange = fn; } };
  const timers = new Map(); let id = 0;
  const window = {
    matchMedia: () => media,
    setTimeout(fn, delay) { timers.set(++id, { fn, delay }); return id; },
    clearTimeout(key) { timers.delete(key); },
    MutationObserver: class { constructor(fn) { mutation = fn; } observe() {} }
  };
  vm.runInNewContext(source, { document, window });
  return { slides, controls, count, pause, previous, next, timers, screen,
    advance() { const [key, timer] = timers.entries().next().value; timers.delete(key); timer.fn(); },
    visibility(hidden) { document.hidden = hidden; document.listeners.visibilitychange?.(); },
    motion(reduce) { media.matches = reduce; mediaChange?.(); },
    player() { player = true; mutation?.(); }
  };
}

const normal = run();
assert.equal(normal.controls.hidden, false, 'working slideshow controls are revealed');
assert.equal(normal.timers.size, 1, 'one automatic timer');
assert.equal([...normal.timers.values()][0].delay, 8000, 'each portrait stays for eight seconds');
for (let step = 0; step <= normal.slides.length; step++) {
  const index = step % normal.slides.length;
  assert.equal(normal.count.textContent, `Photo ${index + 1} / 4`);
  assert.equal(normal.slides.filter(s => s.classList.contains('is-current')).length, 1);
  assert(normal.slides[index].classList.contains('is-current'));
  assert.equal(normal.slides[index].attrs['aria-hidden'], 'false');
  normal.advance();
}
console.log('PASS: four-photo rotation, wraparound, eight-second interval, accessible active slide');

const manual = run();
manual.pause.emit('click');
assert.equal(manual.timers.size, 0, 'Pause stops the timer');
assert.equal(manual.pause.textContent, 'Play photos');
manual.previous.emit('click');
assert.equal(manual.count.textContent, 'Photo 4 / 4', 'Previous wraps backwards');
manual.next.emit('click');
assert.equal(manual.count.textContent, 'Photo 1 / 4');
assert.equal(manual.timers.size, 0, 'Manual browsing stays paused');
manual.pause.emit('click');
assert.equal(manual.timers.size, 1, 'Play resumes automatic rotation');
manual.next.emit('click');
assert.equal(manual.count.textContent, 'Photo 2 / 4');
assert.equal(manual.timers.size, 0, 'Manual next pauses autoplay');
console.log('PASS: pause/play, previous/next, manual browsing pauses autoplay');

const reduced = run({ reduced: true });
assert.equal(reduced.timers.size, 0, 'Reduced motion disables autoplay at startup');
assert.equal(reduced.pause.textContent, 'Play photos');
reduced.next.emit('click');
assert.equal(reduced.count.textContent, 'Photo 2 / 4', 'Manual controls still work');
const changing = run();
changing.motion(true);
assert.equal(changing.timers.size, 0, 'Runtime reduced-motion change pauses autoplay');
changing.motion(false);
assert.equal(changing.timers.size, 0, 'Do not restart without user permission');
const held = run();
held.visibility(true);
assert.equal(held.timers.size, 0, 'No background-tab timer');
held.visibility(false);
assert.equal(held.timers.size, 1);
held.screen.emit('mouseenter');
assert.equal(held.timers.size, 0, 'Hover temporarily suspends rotation');
held.screen.emit('mouseleave');
assert.equal(held.timers.size, 1);
held.screen.emit('focusin');
assert.equal(held.timers.size, 0, 'Focus temporarily suspends rotation');
held.screen.emit('focusout', { relatedTarget: null });
assert.equal(held.timers.size, 1);
held.player();
assert.equal(held.timers.size, 0, 'Loading the Twitch player stops slideshow work');
assert.equal(held.controls.hidden, true, 'Slideshow controls disappear with player');
const broken = run();
broken.slides[1].naturalWidth = 0;
broken.advance();
assert.equal(broken.count.textContent, 'Photo 3 / 4', 'Skip a failed image without a blank frame');
broken.slides.forEach((slide, i) => { if (i !== 2) slide.naturalWidth = 0; });
broken.advance();
assert.equal(broken.count.textContent, 'Photo 3 / 4', 'Keep visible image when other images fail');
console.log('PASS: reduced motion, visibility, hover/focus, player shutdown, failed-image fallback');
