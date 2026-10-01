(() => {
  'use strict';
  const root = document.documentElement;
  let theme = 'dark';
  try {
    if (window.localStorage.getItem('vas-theme') === 'light') theme = 'light';
  } catch (_) { /* Storage may be disabled; the toggle still works. */ }
  root.dataset.theme = theme;
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const update = () => {
      const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
      button.textContent = nextTheme === 'light' ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
      button.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
    };
    update();
    button.hidden = false;
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      update();
      try { window.localStorage.setItem('vas-theme', root.dataset.theme); } catch (_) {}
    });
  });
})();
