// Восстановление чистого URL после SPA-fallback из 404.html (GitHub Pages):
// 404.html сохраняет запрошенный путь в sessionStorage и редиректит на корень,
// здесь возвращаем его в адресную строку до загрузки React.
(function () {
  try {
    var redirect = sessionStorage.getItem('spa-redirect');
    if (redirect) {
      sessionStorage.removeItem('spa-redirect');
      window.history.replaceState(null, '', redirect);
    }
  } catch (e) {}
})();
