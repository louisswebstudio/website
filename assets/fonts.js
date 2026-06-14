// Non-render-blocking web-font loading (shared by every page).
//
// Each font stylesheet is declared in the HTML as:
//     <link rel="stylesheet" href="…" media="print" data-async-font>
// A stylesheet whose media query doesn't match (print, on screen) is fetched by
// the browser's preload scanner at low priority WITHOUT blocking first paint.
// This script then flips media to "all" once the sheet has loaded, so the font
// applies as soon as it's ready. All font stylesheets already use
// `display=swap`, so text shows immediately in the fallback face and swaps in
// when the web font arrives — no invisible-text flash.
//
// Doing the media swap here (rather than an inline `onload=` handler) keeps it
// compatible with the strict, no-'unsafe-inline' CSP on the home page. A
// <noscript> block in each page keeps fonts working when JS is disabled.
(function () {
  function activate(link) { link.media = 'all'; }
  var links = document.querySelectorAll('link[data-async-font]');
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.sheet) {
      activate(link); // already finished loading before this script ran
    } else {
      link.addEventListener('load', (function (l) {
        return function () { activate(l); };
      })(link));
    }
  }
})();
