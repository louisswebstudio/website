// Google Tag Manager loader (shared by every page; container ID lives here).
//
// External file (not inline) so index.html's strict CSP can run it under
// script-src 'self' without 'unsafe-inline'. Included with `defer`, and gtm.js
// itself is only fetched on the FIRST user interaction (tap, scroll, key,
// mouse move). That keeps ~130 KB of tag JS out of the initial load entirely,
// so it costs nothing in FCP/LCP/TBT — Lighthouse never sees it.
//
// dataLayer is stubbed immediately: events pushed before gtm.js arrives (e.g.
// the Cal.com booking event) queue in the array and are replayed by GTM once
// it loads. Trade-off: visitors who leave without a single interaction (true
// bounces) are not tracked — accepted in exchange for the performance win.
(function (w, d) {
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  var events = ['pointerdown', 'touchstart', 'keydown', 'mousemove', 'wheel', 'scroll'];
  var opts = { once: true, passive: true, capture: true };
  var loaded = false;

  function loadGtm() {
    if (loaded) return;
    loaded = true;
    for (var i = 0; i < events.length; i++) w.removeEventListener(events[i], loadGtm, opts);
    var f = d.getElementsByTagName('script')[0],
      j = d.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-KBCPKSJV';
    f.parentNode.insertBefore(j, f);
  }

  for (var i = 0; i < events.length; i++) w.addEventListener(events[i], loadGtm, opts);
})(window, document);
