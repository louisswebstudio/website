// ── LANGUAGE SWITCHER ────────────────────────────────────────────────────
// French default — see the init() note at the bottom of this file. Whatever
// this resolves to on first load is what Googlebot indexes.
let currentLang = localStorage.getItem('ls_lang') || 'fr';

const translations = {
  en: { flagSrc: 'https://flagcdn.com/w40/gb.png', code: 'EN' },
  fr: { flagSrc: 'https://flagcdn.com/w40/fr.png', code: 'FR' },
  ar: { flagSrc: 'https://flagcdn.com/w40/sa.png', code: 'AR' }
};

function toggleLang() {
  document.getElementById('langSwitcher').classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const switcher = document.getElementById('langSwitcher');
  if (switcher && !switcher.contains(e.target)) {
    switcher.classList.remove('open');
  }
});

var waMessages = {
  generic:  { en: 'Hi, I want to start a project.', fr: 'Bonjour, je souhaite démarrer un projet.', ar: 'مرحباً، أريد البدء في مشروع.' },
  hero:     { en: 'Hi, I want a website that can bring me clients.', fr: "Bonjour, je veux un site web qui m'apporte des clients.", ar: 'مرحباً، أريد موقع ويب يجلب لي عملاء.' },
  starter:  { en: "Hi, I'm interested in the Starter Website package (1400 DH).", fr: 'Bonjour, je suis intéressé par le pack Site Vitrine à 1400 DH.', ar: 'مرحباً، أنا مهتم بباقة الموقع المبتدئ بسعر 1400 درهم.' },
  business: { en: "Hi, I'm interested in the Business Website package (2500 DH).", fr: 'Bonjour, je suis intéressé par le pack Site Business à 2500 DH.', ar: 'مرحباً، أنا مهتم بباقة موقع الأعمال بسعر 2500 درهم.' },
  premium:  { en: "Hi, I'd like to discuss a premium website project.", fr: "Bonjour, je souhaite discuter d'un projet de site web premium.", ar: 'مرحباً، أريد مناقشة مشروع موقع ويب مميز.' }
};

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ls_lang', lang);

  // Update button display
  // alt moves with src so the badge never announces the previous language.
  document.getElementById('activeFlagImg').src = translations[lang].flagSrc;
  document.getElementById('activeFlagImg').alt = translations[lang].code;
  document.getElementById('activeLangCode').textContent = translations[lang].code;

  // Update active state in dropdown
  document.getElementById('opt-en').classList.toggle('active', lang === 'en');
  document.getElementById('opt-fr').classList.toggle('active', lang === 'fr');
  document.getElementById('opt-ar').classList.toggle('active', lang === 'ar');

  // Close dropdown
  document.getElementById('langSwitcher').classList.remove('open');

  // Translate all elements with data-en / data-fr
  applyTranslations(lang);
}

function applyTranslations(lang) {
  // Elements with simple text content
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val === null) return;
    // If it contains HTML tags use innerHTML, otherwise textContent
    if (val.includes('<')) {
      el.innerHTML = val;
    } else {
      // Preserve child elements (like <em>, <span>) — only update if no important children
      if (el.children.length === 0) {
        el.textContent = val;
      } else {
        el.innerHTML = val;
      }
    }
  });

  // Update WhatsApp CTA message based on language
  document.querySelectorAll('[data-wa-type]').forEach(el => {
    const msgs = waMessages[el.getAttribute('data-wa-type')] || waMessages.generic;
    el.setAttribute('href', 'https://wa.me/212716490397?text=' + encodeURIComponent(msgs[lang] || msgs.en));
    // Open WhatsApp in a new tab so the user keeps the site open
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  // Update html lang + dir (RTL for Arabic)
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Re-render process steps in new language
  if (typeof renderSteps === 'function') {
    renderSteps(typeof activeStep !== 'undefined' ? activeStep : 0);
  }

  // Re-render testimonials in new language
  const testiGrid = document.getElementById('testiGrid');
  if (testiGrid && typeof renderTestiCards === 'function') {
    testiGrid.innerHTML = renderTestiCards();
    testiGrid.querySelectorAll('[data-en]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val) el.innerHTML = val;
    });
    if (window.initGlowCards) window.initGlowCards();
  }

  // Animate hero title words (blur-in) — runs on load and every language switch
  animateHeroTitle();
  // Same blur-in for every section heading (each triggers as it scrolls in)
  setupBlurHeadings();

  // Page title comes from data attributes on the <title> element itself, so the
  // tag in the HTML stays the single source of truth. This used to be three
  // hardcoded strings that silently replaced the optimised <title> on every
  // load — Google indexes the rendered DOM, so the tuned title never reached
  // it and the brand name led the SERP entry instead of the keyword.
  const titleEl = document.querySelector('title[data-en]');
  if (titleEl) {
    const t = titleEl.getAttribute('data-' + lang);
    if (t) document.title = t;
  }

  // Keep description/og/twitter in the rendered language (see site-chrome.js).
  document.querySelectorAll('meta[data-en]').forEach(function (m) {
    const v = m.getAttribute('data-' + lang);
    if (v) m.setAttribute('content', v);
  });
}

