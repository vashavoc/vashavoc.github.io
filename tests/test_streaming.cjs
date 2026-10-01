const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const file = path.join(__dirname, '../assets/js/streaming.js');
assert.ok(fs.existsSync(file), 'Click-to-load stream implementation is missing');
const code = fs.readFileSync(file, 'utf8');

// A minimal DOM harness checks our event behavior, not Twitch's network/player.
function setup(width, protocol = 'https:', hostname = 'vas.gg') {
  let click;
  const frame = { attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, focus() { this.focused = true; } };
  const link = { textContent: '', addEventListener(type, cb) { assert.equal(type, 'click'); click = cb; } };
  const screen = { clientWidth: width, children: [], querySelector() { return this.children[0] || null; }, append(el) { this.children.push(el); } };
  const intro = { hidden: false };
  const note = { textContent: '' };
  const nodes = { 'load-stream': link, 'stream-screen': screen, 'stream-intro': intro, 'stream-note': note };
  const document = { getElementById(id) { return nodes[id]; }, createElement(tag) { assert.equal(tag, 'iframe'); return frame; } };
  vm.runInNewContext(code, { document, window: { location: { protocol, hostname } }, URL, URLSearchParams });
  return { frame, screen, intro, note, link, click };
}
const desktop = setup(600);
assert.equal(desktop.screen.children.length, 0, 'No player request before interaction');
let prevented = false;
desktop.click({ preventDefault() { prevented = true; } });
assert.ok(prevented);
const src = new URL(desktop.frame.src);
assert.equal(src.origin, 'https://player.twitch.tv');
assert.equal(src.searchParams.get('channel'), 'VAS_');
assert.equal(src.searchParams.get('parent'), 'vas.gg');
assert.equal(src.searchParams.get('autoplay'), 'false');
assert.equal(src.searchParams.get('muted'), 'false');
assert.ok(desktop.frame.title);
assert.equal(desktop.frame.attrs.allowfullscreen, '');
assert.ok(desktop.frame.focused);
assert.ok(desktop.intro.hidden);
desktop.click({ preventDefault() {} });
assert.equal(desktop.screen.children.length, 1, 'No duplicate player');
for (const state of [setup(350), setup(600, 'file:', ''), setup(600, 'http:', 'localhost')]) {
  assert.equal(state.link.textContent, '', 'Fallback retains the original Twitch link');
  if (state.click) state.click({ preventDefault() { throw new Error('Fallback must navigate normally'); } });
  assert.equal(state.screen.children.length, 0);
}
console.log('PASS: desktop click-to-load, no autoplay, exact parent, focus, duplicate guard, narrow/file/http fallbacks');
