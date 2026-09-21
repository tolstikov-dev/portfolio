// Тема до первой отрисовки (без FOUC): localStorage → prefers-color-scheme → dark.
// Логика должна совпадать с initialTheme() в src/theme-provider.tsx
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
