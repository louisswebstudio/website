/* global React, ReactDOM */
const { useState, useEffect } = React;

/* ============================================================
   Tweakable defaults
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "moroccan-blue",
  "heroLayout": "split",
  "showFloatingTags": true,
  "showMetrics": true,
  "approachStyle": "cards",
  "density": "comfortable"
}/*EDITMODE-END*/;

const ACCENTS = {
  "moroccan-blue":   { c: "#2563eb", c2: "#3b82f6", glow: "rgba(37,99,235,0.45)", soft: "#93c5fd" },
  "electric-cyan":   { c: "#06b6d4", c2: "#22d3ee", glow: "rgba(6,182,212,0.45)",  soft: "#67e8f9" },
  "lime":            { c: "#84cc16", c2: "#a3e635", glow: "rgba(132,204,22,0.45)", soft: "#bef264" },
  "violet":          { c: "#7c3aed", c2: "#a78bfa", glow: "rgba(124,58,237,0.45)", soft: "#c4b5fd" },
  "amber":           { c: "#f59e0b", c2: "#fbbf24", glow: "rgba(245,158,11,0.45)", soft: "#fcd34d" },
};

/* ============================================================
   Icons
   ============================================================ */
const Icon = {
  arrow: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  x: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  spark: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M3 11l2-2M9 5l2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  bolt: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="currentColor">
      <path d="M8 1L2 8h4l-1 5 6-7H7l1-5z"/>
    </svg>
  ),
};

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner shell">
        <a href="../index.html#work" className="btn btn-ghost" style={{ fontSize: 13, height: 36, padding: "0 14px" }}>← Portfolio</a>
        <a href="#" className="logo">
          <div className="logo-mark"></div>
          <span>WEBSTUDIO</span>
        </a>
        <nav className="nav-links">
          <a href="#problem">Case Studies</a>
          <a href="#approach">Process</a>
          <a href="#result">Results</a>
          <a href="#testimonial">Clients</a>
        </nav>
        <div className="nav-actions">
          <div className="lang">
            <span className="lang-flag"></span>
            <span>EN</span>
          </div>
          <a href="#cta" className="btn btn-primary">Start a Project {Icon.arrow(14)}</a>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   HERO STAGE — laptop + phone CSS mockup
   ============================================================ */
function DeviceStage({ showTags }) {
  return (
    <div className="hero-stage">
      <div className="stage-floor"></div>

      <div className="laptop">
        <div className="laptop-screen">
          <div className="laptop-display">
            <LaptopMockSite />
          </div>
        </div>
        <div className="laptop-base"></div>
      </div>

      <div className="phone">
        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-display">
            <PhoneMockSite />
          </div>
        </div>
      </div>

      {showTags && (
        <>
          <div className="float-tag t1"><span className="pill"></span> 98 Lighthouse</div>
          <div className="float-tag t2"><span className="pill" style={{ background: "#22d3ee", boxShadow: "0 0 0 3px rgba(34,211,238,0.20)" }}></span> +312% leads</div>
          <div className="float-tag t3"><span className="pill" style={{ background: "#fbbf24", boxShadow: "0 0 0 3px rgba(251,191,36,0.20)" }}></span> 0.8s LCP</div>
        </>
      )}
    </div>
  );
}

