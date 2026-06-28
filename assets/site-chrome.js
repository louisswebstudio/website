// ── Shared site chrome: language switcher + mobile menu + scroll reveal ──
// Used by index.html sub-pages (privacy.html, terms.html, project pages).

(function () {
  // ── LANGUAGE SWITCHER ──
  const translations = {
    en: { flagSrc: 'https://flagcdn.com/w40/gb.png', code: 'EN' },
    fr: { flagSrc: 'https://flagcdn.com/w40/fr.png', code: 'FR' },
    ar: { flagSrc: 'https://flagcdn.com/w40/sa.png', code: 'AR' }
  };

  const waMessages = {
    generic: { en: 'Hi, I want to start a project.', fr: 'Bonjour, je souhaite démarrer un projet.', ar: 'مرحباً، أريد البدء في مشروع.' },
    hero:    { en: 'Hi, I want a website that can bring me clients.', fr: "Bonjour, je veux un site web qui m'apporte des clients.", ar: 'مرحباً، أريد موقع ويب يجلب لي عملاء.' }
  };

  let currentLang = localStorage.getItem('ls_lang') || 'en';

  window.toggleLang = function () {
    const s = document.getElementById('langSwitcher');
    if (s) s.classList.toggle('open');
  };

  document.addEventListener('click', function (e) {
    const s = document.getElementById('langSwitcher');
    if (s && !s.contains(e.target)) s.classList.remove('open');
  });

  window.setLang = function (lang) {
    if (!translations[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('ls_lang', lang);

    const flag = document.getElementById('activeFlagImg');
    const code = document.getElementById('activeLangCode');
    if (flag) flag.src = translations[lang].flagSrc;
    if (code) code.textContent = translations[lang].code;

    ['en', 'fr', 'ar'].forEach(function (l) {
      const opt = document.getElementById('opt-' + l);
      if (opt) opt.classList.toggle('active', l === lang);
    });

    const s = document.getElementById('langSwitcher');
    if (s) s.classList.remove('open');

    applyTranslations(lang);
  };

  function applyTranslations(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      const val = el.getAttribute('data-' + lang);
      if (val === null) return;
      if (val.includes('<') || el.children.length > 0) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-wa-type]').forEach(function (el) {
      const msgs = waMessages[el.getAttribute('data-wa-type')] || waMessages.generic;
      el.setAttribute('href', 'https://wa.me/212716490397?text=' + encodeURIComponent(msgs[lang] || msgs.en));
    });

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Per-page localized <title> via data attributes on the <title> element.
    const titleEl = document.querySelector('title[data-en]');
    if (titleEl) {
      const t = titleEl.getAttribute('data-' + lang);
      if (t) document.title = t;
    }
  }

  // ── MOBILE MENU ──
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileMenuClose');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('open');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
      mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.mobile-menu-link, .mobile-menu-cta').forEach(function (el) {
      el.addEventListener('click', closeMobileMenu);
    });
  }

  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.05 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── INIT ──
  (function init() {
    let saved = localStorage.getItem('ls_lang');
    if (!saved) {
      const bl = (navigator.language || navigator.userLanguage || 'fr').toLowerCase();
      saved = bl.startsWith('ar') ? 'ar' : bl.startsWith('en') ? 'en' : 'fr';
    }
    window.setLang(saved);
  })();
})();
