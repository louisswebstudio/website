/* theme-toggle.js — wires the light/dark switches in the navbar and the mobile
   menu. The initial theme is already resolved before paint by theme-init.js;
   this file only handles user interaction and persistence.

   Deferred on purpose: nothing here affects the first paint.

   Persistence is a cookie ('ls_theme', 1 year, SameSite=Lax) rather than
   localStorage so the value is available to the document synchronously in
   <head> and would survive a move off a purely static host. */
(function () {
  var COOKIE = 'ls_theme';
  var MAX_AGE = 60 * 60 * 24 * 365;   // 1 year
  var root = document.documentElement;

  var toggles = document.querySelectorAll('.theme-toggle');
  if (!toggles.length) return;

  /* Accessible names per language. The site's language switcher rewrites any
     element carrying data-en/data-fr/data-ar, which would blow away the inline
     SVGs — so the toggle's label is set from JS instead, keyed off <html lang>. */
  var LABELS = {
    en: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode', label: 'Dark mode' },
    fr: { toLight: 'Passer en mode clair', toDark: 'Passer en mode sombre', label: 'Mode sombre' },
    ar: { toLight: 'التبديل إلى الوضع الفاتح', toDark: 'التبديل إلى الوضع الداكن', label: 'الوضع الداكن' }
  };

  function strings() {
    return LABELS[root.getAttribute('lang')] || LABELS.en;
  }

  function writeCookie(theme) {
    try {
      document.cookie = COOKIE + '=' + theme +
        ';path=/;max-age=' + MAX_AGE + ';SameSite=Lax';
    } catch (e) { /* cookies blocked — the toggle still works for this page */ }
  }

  /* Keep the browser UI (address bar on mobile) in step with the page. */
  function syncMetaThemeColor(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f7f9' : '#060607');
  }

  function syncControls(theme) {
    var s = strings();
    for (var i = 0; i < toggles.length; i++) {
      var btn = toggles[i];
      /* aria-pressed describes the control's own state ("dark mode is on"),
         while aria-label says what activating it will do. */
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'light' ? s.toDark : s.toLight);
      btn.setAttribute('title', theme === 'light' ? s.toDark : s.toLight);
    }
    var rowLabels = document.querySelectorAll('.theme-toggle-label');
    for (var j = 0; j < rowLabels.length; j++) rowLabels[j].textContent = s.label;
  }

  function apply(theme, animate) {
    if (animate) {
      root.classList.add('theme-transition');
      window.setTimeout(function () {
        root.classList.remove('theme-transition');
      }, 260);
    }
    root.setAttribute('data-theme', theme);
    syncMetaThemeColor(theme);
    syncControls(theme);
  }

  function onToggle() {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    writeCookie(next);
    apply(next, true);
  }

  for (var i = 0; i < toggles.length; i++) {
    /* Native <button> elements, so Enter/Space and focus order come for free. */
    toggles[i].addEventListener('click', onToggle);
  }

  /* The site defaults to light for every visitor without an ls_theme cookie
     (see theme-init.js), so the OS colour scheme is deliberately not followed —
     dark is only ever reached through this toggle. */

  /* The language switcher swaps <html lang>/dir after load; re-label then. */
  if (window.MutationObserver) {
    new MutationObserver(function () {
      syncControls(root.getAttribute('data-theme') || 'light');
    }).observe(root, { attributes: true, attributeFilter: ['lang'] });
  }

  syncMetaThemeColor(root.getAttribute('data-theme') || 'light');
  syncControls(root.getAttribute('data-theme') || 'light');
})();
