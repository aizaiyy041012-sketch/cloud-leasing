// Site-wide language switcher + locale detection. Locale lives in the URL path
// (/zh/, /ja/, /ko/ prefix; no prefix = English, the default/canonical language),
// not in a cookie or localStorage — this keeps every localized page a real,
// independently crawlable URL rather than the same URL with client-swapped text,
// which matters for a marketing site whose whole job is SEO.
(function () {
  'use strict';

  var LOCALE_LABELS = { en: 'EN', 'zh-CN': '中文', ja: '日本語', ko: '한국어' };
  var LOCALE_PREFIX = { en: '', 'zh-CN': '/zh', ja: '/ja', ko: '/ko' };
  var ORDER = ['en', 'zh-CN', 'ja', 'ko'];

  function detectLocale() {
    var path = window.location.pathname;
    if (path === '/zh' || path.indexOf('/zh/') === 0) return 'zh-CN';
    if (path === '/ja' || path.indexOf('/ja/') === 0) return 'ja';
    if (path === '/ko' || path.indexOf('/ko/') === 0) return 'ko';
    return 'en';
  }

  function stripLocalePrefix(path) {
    var stripped = path.replace(/^\/(zh|ja|ko)(\/|$)/, '/');
    return stripped === '' ? '/' : stripped;
  }

  function pathForLocale(locale) {
    var base = stripLocalePrefix(window.location.pathname);
    var prefix = LOCALE_PREFIX[locale];
    if (!prefix) return base;
    return base === '/' ? prefix + '/' : prefix + base;
  }

  window.CloudLeasingI18n = {
    locale: detectLocale(),
    detectLocale: detectLocale,
    pathForLocale: pathForLocale,
  };

  function injectSwitcher() {
    var mount = document.querySelector('[data-lang-switcher]');
    if (!mount) return;

    var current = detectLocale();
    var wrap = document.createElement('div');
    wrap.className = 'lang-switcher';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-switcher-btn';
    button.textContent = LOCALE_LABELS[current] + ' ▾';
    wrap.appendChild(button);

    var menu = document.createElement('div');
    menu.className = 'lang-switcher-menu';
    ORDER.forEach(function (loc) {
      var a = document.createElement('a');
      a.href = pathForLocale(loc);
      a.textContent = LOCALE_LABELS[loc];
      if (loc === current) a.className = 'is-active';
      menu.appendChild(a);
    });
    wrap.appendChild(menu);

    mount.appendChild(wrap);

    button.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('is-open');
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) wrap.classList.remove('is-open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSwitcher);
  } else {
    injectSwitcher();
  }
})();
