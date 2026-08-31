// ── City-page testimonials ──
// Renders the same curated, studio-wide client reviews shown on the homepage
// (see the testiData in assets/index-main.js) as a static grid. Kept as a
// separate static list here (not fetched) so every page shows the identical,
// already-vetted set of reviews — no CMS round trip, nothing to go stale or
// show placeholder/test entries.
//
// These are studio-wide client reviews, not city-specific ones, and the section
// heading says so. Do not relabel them as local reviews.

(function () {
  var grid = document.getElementById('cityTestiGrid');
  var section = document.getElementById('cityTesti');
  if (!grid || !section) return;

  var REVIEWS = [
    {
      img: 'assets/images/clients/el-majdoub-client.webp',
      name: 'Soufiane El Majdoub',
      role_en: 'CEO, El Majdoub Immobilier', role_fr: 'PDG, El Majdoub Immobilier', role_ar: 'الرئيس التنفيذي، El Majdoub Immobilier',
      quote_en: "Our old site had been hacked, we needed a reliable and fast solution. Louiss Web Studio rebuilt our entire rental platform, clean, fast, and secure. We recommend them.",
      quote_fr: "Notre ancien site avait été piraté, on avait besoin d'une solution fiable et rapide. Louiss Web Studio a reconstruit toute la plateforme de location, propre, rapide et sécurisée. On recommande.",
      quote_ar: "تعرّض موقعنا القديم للاختراق، وكنا بحاجة إلى حل موثوق وسريع. أعادت Louiss Web Studio بناء منصة الكراء بالكامل، نظيفة وسريعة وآمنة. نوصي بها بشدة."
    },
    {
      img: 'assets/images/clients/maison-monchef-client.webp',
      name: 'Monsef Hajji',
      role_en: 'CEO, Maison Monchef', role_fr: 'PDG, Maison Monchef', role_ar: 'الرئيس التنفيذي، Maison Monchef',
      quote_en: "We needed a real estate platform working in French, English and Arabic, with a team able to manage our listings without depending on a developer. Louiss Web Studio delivered exactly that, professional from start to finish.",
      quote_fr: "Nous avions besoin d'une plateforme immobilière fonctionnant en français, anglais et arabe, avec une équipe capable de gérer nos annonces sans dépendre d'un développeur. Louiss Web Studio a livré exactement ça, professionnel du début à la fin.",
      quote_ar: "كنا بحاجة إلى منصة عقارية تعمل بالفرنسية والإنجليزية والعربية، مع فريق قادر على إدارة إعلاناتنا دون الاعتماد على مطوّر. قدّمت Louiss Web Studio بالضبط ذلك، باحترافية من البداية إلى النهاية."
    },
    {
      img: 'assets/images/clients/othman-abaakil-client.webp',
      name: 'Othman Abaakil', rating: 5,
      role_en: 'Software Engineer', role_fr: 'Ingénieur Logiciel', role_ar: 'مهندس برمجيات',
      quote_en: "I am incredibly impressed by the quality of their work. Not only is the design visually stunning, but the performance, mobile responsiveness, and clean architecture are top-notch.",
      quote_fr: "Je suis vraiment impressionné par la qualité de leur travail. Le design est magnifique, mais les performances, la réactivité mobile et l'architecture du code sont également excellentes.",
      quote_ar: "أنا معجب جدًا بجودة عملهم. التصميم ليس فقط مذهلاً بصريًا، بل الأداء والتوافق مع الهواتف المحمولة والبنية النظيفة للموقع ممتازة أيضًا."
    },
    {
      img: 'assets/images/clients/khalid-oussi-client.webp',
      name: 'Khalid Oussi', rating: 5,
      role_en: 'CEO, Clothing Brand', role_fr: 'PDG, Marque de Vêtements', role_ar: 'الرئيس التنفيذي، علامة ملابس',
      quote_en: "I really recommend this studio, they are very professional, their work is top notch!",
      quote_fr: "Je recommande vraiment ce studio, ils sont très professionnels, leur travail est excellent !",
      quote_ar: "أنصح بشدة بهذا الاستوديو، إنهم محترفون جدًا وعملهم ممتاز!"
    },
    {
      img: 'assets/images/clients/arwa-banouni-client.webp',
      name: 'Arwa Banouni', rating: 5,
      role_en: 'Photographer', role_fr: 'Photographe', role_ar: 'مصورة فوتوغرافية',
      quote_en: "I hired Louiss Web Studio to create my website in Tangier and the result exceeded my expectations. Reda delivered a modern, fast site optimized for local SEO. I highly recommend them for any business in Morocco looking for a serious web developer.",
      quote_fr: "J'ai fait appel à Louiss Web Studio pour la création de mon site web à Tanger et le résultat a dépassé mes attentes. Reda a livré un site moderne, rapide et optimisé pour le référencement local. Je recommande vivement pour toute entreprise au Maroc qui cherche un développeur web sérieux.",
      quote_ar: "استعنت بـ Louiss Web Studio لإنشاء موقعي الإلكتروني بطنجة، وكانت النتيجة أفضل من توقعاتي. قدّم رضا موقعًا عصريًا وسريعًا ومحسّنًا لمحركات البحث المحلية. أنصح به بشدة لأي شركة بالمغرب تبحث عن مطوّر ويب جاد."
    },
    {
      img: 'assets/images/clients/oussama-boukrim-client.webp',
      name: 'Oussama Boukrim', rating: 5,
      role_en: 'Entrepreneur', role_fr: 'Entrepreneur', role_ar: 'رائد أعمال',
      quote_en: "We really like the service, website was delivered with good quality.",
      quote_fr: "Nous avons vraiment apprécié le service, le site a été livré avec une bonne qualité.",
      quote_ar: "أعجبتنا الخدمة كثيرًا، تم تسليم الموقع بجودة جيدة."
    }
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Same card markup as the homepage's testimonial carousel (see
  // window.renderTestiCards in assets/index-main.js) so this component reads
  // identically wherever it appears.
  function card(t) {
    var name = esc(t.name || '');
    var avatar = t.img
      ? '<img src="' + esc(t.img) + '" alt="' + name + '" width="96" height="96" loading="lazy" class="testi-avatar-img">'
      : (name.trim().charAt(0).toUpperCase() || '?');
    return '<div class="testimonial-card glow-card">'
      + '<svg class="quote-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="#525252"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="#525252"/></svg>'
      + '<p class="testimonial-text" data-en="' + esc(t.quote_en) + '" data-fr="' + esc(t.quote_fr) + '" data-ar="' + esc(t.quote_ar) + '">' + esc(t.quote_fr) + '</p>'
      + '<div class="testimonial-author">'
      + '<div class="author-avatar">' + avatar + '</div>'
      + '<div>'
      + '<div class="author-name">' + name + '</div>'
      + '<div class="author-role" data-en="' + esc(t.role_en) + '" data-fr="' + esc(t.role_fr) + '" data-ar="' + esc(t.role_ar) + '">' + esc(t.role_fr) + '</div>'
      + '</div></div></div>';
  }

  grid.innerHTML = REVIEWS.map(card).join('');
  section.removeAttribute('hidden');

  // Match whatever language is already active (site-chrome.js runs its own
  // init before this script, so document.documentElement.lang is already set).
  var lang = document.documentElement.lang;
  if (lang && lang !== 'fr') {
    grid.querySelectorAll('[data-en]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val != null) el.textContent = val;
    });
  }

  if (window.initGlowCards) window.initGlowCards();
  if (window.initReveal) window.initReveal();

  // ── Carousel arrows: scroll the grid one card-page at a time (mirrors
  // the homepage's #testiPrev/#testiNext wiring in assets/index-main.js) ──
  var prevBtn = document.getElementById('cityTestiPrev');
  var nextBtn = document.getElementById('cityTestiNext');
  if (prevBtn && nextBtn) {
    var isRTL = function () { return document.documentElement.getAttribute('dir') === 'rtl'; };
    var step = function () {
      var card = grid.querySelector('.testimonial-card');
      var gap = parseFloat(getComputedStyle(grid).columnGap) || 24;
      return card ? card.getBoundingClientRect().width + gap : grid.clientWidth;
    };
    var updateArrows = function () {
      var maxScroll = grid.scrollWidth - grid.clientWidth - 1;
      var pos = Math.abs(grid.scrollLeft);
      prevBtn.disabled = pos <= 1;
      nextBtn.disabled = pos >= maxScroll || maxScroll <= 0;
    };
    nextBtn.addEventListener('click', function () { grid.scrollBy({ left: (isRTL() ? -1 : 1) * step(), behavior: 'smooth' }); });
    prevBtn.addEventListener('click', function () { grid.scrollBy({ left: (isRTL() ? 1 : -1) * step(), behavior: 'smooth' }); });
    grid.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
    requestAnimationFrame(updateArrows);
    window.addEventListener('load', updateArrows);
  }
})();
