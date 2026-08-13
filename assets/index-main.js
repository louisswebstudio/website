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
      body: 'We translate insights into beautiful, high-fidelity designs in Figma, every pixel, spacing, and interaction crafted before a line of code is written.'
    },
    {
      title: 'Development',
      body: 'Pixel-perfect implementation. Fast, clean, semantic code optimised for performance, SEO, and every device and browser.'
    },
    {
      title: 'Launch',
      body: 'We test thoroughly, then go live. Post-launch support included, your site is monitored and ready from day one.'
    }
  ];
  const stepDataFr = [
    {
      title: 'Découverte',
      body: 'Nous commençons par comprendre votre activité, vos objectifs et votre audience. Une découverte approfondie pour bâtir quelque chose de ciblé et efficace.'
    },
    {
      title: 'Idées & Design',
      body: 'Nous transformons vos insights en designs haute-fidélité sur Figma, chaque pixel, espacement et interaction pensés avant d\'écrire une seule ligne de code.'
    },
    {
      title: 'Développement',
      body: 'Intégration pixel-perfect. Code propre, rapide et sémantique, optimisé pour la performance, le SEO et tous les appareils.'
    },
    {
      title: 'Mise en ligne',
      body: 'Nous testons rigoureusement, puis nous mettons en ligne. Support post-lancement inclus, votre site est suivi et opérationnel dès le premier jour.'
    }
  ];
  const stepDataAr = [
    { title: 'الاستكشاف', body: 'نبدأ بفهم عملك وأهدافك وجمهورك المستهدف. الاستكشاف العميق يضمن أن كل ما نبنيه هادف ومُوجَّه نحو النتائج.' },
    { title: 'الأفكار والتصميم', body: 'نحوّل الأفكار إلى تصاميم عالية الدقة في Figma، كل بكسل ومسافة وتفاعل مُصمَّم بعناية قبل كتابة سطر واحد من الكود.' },
    { title: 'التطوير', body: 'تنفيذ دقيق وكامل. كود نظيف وسريع ومُحسَّن للأداء وSEO وجميع الأجهزة والمتصفحات.' },
    { title: 'الإطلاق', body: 'نختبر بشكل شامل ثم ننشر الموقع. دعم ما بعد الإطلاق مشمول، موقعك مُراقَب وجاهز من اليوم الأول.' }
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
        { text: "Notre ancien site avait été piraté, on avait besoin d'une solution fiable et rapide. Louiss Web Studio a reconstruit toute la plateforme de location, propre, rapide et sécurisée. On recommande.", text_en: "Our old site had been hacked, we needed a reliable and fast solution. Louiss Web Studio rebuilt our entire rental platform, clean, fast, and secure. We recommend them.", text_fr: "Notre ancien site avait été piraté, on avait besoin d'une solution fiable et rapide. Louiss Web Studio a reconstruit toute la plateforme de location, propre, rapide et sécurisée. On recommande.", text_ar: "تعرّض موقعنا القديم للاختراق، وكنا بحاجة إلى حل موثوق وسريع. أعادت Louiss Web Studio بناء منصة الكراء بالكامل، نظيفة وسريعة وآمنة. نوصي بها بشدة.", name: "Soufiane El Majdoub", name_en: "Soufiane El Majdoub", name_fr: "Soufiane El Majdoub", name_ar: "Soufiane El Majdoub", role: "CEO, El Majdoub Immobilier", role_en: "CEO, El Majdoub Immobilier", role_fr: "PDG, El Majdoub Immobilier", role_ar: "الرئيس التنفيذي، El Majdoub Immobilier", img: "assets/images/clients/el-majdoub-client.webp" },
        { text: "Nous avions besoin d'une plateforme immobilière fonctionnant en français, anglais et arabe, avec une équipe capable de gérer nos annonces sans dépendre d'un développeur. Louiss Web Studio a livré exactement ça, professionnel du début à la fin.", text_en: "We needed a real estate platform working in French, English and Arabic, with a team able to manage our listings without depending on a developer. Louiss Web Studio delivered exactly that, professional from start to finish.", text_fr: "Nous avions besoin d'une plateforme immobilière fonctionnant en français, anglais et arabe, avec une équipe capable de gérer nos annonces sans dépendre d'un développeur. Louiss Web Studio a livré exactement ça, professionnel du début à la fin.", text_ar: "كنا بحاجة إلى منصة عقارية تعمل بالفرنسية والإنجليزية والعربية، مع فريق قادر على إدارة إعلاناتنا دون الاعتماد على مطوّر. قدّمت Louiss Web Studio بالضبط ذلك، باحترافية من البداية إلى النهاية.", name: "Monsef Hajji", name_en: "Monsef Hajji", name_fr: "Monsef Hajji", name_ar: "Monsef Hajji", role: "CEO, Maison Monchef", role_en: "CEO, Maison Monchef", role_fr: "PDG, Maison Monchef", role_ar: "الرئيس التنفيذي، Maison Monchef", img: "assets/images/clients/maison-monchef-client.webp" },
        { text: "I am incredibly impressed by the quality of their work. Not only is the design visually stunning, but the performance, mobile responsiveness, and clean architecture are top-notch.", text_en: "I am incredibly impressed by the quality of their work. Not only is the design visually stunning, but the performance, mobile responsiveness, and clean architecture are top-notch.", text_fr: "Je suis vraiment impressionné par la qualité de leur travail. Le design est magnifique, mais les performances, la réactivité mobile et l'architecture du code sont également excellentes.", text_ar: "أنا معجب جدًا بجودة عملهم. التصميم ليس فقط مذهلاً بصريًا، بل الأداء والتوافق مع الهواتف المحمولة والبنية النظيفة للموقع ممتازة أيضًا.", name: "Othman Abaakil", name_en: "Othman Abaakil", name_fr: "Othman Abaakil", name_ar: "Othman Abaakil", role: "Software Engineer", role_en: "Software Engineer", role_fr: "Ingénieur Logiciel", role_ar: "مهندس برمجيات", img: "assets/images/clients/othman-abaakil-client.webp", rating: 5 },
        { text: "I really recommend this studio, they are very professional, their work is top notch!", text_en: "I really recommend this studio, they are very professional, their work is top notch!", text_fr: "Je recommande vraiment ce studio, ils sont très professionnels, leur travail est excellent !", text_ar: "أنصح بشدة بهذا الاستوديو، إنهم محترفون جدًا وعملهم ممتاز!", name: "Khalid Oussi", name_en: "Khalid Oussi", name_fr: "Khalid Oussi", name_ar: "Khalid Oussi", role: "CEO, Clothing Brand", role_en: "CEO, Clothing Brand", role_fr: "PDG, Marque de Vêtements", role_ar: "الرئيس التنفيذي، علامة ملابس", img: "assets/images/clients/khalid-oussi-client.webp", rating: 5 },
        { text: "J'ai fait appel à Louiss Web Studio pour la création de mon site web à Tanger et le résultat a dépassé mes attentes. Reda a livré un site moderne, rapide et optimisé pour le référencement local. Je recommande vivement pour toute entreprise au Maroc qui cherche un développeur web sérieux.", text_en: "I hired Louiss Web Studio to create my website in Tangier and the result exceeded my expectations. Reda delivered a modern, fast site optimized for local SEO. I highly recommend them for any business in Morocco looking for a serious web developer.", text_fr: "J'ai fait appel à Louiss Web Studio pour la création de mon site web à Tanger et le résultat a dépassé mes attentes. Reda a livré un site moderne, rapide et optimisé pour le référencement local. Je recommande vivement pour toute entreprise au Maroc qui cherche un développeur web sérieux.", text_ar: "استعنت بـ Louiss Web Studio لإنشاء موقعي الإلكتروني بطنجة، وكانت النتيجة أفضل من توقعاتي. قدّم رضا موقعًا عصريًا وسريعًا ومحسّنًا لمحركات البحث المحلية. أنصح به بشدة لأي شركة بالمغرب تبحث عن مطوّر ويب جاد.", name: "Arwa Banouni", name_en: "Arwa Banouni", name_fr: "Arwa Banouni", name_ar: "Arwa Banouni", role: "Photographer", role_en: "Photographer", role_fr: "Photographe", role_ar: "مصورة فوتوغرافية", img: "assets/images/clients/arwa-banouni-client.webp", rating: 5 },
        { text: "We really like the service, website was delivered with good quality.", text_en: "We really like the service, website was delivered with good quality.", text_fr: "Nous avons vraiment apprécié le service, le site a été livré avec une bonne qualité.", text_ar: "أعجبتنا الخدمة كثيرًا، تم تسليم الموقع بجودة جيدة.", name: "Oussama Boukrim", name_en: "Oussama Boukrim", name_fr: "Oussama Boukrim", name_ar: "Oussama Boukrim", role: "Entrepreneur", role_en: "Entrepreneur", role_fr: "Entrepreneur", role_ar: "رائد أعمال", img: "assets/images/clients/oussama-boukrim-client.webp", rating: 5 }
      ]
    }
  ];
  window.renderTestiCards = function() {
    const allCards = testiData.flatMap(p => p.cards);
    return allCards.map(c => {
      const avatar = c.img
        ? `<img src="${c.img}" alt="${c.name_en || c.name}" width="96" height="96" loading="lazy" class="testi-avatar-img">`
        : (c.name_en || c.name).trim().charAt(0).toUpperCase();
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
      const lang = localStorage.getItem('ls_lang') || 'fr';
      if (lang !== 'en') {
        grid.querySelectorAll('[data-en]').forEach(el => {
          const val = el.getAttribute('data-' + lang);
          if (val) el.innerHTML = val.includes('<') ? val : val;
        });
      }
      // wire up cursor-glow on the freshly rendered testimonial cards
      if (window.initGlowCards) window.initGlowCards();

      // ── Carousel arrows: scroll the grid one card-page at a time ──
      const prevBtn = document.getElementById('testiPrev');
      const nextBtn = document.getElementById('testiNext');
      if (prevBtn && nextBtn) {
        const isRTL = () => document.documentElement.getAttribute('dir') === 'rtl';
        const step = () => {
          const card = grid.querySelector('.testimonial-card');
          const gap = parseFloat(getComputedStyle(grid).columnGap) || 24;
          return card ? card.getBoundingClientRect().width + gap : grid.clientWidth;
        };
        const updateArrows = () => {
          const maxScroll = grid.scrollWidth - grid.clientWidth - 1;
          const pos = Math.abs(grid.scrollLeft); // RTL scrollLeft is negative in most browsers
          const atStart = pos <= 1;
          const atEnd = pos >= maxScroll;
          prevBtn.disabled = atStart;
          nextBtn.disabled = atEnd || maxScroll <= 0;
        };
        nextBtn.addEventListener('click', () => grid.scrollBy({ left: (isRTL() ? -1 : 1) * step(), behavior: 'smooth' }));
        prevBtn.addEventListener('click', () => grid.scrollBy({ left: (isRTL() ? 1 : -1) * step(), behavior: 'smooth' }));
        grid.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        // Layout/fonts may not have settled yet on the first synchronous call,
        // which can leave scrollWidth under-measured and the arrows stuck
        // disabled. Re-check after layout settles and once everything (fonts,
        // images) has finished loading.
        updateArrows();
        requestAnimationFrame(updateArrows);
        window.addEventListener('load', updateArrows);
      }
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

  // ── Start the hero mockup strip after load ──
  // The strip is held paused by CSS (html:not(.strip-go) rule) so it doesn't
  // scroll the lazy card images into view during the LCP/Speed-Index window.
  // Kick it off once the page has loaded and the main thread is idle.
  (function startHeroStrip() {
    var go = function () { document.documentElement.classList.add('strip-go'); };
    var kick = function () {
      if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 2500 });
      else setTimeout(go, 1200);
    };
    if (document.readyState === 'complete') kick();
    else window.addEventListener('load', kick, { once: true });
  })();
