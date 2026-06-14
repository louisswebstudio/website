# Mobile Performance Audit — louisswebstudio.com

**Date:** 2026-06-13
**Scope:** Home page (`index.html`) — mobile strategy. Audit only; no code or assets changed.

## Data source

The PageSpeed Insights API was unreachable today — the keyless public quota is exhausted
(`HTTP 429`, `quota_limit_value: 0` for the shared anonymous project), so a fresh PSI run was
not possible. Instead a **local Lighthouse run against the live URL** was used:

```
lighthouse https://louisswebstudio.com/ --form-factor=mobile --only-categories=performance
```

> **Reading the numbers.** My local test machine is meaningfully slower than Google's
> reference device, so the *absolute* timings below are inflated vs. PSI (local Perf 57,
> FCP 6.6 s, LCP 10.8 s vs. PSI's 67 / FCP 3.3 s / LCP 6.3 s). The **diagnostics**
> — which resources block rendering, what the LCP element is, byte savings, request counts —
> are environment-independent and are what this audit is built on. Score estimates are
> expressed relative to the **PSI baseline of 67**, not the local 57.

### Confirmed metric breakdown (the "why")

The single most important finding: the LCP image is **not** the problem.

**LCP element** = `assets/images/card-1.webp` — the first item in the hero mockup strip
(`div.hero-bottom-mockups > .hero-bmock-track > .hero-bmock-item > img`). It is already
preloaded with `fetchpriority="high"` and the `lcp-discovery` audit **passes** (discoverable,
eager, priority-hinted). At ~18 KB it downloads almost instantly.

**LCP subpart breakdown:**

| Subpart | Duration | Verdict |
|---|---|---|
| Time to first byte | 211 ms | fine (server-response 60 ms) |
| Resource load delay | 15 ms | fine |
| Resource load duration | 266 ms | fine |
| **Element render delay** | **2,338 ms** | **the whole problem** |

~88% of LCP is **render delay** — the browser has the image bytes but can't paint until
render-blocking resources (fonts + CSS + the synchronous main script) resolve. So the levers
that matter are **render-blocking removal** and **freeing the network/main thread during
first paint** — exactly the FCP / LCP / Speed-Index axis the brief calls out. TBT (35 ms) and
CLS (0) are confirmed perfect and need no work.

---

## Prioritized findings

| # | Issue | Source location (file / asset) | Metric affected | Est. impact | Effort | Fix |
|---|---|---|---|---|---|---|
| 1 | **3 render-blocking font stylesheets across 2 third-party origins.** Two Google Fonts CSS + one Fontshare CSS each block first paint, and each then triggers a *second* hop for the woff2. LH `render-blocking-insight`: **est. 1,910 ms** (Inter/Playfair 942 ms, Fontshare 907 ms, Cairo 185 ms). | `index.html:40-42` (`fonts.googleapis.com` ×2, `api.fontshare.com`) | FCP, LCP (render delay), SI | **High** | Med | Self-host the woff2 files and declare `@font-face` (with `font-display:swap`) inside the already-loaded `assets/site.css`, then delete the 3 external `<link>`s. Removes 2 cross-origin round-trips from the critical path. (Note: the strict CSP on `/` forbids inline `<style>`/handlers, so the `media="print" onload` swap trick is *not* available here — self-hosting is the clean route.) |
| 2 | **Sanity CMS client pulls 207 of the page's 248 network requests (~169 KB)** from `esm.sh` (get-it, @sanity/client, rxjs, buffer, events, tslib, nanoid, …). It's `type="module"` so not render-blocking, but on a mobile connection this request flood saturates the connection pool and bandwidth *during* the load window, starving the LCP paint and inflating Speed Index. The fetch already falls back to the static HTML, so it is **not needed for first paint**. | `index.html:945` → `assets/index-cms.js` (imports `@sanity/client` from `esm.sh`) | SI, LCP (bandwidth contention) | **High** | Med | Defer CMS hydration until after load / `requestIdleCallback`, **or** self-host a single pre-bundled Sanity client (1 request, not 207), **or** drop the live CMS layer if the static markup is the source of truth. Biggest Speed-Index lever after fonts. |
| 3 | **Main script loads synchronously (no `defer`).** `render-blocking-insight` attributes **~502 ms** to it. | `index.html:928` `<script src="assets/index-main.js">` (also `:929` index-lang.js, `:943` starfield.js) | FCP, LCP (render delay) | Med | **Low** | Add `defer` to `index-main.js` / `index-lang.js` / `starfield.js`. They sit at end of `<body>` but still block the parser's finish-and-paint; `defer` lets paint happen first. Verify nothing depends on synchronous execution order. |
| 4 | **`logo.png` is a 152 KB PNG shipped at 3560×653 but displayed ~191×35**, and it's **eager** in the nav (above the fold), competing with the LCP image for bandwidth. `image-delivery` flags **152 KB wasted** (≈99% of the file). | `logo.png` referenced at `index.html:118` (nav, eager), `:172`, `:903` | LCP, SI, total bytes | Med-High | Low | Export a small WebP at ~2× display size (≈400×75, a few KB) and use it for the nav logo; keep `width`/`height`. ~150 KB saved on the critical path. |
| 5 | **Oversized bento project images.** Tall full-page Figma screenshots (intrinsic up to 896×4096 / 1440×4000) downscaled to ~310×183. `image-delivery-insight`: **est. 527 KB** total — figma-agadir 241 KB, figma-roofing 236 KB (157 KB waste), figma-digiseo 178 KB (113 KB waste). | `assets/images/figma-{agadir,roofing,digiseo,adventure}.webp` — `index.html:257,276,295,314` | SI, total bytes, data cost | Med | Med | Re-export at ~2× rendered size (≈620×366) and/or higher WebP compression. **Lower priority for the score**: these are `loading="lazy"` and below the fold, so they don't touch LCP — the win is Speed Index, mobile data, and overall weight. |

### Negligible / not worth touching

These were checked against the audit JSON and are **not** meaningful score levers — listed so they're not chased by mistake:

- **Unused CSS** (`unused-css-rules`) and **unused JS** (`unused-javascript`): both **pass (score 1)**, no reportable savings. The 118 KB `assets/site.css` (~22 KB gzip) is render-blocking but is the page's only stylesheet and is essentially fully used — splitting/critical-CSS is blocked by the strict CSP anyway and not worth it.
- **Cache TTL** (`cache-insight`): est. **16 KB**, and *all of it is third-party* (`esm.sh`, `cdn.fontshare.com`) whose headers you don't control. The site's own assets are **not** flagged — Netlify is already serving them with acceptable cache headers. No `_headers` file is needed for caching; the existing `netlify.toml` only sets security headers. Skip.
- **Duplicated JavaScript**: no meaningful savings.
- **Non-composited animation** (`non-composited-animations`, score 1): the WhatsApp float button's `waPulse` `box-shadow` animation is non-composited, but with TBT 35 ms / CLS 0 it's irrelevant to this page's score. Skip.
- **`largest-contentful-paint-element` / `lcp-discovery`**: already optimal (preload + `fetchpriority=high`). No change needed — fixing the render-blockers (rows 1–3) is what unblocks it.

---

## Realistic outcome

The page's bottleneck is a narrow, fixable one: paint is gated by blocking fonts/CSS/JS while
the network is simultaneously flooded by a 207-request CMS layer that isn't needed for first
paint. None of it is interactivity or layout shift (already perfect).

- **Rows 1 + 3 (fonts self-hosted + scripts deferred)** directly cut the ~1.9 s render-blocking
  window and most of the 2.3 s LCP render delay → the largest FCP/LCP move.
- **Row 2 (defer/bundle the Sanity layer)** removes ~200 requests from the load window → the
  largest Speed-Index move.
- **Rows 4–5 (logo WebP + image re-export)** trim ~680 KB, helping SI and mobile data.

**Estimated reachable mobile score: ~85–92** (from PSI's current 67), with rows 1–4 delivering
the bulk of the gain and row 5 being incremental. Accessibility (95), Best Practices (96), and
SEO (100) are unaffected by all of the above.
