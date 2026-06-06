  // ── Hamburger / Mobile menu ──
  const hamburgerBtn      = document.getElementById('hamburgerBtn');
  const mobileMenu        = document.getElementById('mobileMenu');
  const mobileClose       = document.getElementById('mobileMenuClose');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileMenuOverlay.classList.add('open');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenuOverlay.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

  // Close on any menu link tap
  document.querySelectorAll('.mobile-menu-link, .mobile-menu-cta').forEach(el => {
    el.addEventListener('click', closeMobileMenu);
  });

  // Single page — no redirect
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  revealEls.forEach(el => revealObs.observe(el));

  // ── Cursor-driven border-glow: track cursor angle + edge proximity ──
  // Reusable across pricing, testimonial and project (bento) cards. Idempotent
  // and auto-injects the .edge-light layer so dynamically rendered cards work too.
  window.initGlowCards = function () {
    document.querySelectorAll('.glow-card').forEach(card => {
      if (card.dataset.glowInit) return;
      card.dataset.glowInit = '1';

      // ensure the outer glow layer exists
      if (!card.querySelector(':scope > .edge-light')) {
        const el = document.createElement('span');
        el.className = 'edge-light';
        el.setAttribute('aria-hidden', 'true');
        card.prepend(el);
      }

      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (e.clientX - rect.left) - cx;
        const dy = (e.clientY - rect.top) - cy;

        // how close the pointer is to the nearest edge (0 center → 1 edge)
        let kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
        let ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
        const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

        // angle from the card center to the pointer
        let angle = 0;
        if (dx !== 0 || dy !== 0) {
          angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          if (angle < 0) angle += 360;
        }

        card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
        card.style.setProperty('--cursor-angle', angle.toFixed(3) + 'deg');
      });
    });
  };
  window.initGlowCards();

  // Stagger sibling reveals
  document.querySelectorAll('.bento-grid, .testimonial-grid, .services-list, .process-steps').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      if (child.classList.contains('reveal')) child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // ── PROCESS: auto-advance every 4s with progress bar ──────────────────
  const stepDataEn = [
    {
      title: 'Discovery',
      body: 'We start by understanding your business, goals, and audience. Deep discovery ensures everything we build is purposeful and targeted.'
    },
    {
      title: 'Ideas & Design',
      body: 'We translate insights into beautiful, high-fidelity designs in Figma — every pixel, spacing, and interaction crafted before a line of code is written.'
    },
    {
      title: 'Development',
      body: 'Pixel-perfect implementation. Fast, clean, semantic code optimised for performance, SEO, and every device and browser.'
    },
    {
      title: 'Launch',
      body: 'We test thoroughly, then go live. Post-launch support included — your site is monitored and ready from day one.'
    }
  ];
  const stepDataFr = [
    {
      title: 'Découverte',
      body: 'Nous commençons par comprendre votre activité, vos objectifs et votre audience. Une découverte approfondie pour bâtir quelque chose de ciblé et efficace.'
    },
    {
      title: 'Idées & Design',
      body: 'Nous transformons vos insights en designs haute-fidélité sur Figma — chaque pixel, espacement et interaction pensés avant d\'écrire une seule ligne de code.'
    },
    {
      title: 'Développement',
      body: 'Intégration pixel-perfect. Code propre, rapide et sémantique, optimisé pour la performance, le SEO et tous les appareils.'
    },
    {
      title: 'Mise en ligne',
      body: 'Nous testons rigoureusement, puis nous mettons en ligne. Support post-lancement inclus — votre site est suivi et opérationnel dès le premier jour.'
    }
  ];
  const stepDataAr = [
    { title: 'الاستكشاف', body: 'نبدأ بفهم عملك وأهدافك وجمهورك المستهدف. الاستكشاف العميق يضمن أن كل ما نبنيه هادف ومُوجَّه نحو النتائج.' },
    { title: 'الأفكار والتصميم', body: 'نحوّل الأفكار إلى تصاميم عالية الدقة في Figma — كل بكسل ومسافة وتفاعل مُصمَّم بعناية قبل كتابة سطر واحد من الكود.' },
    { title: 'التطوير', body: 'تنفيذ دقيق وكامل. كود نظيف وسريع ومُحسَّن للأداء وSEO وجميع الأجهزة والمتصفحات.' },
    { title: 'الإطلاق', body: 'نختبر بشكل شامل ثم ننشر الموقع. دعم ما بعد الإطلاق مشمول — موقعك مُراقَب وجاهز من اليوم الأول.' }
  ];
  function getStepData() {
    if (typeof currentLang !== 'undefined') {
      if (currentLang === 'fr') return stepDataFr;
      if (currentLang === 'ar') return stepDataAr;
    }
    return stepDataEn;
  }
  const stepData = getStepData();

  const stepImages = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&auto=format&fit=crop'
  ];

  const STEP_DURATION = 8000; // 8 seconds per step
  const TICK = 50;            // progress bar update interval (ms)
  let activeStep = 0;
  let progressTimer = null;
  let elapsed = 0;
  let isPaused = false;

  function renderSteps(idx) {
    const container = document.getElementById('processSteps');
    container.innerHTML = getStepData().map((s, i) => {
      if (i === idx) {
        return `<div class="process-step active" data-step-index="${i}">
          <div class="step-title-row">
            <div class="step-num-circle">0${i+1}</div>
            <div class="step-title">${s.title}</div>
          </div>
          <img class="step-card-img" src="${stepImages[i]}" alt="${s.title}" width="800" height="600" loading="lazy">
          <p class="step-body">${s.body}</p>
          <div class="step-progress-bar">
            <div class="step-progress-fill" id="stepProgressFill"></div>
          </div>
        </div>`;
      }
      return `<div class="process-step" data-step-index="${i}">
        <div class="step-num-circle">0${i+1}</div>
        <div class="step-title">${s.title}</div>
      </div>`;
    }).join('');
  }

  function switchImage(idx) {
    document.querySelectorAll('.process-img-slide').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
  }

  function setStep(idx, resetProgress = true) {
    activeStep = idx;
    renderSteps(idx);
    switchImage(idx);
    if (resetProgress) {
      elapsed = 0;
      if (progressTimer) clearInterval(progressTimer);
      if (!isPaused) startProgress();
    }
  }

  function startProgress() {
    progressTimer = setInterval(() => {
      if (isPaused) return;
      elapsed += TICK;
      const pct = Math.min((elapsed / STEP_DURATION) * 100, 100);
      const fill = document.getElementById('stepProgressFill');
      if (fill) fill.style.width = pct + '%';
      if (elapsed >= STEP_DURATION) {
        elapsed = 0;
        activeStep = (activeStep + 1) % getStepData().length;
        setStep(activeStep, false);
      }
    }, TICK);
  }

  function pauseAuto() {
    isPaused = true;
  }
  function resumeAuto() {
    isPaused = false;
  }

  // Pause when section is off-screen, resume when visible
  const processSection = document.getElementById('process');
  if (processSection) {
    const procObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { isPaused = false; }
        else { isPaused = true; }
      });
    }, { threshold: 0.2 });
    procObs.observe(processSection);
  }

  // Init
  setStep(0);

  // ── TESTIMONIALS: animated swipe ───────────────────────────────────────
  const testiData = [
    {
      cards: [
        { text: "They built our booking site from scratch in just 6 days. Clean, fast on mobile, and our reservation rate doubled in the first month.", text_en: "They built our booking site from scratch in just 6 days. Clean, fast on mobile, and our reservation rate doubled in the first month.", text_fr: "Ils ont créé notre site de réservation en seulement 6 jours. Épuré, rapide sur mobile, et notre taux de réservation a doublé dès le premier mois.", text_ar: "قاموا ببناء موقع الحجز الخاص بنا من الصفر في 6 أيام فقط. تصميم نظيف وسريع على الهاتف، وتضاعف معدل الحجز لدينا في الشهر الأول.", name: "Youssef Benali", name_en: "Youssef Benali", name_fr: "Youssef Benali", name_ar: "يوسف بنعلي", role: "Founder", role_en: "Founder", role_fr: "Fondateur", role_ar: "مؤسس", img: "data:image/jpeg;base64,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" },
        { text: "Our platform needed a complete redesign matching our brand. The team nailed it — modern, sharp, and our leads from the website tripled.", text_en: "Our platform needed a complete redesign matching our brand. The team nailed it — modern, sharp, and our leads from the website tripled.", text_fr: "Notre plateforme avait besoin d'une refonte complète fidèle à notre marque. L'équipe a tout réussi — moderne, percutant, et nos leads ont triplé.", text_ar: "كانت منصتنا بحاجة إلى إعادة تصميم كاملة تتوافق مع علامتنا التجارية. الفريق أبدع — تصميم عصري وحاد، وتضاعفت العملاء المحتملون ثلاث مرات.", name: "Nadia Alaoui", name_en: "Nadia Alaoui", name_fr: "Nadia Alaoui", name_ar: "نادية العلوي", role: "Head of Growth", role_en: "Head of Growth", role_fr: "Responsable Croissance", role_ar: "مسؤولة النمو", img: "data:image/jpeg;base64,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" },
        { text: "We needed a site that sold the experience before the visitor even booked. Beautiful, fast, and converting from day one.", text_en: "We needed a site that sold the experience before the visitor even booked. Beautiful, fast, and converting from day one.", text_fr: "Nous avions besoin d'un site qui vendait l'expérience avant même que le visiteur ne réserve. Magnifique, rapide et convertissant dès le premier jour.", text_ar: "كنا بحاجة إلى موقع يبيع التجربة قبل أن يحجز الزائر. جميل وسريع ويحقق تحويلات من اليوم الأول.", name: "Karim El Mansouri", name_en: "Karim El Mansouri", name_fr: "Karim El Mansouri", name_ar: "كريم المنصوري", role: "CEO", role_en: "CEO", role_fr: "PDG", role_ar: "الرئيس التنفيذي", img: "data:image/jpeg;base64,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" }
      ]
    }
  ];

  // Avatar images for testimonials
  const testiAvatars = {
    YB: "data:image/jpeg;base64,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",
    NA: "data:image/jpeg;base64,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",
    KE: "data:image/jpeg;base64,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",
    HB: "data:image/jpeg;base64,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",
    SM: "data:image/jpeg;base64,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",
    FZ: "data:image/jpeg;base64,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"
  };
  window.renderTestiCards = function() {
    const allCards = testiData.flatMap(p => p.cards);
    return allCards.map(c => {
      const avatar = c.img
        ? `<img src="${c.img}" alt="${c.name_en || c.name}" width="96" height="96" loading="lazy" class="testi-avatar-img">`
        : (c.name_en || c.name).split(' ').map(w=>w[0]).join('').slice(0,2);
      const textEn = c.text_en || c.text;
      const textFr = c.text_fr || textEn;
      const textAr = c.text_ar || textEn;
      const nameEn = c.name_en || c.name;
      const nameFr = c.name_fr || nameEn;
      const nameAr = c.name_ar || nameEn;
      const roleEn = c.role_en || c.role;
      const roleFr = c.role_fr || roleEn;
      const roleAr = c.role_ar || roleEn;
      return `<div class="testimonial-card glow-card">
        <svg class="quote-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="#525252"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="#525252"/></svg>
        <p class="testimonial-text" data-en="${textEn.replace(/"/g,'&quot;')}" data-fr="${textFr.replace(/"/g,'&quot;')}" data-ar="${textAr.replace(/"/g,'&quot;')}">${textEn}</p>
        <div class="testimonial-author">
          <div class="author-avatar">${avatar}</div>
          <div>
            <div class="author-name" data-en="${nameEn}" data-fr="${nameFr}" data-ar="${nameAr}">${nameEn}</div>
            <div class="author-role" data-en="${roleEn}" data-fr="${roleFr}" data-ar="${roleAr}">${roleEn}</div>
          </div>
        </div>
      </div>`;
    }).join('');
  };

  // Init: render all testimonials as static grid
  (function initTesti() {
    const grid = document.getElementById('testiGrid');
    if (grid) {
      grid.innerHTML = renderTestiCards();
      // Apply current language
      const lang = localStorage.getItem('ls_lang') || 'en';
      if (lang !== 'en') {
        grid.querySelectorAll('[data-en]').forEach(el => {
          const val = el.getAttribute('data-' + lang);
          if (val) el.innerHTML = val.includes('<') ? val : val;
        });
      }
      // wire up cursor-glow on the freshly rendered testimonial cards
      if (window.initGlowCards) window.initGlowCards();
    }
  })();

  // Fallback: ensure all reveal elements become visible within 2.5s regardless
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 2500);

  // ── FAQ ACCORDION ─────────────────────────────────────────────────────────
  function toggleFaq(questionEl) {
    const item = questionEl.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
    });
    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  }

  // ── Event wiring (replaces former inline on* handlers; CSP-safe) ──────────
  // FAQ: each question toggles its accordion item.
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => toggleFaq(q));
  });

  // PROCESS steps: delegate clicks on the (re-rendered) steps container, and
  // pause/resume the auto-advance while the pointer is over the list.
  const stepsContainer = document.getElementById('processSteps');
  if (stepsContainer) {
    stepsContainer.addEventListener('click', e => {
      const step = e.target.closest('.process-step');
      if (step && step.dataset.stepIndex != null) setStep(Number(step.dataset.stepIndex));
    });
    stepsContainer.addEventListener('mouseenter', pauseAuto);
    stepsContainer.addEventListener('mouseleave', resumeAuto);
  }
