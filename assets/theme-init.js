/* theme-init.js — resolves the colour theme BEFORE first paint.

   Loaded render-blocking (no defer/async) in <head> ahead of the stylesheets so
   assets/theme.css applies on the very first frame; a deferred script would let
   the dark palette paint once and then snap to light.

   It is an external file rather than an inline <script> on purpose: index.html
   ships a strict CSP whose script-src has no 'unsafe-inline' (see vercel.json),
   so an inline bootstrap would simply be blocked.

   Order of precedence:
     1. ls_theme cookie   — an explicit choice the visitor made
     2. prefers-color-scheme: light
     3. dark              — the site's original default

   Persistence is a cookie, not localStorage, so the value is readable by the
   document before any module runs and could later be read server-side if the
   site ever stops being fully static. Note the language switcher still uses
   localStorage ('ls_lang'); the two are deliberately separate stores. */
(function () {
  var theme;

  try {
    var m = document.cookie.match(/(?:^|;\s*)ls_theme=(light|dark)(?:\s*;|$)/);
    if (m) theme = m[1];
  } catch (e) { /* cookies blocked — fall through to the system preference */ }

  if (!theme) {
    theme = (window.matchMedia &&
             window.matchMedia('(prefers-color-scheme: light)').matches)
      ? 'light'
      : 'dark';
  }

  document.documentElement.setAttribute('data-theme', theme);

  /* Keep the mobile browser chrome in step from the very first paint. The
     <meta name="theme-color"> tag is declared earlier in <head>, so it is
     already parsed by the time this runs. */
  if (theme === 'light') {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#f6f7f9');
  }
})();