// ── Hero title reveal ──
// The hero <h1> is the LCP element, so its reveal is pure CSS (the `heroTitleIn`
// keyframes in site.css) which auto-play at render time. Previously this wrapped
// each word in an opacity:0 span and revealed it via requestAnimationFrame — but
// it only ran AFTER the deferred bundle executed, so under CPU throttling the
// hero stayed hidden and LCP landed ~7s out. Kept as a no-op because
// applyTranslations() still calls it on every language switch; the <h1> text is
// updated in place by applyTranslations and needs no per-word animation.
function animateHeroTitle() { /* hero reveal is CSS-only now — see site.css */ }

// Add the `.animate` class on the next frame so the freshly-inserted spans
// reliably play the blur-in. Failsafe: if that frame is dropped or the
// animation never runs (slow device, tab loaded in the background, gradient
// word mis-painting on mobile), reveal the words outright so the headline is
// never left invisible. 1600ms clears the longest legit run (desktop stagger).
function revealBlurWords(scope) {
  requestAnimationFrame(function () {
    scope.querySelectorAll('.blur-word').forEach(function (w) { w.classList.add('animate'); });
  });
  setTimeout(function () {
    scope.querySelectorAll('.blur-word').forEach(function (w) {
      if (parseFloat(getComputedStyle(w).opacity) < 0.99) w.classList.add('shown');
    });
  }, 1600);
}

function buildBlurWords(el, state, delay) {
  const nodes = Array.from(el.childNodes);
  el.innerHTML = '';
  nodes.forEach(function (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Split into words while preserving the whitespace between them
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (part === '') return;
        if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(part)); return; }
        const span = document.createElement('span');
        span.className = 'blur-word';
        span.textContent = part;
        span.style.animationDelay = (state.i++ * delay) + 'ms';
        el.appendChild(span);
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Leave hard line breaks untouched — wrapping a <br> would break the layout
      if (node.tagName === 'BR') { el.appendChild(node); return; }
      // Keep styled inline elements (e.g. .hero-h1-blue gradient, <em>) intact; animate as one unit
      node.classList.add('blur-word');
      node.style.animationDelay = (state.i++ * delay) + 'ms';
      el.appendChild(node);
    }
  });
}

// ── Section-heading blur-in ──
// Same BlurText effect as the hero, but each heading animates when it scrolls
// into view. Re-runs on every language switch (applyTranslations rebuilds the
// heading text, so the words must be re-wrapped each time).
var BLUR_HEADING_SELECTOR =
  '.work-heading, .transformation-h, .testimonials-heading, .process-h, .pricing-h, .faq-title, .footer-cta-h';
var blurHeadingObs = null;

function animateBlurWords(el) {
  revealBlurWords(el);
}

function setupBlurHeadings(delay) {
  delay = delay || 90; // ms between words
  if (blurHeadingObs) blurHeadingObs.disconnect();
  blurHeadingObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      animateBlurWords(e.target);
      blurHeadingObs.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(BLUR_HEADING_SELECTOR).forEach(function (h) {
    buildBlurWords(h, { i: 0 }, delay);
    // Already on screen (initial load near top, or a re-wrap after scrolling)?
    // Animate right away; otherwise wait for it to scroll into view.
    var r = h.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      animateBlurWords(h);
    } else {
      blurHeadingObs.observe(h);
    }
  });
}

// ── Event wiring (replaces former inline onclick handlers; CSP-safe) ──────
// Language switcher button toggles the dropdown; each option sets the language.
document.querySelector('.lang-btn')?.addEventListener('click', toggleLang);
['en', 'fr', 'ar'].forEach(function (l) {
  document.getElementById('opt-' + l)?.addEventListener('click', function () { setLang(l); });
});

// Apply on page load. French is the primary language: the title, description
// and JSON-LD all target Morocco in French, and Googlebot crawls as en-US — so
// the old "default to English" branch made the crawler render an English page
// underneath French metadata. Only Arabic browsers auto-switch (Googlebot never
// sends ar-*); everyone else, humans and crawlers alike, gets the same French
// page the HTML declares. The EN/FR/AR switcher still works for visitors.
(function init() {
  let saved = localStorage.getItem('ls_lang');
  if (!saved) {
    const bl = (navigator.language || navigator.userLanguage || 'fr').toLowerCase();
    saved = bl.startsWith('ar') ? 'ar' : 'fr';
  }
  currentLang = saved;
  setLang(currentLang);
})();

// ── Before/After Swipe Slider (mobile only) ──
(function initBaSlider() {
  const slider  = document.getElementById('baSlider');
  const after   = document.getElementById('baAfter');
  const handle  = document.getElementById('baHandle');
  if (!slider || !after || !handle) return;

  let dragging = false;

  function setPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(4, Math.min(96, pct));
    const remaining = 100 - pct;
    after.style.clipPath  = 'inset(0 ' + remaining + '% 0 0)';
    handle.style.left     = pct + '%';
  }

  // Mouse
  slider.addEventListener('mousedown', function(e) {
    dragging = true;
    setPosition(e.clientX);
    e.preventDefault();
  });
  document.addEventListener('mousemove', function(e) {
    if (dragging) setPosition(e.clientX);
  });
  document.addEventListener('mouseup', function() { dragging = false; });

  // Touch
  slider.addEventListener('touchstart', function(e) {
    dragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    if (dragging) setPosition(e.touches[0].clientX);
  }, { passive: true });
  document.addEventListener('touchend', function() { dragging = false; });
})();
