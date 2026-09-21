// Загрузчик Яндекс.Метрики (счётчик 111460043).
// Подключён по официальному способу для сайтов с CSP: код счётчика вынесен
// во внешний файл, поэтому в script-src не нужен 'unsafe-inline'
// (https://yandex.ru/support/metrica/code/install-counter-csp.html).
// Хиты отправляются вручную из src/lib/metrika.ts: в init выставлен
// defer:true — рекомендованный режим для SPA, чтобы просмотры страниц
// при переходах по History API не задваивались
// (https://yandex.com/support/metrica/en/code/counter-spa-setup).
// Активен только на продовом домене: dev-сервер, preview и smoke-тесты
// (localhost) не должны ни портить статистику, ни ходить во внешнюю сеть.
//
// 152-ФЗ: счётчик загружается ТОЛЬКО после явного согласия в cookie-баннере.
// Если согласия нет — ждём события от баннера (src/lib/consent.ts).
// Ключ, TTL и имя события дублируют src/lib/consent.ts — держать синхронно.
(function () {
  if (window.location.hostname !== 'tolstikov-dev.github.io') return;

  var CONSENT_KEY = 'metrika-consent';
  var CONSENT_TTL_MS = 90 * 24 * 60 * 60 * 1000;
  var CONSENT_EVENT = 'metrika:consent';

  function hasConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      return (
        data &&
        data.choice === 'granted' &&
        typeof data.ts === 'number' &&
        Date.now() - data.ts < CONSENT_TTL_MS
      );
    } catch (e) {
      return false;
    }
  }

  var loaded = false;
  function loadCounter() {
    if (loaded) return;
    loaded = true;

    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=111460043', 'ym');

    // defer:true — автоматический хит при загрузке отключён; url и referer
    // передаются вручную при каждом ym('hit') в src/lib/metrika.ts.
    // ssr:true из исходного сниппета не нужен: это флаг для SSR-сайтов.
    window.ym(111460043, 'init', {
      defer: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }

  if (hasConsent()) {
    loadCounter();
  } else {
    window.addEventListener(CONSENT_EVENT, function onConsent() {
      if (!hasConsent()) return; // событие могло быть об отказе
      window.removeEventListener(CONSENT_EVENT, onConsent);
      loadCounter();
    });
  }
})();
