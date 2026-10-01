(() => {
  'use strict';
  const link = document.getElementById('load-stream');
  const screen = document.getElementById('stream-screen');
  const intro = document.getElementById('stream-intro');
  const note = document.getElementById('stream-note');
  // Keep a working channel link on file previews, HTTP, and narrow screens.
  // Twitch's minimum embedded video size is 400 x 300 pixels.
  if (!link || !screen || !intro || !note || window.location.protocol !== 'https:' || screen.clientWidth < 400) return;
  link.textContent = 'Load Twitch player';
  link.addEventListener('click', (event) => {
    if (screen.clientWidth < 400) return;
    event.preventDefault();
    if (screen.querySelector('iframe')) return;
    const params = new URLSearchParams({
      channel: 'VAS_',
      parent: window.location.hostname,
      autoplay: 'false',
      muted: 'false'
    });
    const frame = document.createElement('iframe');
    frame.src = `https://player.twitch.tv/?${params}`;
    frame.title = 'VAS_ Twitch stream';
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('allow', 'fullscreen');
    frame.setAttribute('tabindex', '0');
    screen.append(frame);
    intro.hidden = true;
    note.textContent = 'Player not loading? Use Open channel to watch on Twitch.';
    frame.focus();
  });
})();

// Progressive enhancement: content remains visible without JS or animation.
(() => {
  'use strict';
  if (!window.matchMedia || !window.IntersectionObserver) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  const sections = document.querySelectorAll('.section');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
  sections.forEach((section) => observer.observe(section));
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer.disconnect();
    sections.forEach((section) => section.classList.remove('is-revealed'));
  });
})();
