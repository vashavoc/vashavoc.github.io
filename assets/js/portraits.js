(() => {
  'use strict';
  const screen = document.getElementById('stream-screen');
  const controls = document.getElementById('portrait-controls');
  const count = document.getElementById('portrait-count');
  const toggle = document.getElementById('portrait-toggle');
  const previous = document.getElementById('portrait-previous');
  const next = document.getElementById('portrait-next');
  if (!screen || !controls || !count || !toggle || !previous || !next) return;
  const slides = Array.from(screen.querySelectorAll('.stream-portrait'));
  if (slides.length < 2) return;
  const motion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let current = 0;
  let paused = !!(motion && motion.matches);
  let hovered = false;
  let focused = false;
  let timer;
  function update() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-current', index === current);
      slide.setAttribute('aria-hidden', String(index !== current));
    });
    count.textContent = `Photo ${current + 1} / ${slides.length}`;
    toggle.textContent = paused ? 'Play photos' : 'Pause photos';
    toggle.setAttribute('aria-label', paused ? 'Play photo slideshow' : 'Pause photo slideshow');
  }
  function schedule() {
    window.clearTimeout(timer);
    if (screen.querySelector('iframe')) {
      controls.hidden = true;
      return;
    }
    if (paused || hovered || focused || document.hidden) return;
    timer = window.setTimeout(() => {
      advance(1);
      schedule();
    }, 8000);
  }
  function advance(direction) {
    // A late or failed photo must never replace the last good frame.
    for (let step = 1; step < slides.length; step++) {
      const index = (current + direction * step + slides.length) % slides.length;
      if (!slides[index].complete || !slides[index].naturalWidth) continue;
      current = index;
      break;
    }
    update();
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    update();
    schedule();
  });
  function browse(direction) {
    paused = true;
    advance(direction);
    schedule();
  }
  previous.addEventListener('click', () => browse(-1));
  next.addEventListener('click', () => browse(1));
  screen.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  screen.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  screen.addEventListener('focusin', () => { focused = true; schedule(); });
  screen.addEventListener('focusout', (event) => {
    focused = screen.contains(event.relatedTarget);
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  if (motion && motion.addEventListener) motion.addEventListener('change', () => {
    if (!motion.matches) return;
    paused = true;
    update();
    schedule();
  });
  if (window.MutationObserver) {
    const observer = new window.MutationObserver(schedule);
    observer.observe(screen, { childList: true });
  }
  update();
  controls.hidden = false;
  schedule();
})();
