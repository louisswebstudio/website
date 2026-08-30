// ── City-page testimonials ──
// The homepage renders reviews through index-main.js (window.renderTestiCards +
// #testiGrid), which is coupled to that page's carousel. City pages only need a
// static grid, so this fetches the same Sanity documents directly — a plain GET
// against the CDN-backed query API, same approach as assets/index-cms.js, no SDK.
//
// These are studio-wide client reviews, not city-specific ones, and the section
// heading says so. Do not relabel them as local reviews.

(function () {
  var SANITY = { projectId: 'jlkob3wz', dataset: 'production', apiVersion: '2024-05-01' };

  var grid = document.getElementById('cityTestiGrid');
  var section = document.getElementById('cityTesti');
  if (!grid || !section) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function stars(n) {
    var r = Math.max(0, Math.min(5, parseInt(n, 10) || 5));
    var out = '';
    for (var i = 0; i < r; i++) {
      out += '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">'
           + '<path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" '
           + 'fill="currentColor"/></svg>';
    }
    return '<div class="ct-stars" role="img" aria-label="' + r + '/5">' + out + '</div>';
  }

  function card(t) {
    var name = esc(t.clientName || '');
    var role = esc(t.clientRole || t.projectTitle || '');
    var initial = name ? name.trim().charAt(0).toUpperCase() : '?';
    return '<figure class="ct-card">'
      + stars(t.rating)
      + '<blockquote class="ct-quote">' + esc(t.quote || '') + '</blockquote>'
      + '<figcaption class="ct-meta">'
      + '<span class="ct-avatar" aria-hidden="true">' + esc(initial) + '</span>'
      + '<span class="ct-who"><span class="ct-name">' + name + '</span>'
      + (role ? '<span class="ct-role">' + role + '</span>' : '')
      + '</span></figcaption></figure>';
  }

  var url = 'https://' + SANITY.projectId + '.apicdn.sanity.io/v' + SANITY.apiVersion
    + '/data/query/' + SANITY.dataset + '?query='
    + encodeURIComponent('*[_type == "testimonial"] | order(_createdAt asc) {'
      + 'clientName, clientRole, quote, rating, "projectTitle": projectRef->title }');

  fetch(url)
    .then(function (r) {
      if (!r.ok) throw new Error('Sanity query failed: ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var list = (data && data.result) || [];
      if (!list.length) { section.remove(); return; }
      grid.innerHTML = list.slice(0, 6).map(card).join('');
      section.removeAttribute('hidden');
      if (window.initReveal) window.initReveal();
    })
    .catch(function (err) {
      // No reviews rendered rather than an empty shell with a heading over nothing.
      console.warn('Testimonials could not be loaded from the CMS.', err);
      section.remove();
    });
})();
