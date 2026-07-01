// Google Tag Manager bootstrap (externalized so index.html's strict CSP can run
// it under script-src 'self' without needing 'unsafe-inline'). Container ID lives
// here; gtm.js itself is loaded from googletagmanager.com (whitelisted in CSP).
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-KBCPKSJV');