function LaptopMockSite() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#fafafa", color: "#0a0a0a", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
      <div style={{ height: 32, borderBottom: "1px solid #e4e4e7", display: "flex", alignItems: "center", padding: "0 16px", gap: 18, background: "#fff" }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "-0.01em" }}>ATLAS &amp; CO.</div>
        <div style={{ display: "flex", gap: 14, flex: 1 }}>
          <span style={{ fontSize: 8, color: "#71717a", fontWeight: 600 }}>Work</span>
          <span style={{ fontSize: 8, color: "#71717a", fontWeight: 600 }}>Studio</span>
          <span style={{ fontSize: 8, color: "#71717a", fontWeight: 600 }}>Journal</span>
          <span style={{ fontSize: 8, color: "#71717a", fontWeight: 600 }}>Contact</span>
        </div>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: "var(--accent)", padding: "3px 8px", borderRadius: 999 }}>Book Call</div>
      </div>
      <div style={{ padding: "20px 24px 0", flex: 1, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontSize: 9, color: "#52525b", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>A heritage hotel, reborn</div>
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.025em", marginBottom: 8 }}>
            Stay at the<br/><em style={{ fontFamily: "'Satoshi', 'Inter', sans-serif", fontStyle: "italic", color: "var(--accent)", fontWeight: 500 }}>edge of the Atlas.</em>
          </div>
          <div style={{ fontSize: 8, color: "#52525b", lineHeight: 1.45, marginBottom: 12 }}>
            Twelve suites carved into a hillside,<br/>thirty minutes from Marrakech.
          </div>
          <div style={{ display: "inline-flex", gap: 6 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: "#0a0a0a", padding: "5px 12px", borderRadius: 999 }}>Reserve a stay</div>
            <div style={{ fontSize: 8, fontWeight: 600, color: "#0a0a0a", padding: "5px 12px", borderRadius: 999, border: "1px solid #d4d4d8" }}>Take a tour</div>
          </div>
        </div>
        <div style={{ borderRadius: 6, height: 130, background: "linear-gradient(135deg, #f5d8a8 0%, #c97f4a 60%, #6b3a1a 100%)", boxShadow: "inset 0 -20px 30px rgba(0,0,0,0.2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: 8, left: 8, fontSize: 8, color: "#fff", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Suite 03</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, padding: "16px 24px 18px" }}>
        {[
          { k: "Suites", v: "12" },
          { k: "Avg rate", v: "€480" },
          { k: "Rating", v: "4.9" },
          { k: "Booked", v: "92%" },
        ].map((s, i) => (
          <div key={i} style={{ borderTop: "1px solid #e4e4e7", paddingTop: 6 }}>
            <div style={{ fontSize: 7, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{s.k}</div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneMockSite() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#fafafa", display: "flex", flexDirection: "column", paddingTop: 30, fontFamily: "Inter" }}>
      <div style={{ padding: "0 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 8, fontWeight: 800 }}>ATLAS</div>
        <div style={{ width: 14, height: 14, borderRadius: 4, background: "#0a0a0a" }}></div>
      </div>
      <div style={{ padding: "16px 14px 12px" }}>
        <div style={{ fontSize: 6, color: "#52525b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Heritage stay</div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.0, margin: "4px 0 6px" }}>
          Stay at the <em style={{ fontFamily: "'Satoshi', 'Inter', sans-serif", color: "var(--accent)", fontWeight: 500 }}>edge.</em>
        </div>
      </div>
      <div style={{ margin: "0 14px", height: 130, borderRadius: 8, background: "linear-gradient(160deg, #f5d8a8 0%, #c97f4a 60%, #6b3a1a 100%)", position: "relative" }}>
        <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <div style={{ fontSize: 7, color: "#fff", fontWeight: 600 }}>Suite 03</div>
          <div style={{ fontSize: 7, color: "#fff", fontWeight: 700 }}>€480 / nt</div>
        </div>
      </div>
      <div style={{ padding: "12px 14px 0", display: "flex", flexDirection: "column", gap: 6 }}>
        {["Sahara Sky", "Cedar Ridge", "Atlas Edge"].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", background: "#fff", border: "1px solid #e4e4e7", borderRadius: 6 }}>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 6, color: "#71717a" }}>2 guests · suite</div>
            </div>
            <div style={{ fontSize: 7, fontWeight: 700, color: "var(--accent)" }}>Book →</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", padding: "10px 14px", background: "#0a0a0a", color: "#fff", margin: "10px 14px 14px", borderRadius: 999, fontSize: 8, fontWeight: 700, textAlign: "center" }}>
        Reserve a stay
      </div>
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ heroLayout, showFloatingTags }) {
  return (
    <section className="hero" data-layout={heroLayout}>
      <div className="hero-bg">
        <div className="grid"></div>
        <div className="glow-1"></div>
        <div className="glow-2"></div>
      </div>
      <div className="shell hero-grid">
        <div>
          <span className="eyebrow">
            <span className="dot"></span>
            Case Study · Hospitality
          </span>
          <h1>
            How a heritage hotel <span className="accent-blue">tripled</span> direct bookings <span className="accent">in 90 days.</span>
          </h1>
          <p className="hero-sub">
            Atlas &amp; Co., a twelve-suite riad outside Marrakech, was losing 80% of inbound traffic to a clunky third-party booking widget. We rebuilt the brand experience end-to-end, and the numbers followed.
          </p>
          <div className="hero-meta">
            <div className="item"><span className="label">Client</span><span className="val">Atlas &amp; Co.</span></div>
            <div className="item"><span className="label">Industry</span><span className="val">Hospitality</span></div>
            <div className="item"><span className="label">Timeline</span><span className="val">90 days</span></div>
            <div className="item"><span className="label">Scope</span><span className="val">Brand · Web · CMS</span></div>
            <div className="item"><span className="label">Year</span><span className="val">2025</span></div>
          </div>
          <div className="hero-cta">
            <a href="#cta" className="btn btn-primary btn-lg">Start your project <span className="arrow">{Icon.arrow(15)}</span></a>
            <a href="#approach" className="btn btn-ghost btn-lg">Read the breakdown</a>
          </div>
        </div>
        <DeviceStage showTags={showFloatingTags} />
      </div>
    </section>
  );
}

/* ============================================================
   METRICS
   ============================================================ */
function Metrics() {
  const metrics = [
    { v: "312", u: "%", l: "Increase in direct bookings" },
    { v: "0.8", u: "s", l: "Largest contentful paint" },
    { v: "98", u: "/100", l: "Lighthouse performance" },
    { v: "4.2", u: "×", l: "Return on investment" },
  ];
  return (
    <section className="metrics">
      <div className="shell">
        <div className="metrics-grid">
          {metrics.map((m, i) => (
            <div key={i} className="metric">
              <div className="num">{m.v}<span className="unit">{m.u}</span></div>
              <div className="lbl">{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROBLEM
   ============================================================ */
function Problem() {
  const items = [
    { t: "A booking widget that fought users", d: "Embedded iframe, mismatched typography, four steps before a date picker. 78% of users dropped off before reaching availability." },
    { t: "Brand that didn't match the room", d: "The riad felt timeless and editorial. The site felt like a 2014 OTA template, saturated reds, exclamation marks, banner ads above the fold." },
    { t: "Mobile was an afterthought", d: "Hero image cropped to a sliver. CTA below the fold on every device under 768px. 71% of traffic was mobile." },
    { t: "No story, only inventory", d: "Twelve identical suite cards in a grid. No editorial. No reason to scroll past the first screen." },
  ];
  return (
    <section className="section problem" id="problem">
      <div className="shell">
        <div className="section-tag">Chapter 01</div>
        <div className="section-head">
          <div className="section-num">01</div>
          <h2>The site was beautiful in person, and <em>broken</em> on every screen.</h2>
        </div>
        <div className="problem-grid">
          <div className="problem-list">
            {items.map((it, i) => (
              <div key={i} className="problem-item">
                <span className="icon">{Icon.x(14)}</span>
                <div>
                  <h4>{it.t}</h4>
                  <p>{it.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="before-card">
            <div className="header">
              <div className="label"><span className="ring"></span> Before</div>
              <div className="url">atlasandco.ma · March 2025</div>
            </div>
            <div className="before-mock">
              <div className="top"></div>
              <div className="strip"></div>
              <div className="body">
                <div className="blk lng">[ slow hero carousel ]</div>
                <div className="blk alt">★ DEAL</div>
                <div className="blk">img</div>
                <div className="blk alt">⏰ 2HR</div>
                <div className="blk">img</div>
                <div className="blk">img</div>
                <div className="blk alt">CALL</div>
              </div>
              <div className="footer">
                <span className="lk">Booking iframe v3</span>
                <span className="lk">Tripadvisor badge</span>
                <span className="lk">Newsletter popup</span>
                <span className="lk">Cookie banner</span>
                <span className="lk">Live chat bubble</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   APPROACH
   ============================================================ */
function Approach() {
  const steps = [
    {
      n: "i.",
      t: "Re-anchor the brand",
      d: "Six in-person interviews with the founder and head of housekeeping. We rewrote the voice, quieter, more confident, more specific. Then redrew the wordmark and a custom serif italic to carry it.",
      tags: ["Brand voice", "Wordmark", "Custom italic"],
    },
    {
      n: "ii.",
      t: "Rebuild the booking flow",
      d: "Killed the iframe. Designed a native availability calendar with rate-aware date selection, suite previews on hover, and a one-screen confirm. Direct API integration with the PMS.",
      tags: ["Custom UI", "PMS API", "Wireframes"],
    },
    {
      n: "iii.",
      t: "Editorial home page",
      d: "Treated the home as a magazine cover, not a catalog. Long-form sections per suite, room-by-room photography, in-room Spotify playlists. Twelve scroll-stops, not twelve cards.",
      tags: ["Editorial", "Photography", "Motion"],
    },
  ];
  return (
    <section className="section approach" id="approach">
      <div className="shell">
        <div className="section-tag">Chapter 02</div>
        <div className="section-head">
          <div className="section-num">02</div>
          <h2>Three moves, in <em>order</em>.</h2>
        </div>
        <div className="approach-grid">
          {steps.map((s, i) => (
            <div key={i} className="approach-card">
              <div className="step">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <div className="tags">
                {s.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   RESULT
   ============================================================ */
function Result() {
  const items = [
    { meta: "Direct bookings", t: "+312% within 90 days", v: "312", u: "%" },
    { meta: "Average session", t: "From 0:42 to 3:18", v: "4.7", u: "×" },
    { meta: "Mobile conversion", t: "From 0.6% to 4.1%", v: "6.8", u: "×" },
    { meta: "Revenue per visitor", t: "From €1.20 to €5.04", v: "320", u: "%" },
  ];
  return (
    <section className="section result" id="result">
      <div className="shell">
        <div className="section-tag">Chapter 03</div>
        <div className="section-head">
          <div className="section-num">03</div>
          <h2>The result, in <em>numbers</em> the founder cares about.</h2>
        </div>
        <div className="result-grid">
          <div className="after-card">
            <div className="header">
              <div className="label"><span className="ring"></span> After</div>
              <div className="url">atlasandco.ma · June 2025</div>
            </div>
            <div className="after-mock">
              <div className="nav">
                <div className="brand">ATLAS &amp; CO.</div>
                <div className="lks">
                  <span>Suites</span><span>Studio</span><span>Journal</span>
                </div>
                <div className="pill">Reserve</div>
              </div>
              <div className="hero">
                <div className="h">Stay at the <em>edge of the Atlas.</em></div>
                <div className="sub">Twelve suites carved into a hillside, thirty minutes from Marrakech.</div>
                <div className="cta">Reserve a stay →</div>
              </div>
              <div className="grid">
                <div className="card feat">Suite 03</div>
                <div className="card">Sahara Sky</div>
                <div className="card">Cedar Ridge</div>
              </div>
            </div>
          </div>
          <div className="result-list">
            {items.map((it, i) => (
              <div key={i} className="result-item">
                <div>
                  <div className="meta">{it.meta}</div>
                  <h4>{it.t}</h4>
                </div>
                <div className="delta"><span className="dir">↑</span>{it.v}{it.u}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIAL
   ============================================================ */
function Testimonial() {
  return (
    <section className="testimonial" id="testimonial">
      <div className="shell">
        <div className="testimonial-card">
          <div className="stars">★ ★ ★ ★ ★</div>
          <p className="quote">
            "We spent two years convinced our problem was marketing. It was the website. Six weeks after launch we were <em>turning rooms away in low season.</em>"
          </p>
          <div className="meta">
            <div className="avatar">YA</div>
            <div>
              <div className="name">Yasmine Alaoui</div>
              <div className="role">Founder &amp; Owner · Atlas &amp; Co.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA
   ============================================================ */
function FinalCTA() {
  return (
    <section className="cta-strip" id="cta">
      <div className="shell">
        <div className="cta-card">
          <h2>
            Have a project<br/>
            <em>worth getting right?</em>
          </h2>
          <p>We take on six clients per year. We'll spend the first hour on the phone making sure we're the right fit. No slides, no pitch deck.</p>
          <div className="actions">
            <a href="#" className="btn btn-primary btn-xl">Book a discovery call <span className="arrow">{Icon.arrow(16)}</span></a>
            <a href="#" className="btn btn-ghost btn-xl">View more case studies</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="shell footer-inner">
        <div>© 2026 WEBSTUDIO · Casablanca · Marrakech</div>
        <div className="links">
          <a href="#">Work</a>
          <a href="#">Studio</a>
          <a href="#">Journal</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   ROOT — Tweaks live here
   ============================================================ */
function App() {
  const { values, set } = useTweaks(TWEAK_DEFAULTS);

  // Inject accent vars from the chosen palette
  useEffect(() => {
    const a = ACCENTS[values.accent] || ACCENTS["moroccan-blue"];
    const r = document.documentElement;
    r.style.setProperty("--accent", a.c);
    r.style.setProperty("--accent-2", a.c2);
    r.style.setProperty("--accent-glow", a.glow);
  }, [values.accent]);

  return (
    <>
      <Nav />
      <main>
        <Hero heroLayout={values.heroLayout} showFloatingTags={values.showFloatingTags} />
        {values.showMetrics && <Metrics />}
        <Problem />
        <Approach />
        <Result />
        <Testimonial />
        <FinalCTA />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Accent palette">
          <TweakRadio
            value={values.accent}
            onChange={(v) => set("accent", v)}
            options={[
              { label: "Moroccan blue", value: "moroccan-blue" },
              { label: "Electric cyan", value: "electric-cyan" },
              { label: "Lime",          value: "lime" },
              { label: "Violet",        value: "violet" },
              { label: "Amber",         value: "amber" },
            ]}
          />
        </TweakSection>

        <TweakSection title="Hero layout">
          <TweakRadio
            value={values.heroLayout}
            onChange={(v) => set("heroLayout", v)}
            options={[
              { label: "Split (default)", value: "split" },
              { label: "Centered",        value: "centered" },
            ]}
          />
        </TweakSection>

        <TweakSection title="Floating performance tags">
          <TweakToggle
            label="Show in hero"
            value={values.showFloatingTags}
            onChange={(v) => set("showFloatingTags", v)}
          />
        </TweakSection>

        <TweakSection title="Metrics strip">
          <TweakToggle
            label="Show below hero"
            value={values.showMetrics}
            onChange={(v) => set("showMetrics", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
