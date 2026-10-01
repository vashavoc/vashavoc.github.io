const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/streaming.js', 'utf8');
function run({ reduced = false, supported = true } = {}) {
  const sections = [0, 1, 2].map(() => ({ classList: new Set() }));
  sections.forEach(s => { s.classList.add = s.classList.add.bind(s.classList); s.classList.remove = s.classList.delete.bind(s.classList); });
  let callback, change, disconnected = false;
  const observed = new Set();
  const media = { matches: reduced, addEventListener: (_, fn) => { change = fn; } };
  const window = { location: { protocol: 'file:' }, matchMedia: () => media };
  if (supported) window.IntersectionObserver = class {
    constructor(fn) { callback = fn; }
    observe(s) { observed.add(s); }
    unobserve(s) { observed.delete(s); }
    disconnect() { observed.clear(); disconnected = true; }
  };
  vm.runInNewContext(source, { window, document: { getElementById: () => null, querySelectorAll: () => sections } });
  return { sections, observed, enter: (s) => callback([{ target: s, isIntersecting: true }]), reduce: () => { media.matches = true; change(); }, disconnected: () => disconnected };
}
const normal = run();
assert.equal(normal.observed.size, 3, 'sections observed independently of Twitch availability');
normal.enter(normal.sections[0]);
assert(normal.sections[0].classList.has('is-revealed'));
assert(!normal.observed.has(normal.sections[0]), 'reveals only once');
normal.reduce();
assert(normal.disconnected());
assert(normal.sections.every(s => !s.classList.has('is-revealed')));
assert.equal(run({ reduced: true }).observed.size, 0);
assert.equal(run({ supported: false }).observed.size, 0);
console.log('PASS: one-time reveals, file previews, reduced-motion startup/change, unsupported-browser fallback');
