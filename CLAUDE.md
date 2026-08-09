# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Louiss Web Studio — a freelance web studio portfolio site, deployed on Vercel at
`https://www.louisswebstudio.com` (apex 301s to `www`). Static HTML/CSS/JS with no
bundler. There is one build step: the Sanity-backed blog generator.

## Running the Project

```
# Serve locally (any static server works)
npx serve .
```

Editing pages needs no build. Regenerating the blog does:

```
npm install
npm run build:blog
```

`scripts/build-blog.js` pulls posts from Sanity and writes `blog/index.html`,
`blog/<slug>/index.html`, and the block between the `BLOG:START` / `BLOG:END`
markers in `sitemap.xml`. Hand-edits inside those regions are overwritten — change
the generator instead. Vercel runs it via `buildCommand` on every deploy.

`vercel.json` sets `cleanUrls: true`, so `/contact.html` 308-redirects to
`/contact`. **Always link internally to the clean URL** (`href="/contact"`), never
the `.html` form — the redirect costs a hop for visitors and for crawl budget. It
also holds the CSP; new third-party origins must be allow-listed there.

## Architecture

### Site Structure

- **`index.html`** — homepage
- **`services.html`**, **`projects.html`**, **`tarifs.html`**, **`contact.html`** — main commercial pages
- **`creation-site-web-<city>.html`** — nine local SEO landing pages (Tanger, Casablanca, Rabat, Agadir, Marrakech, Fès, Essaouira, Kénitra, Oujda). They share a common shell; the per-city copy (economy, sectors, FAQ) is what differentiates them — keep it genuinely local rather than find-and-replacing the city name.
- **`adventure-keys.html`**, **`agadir-transfer.html`**, **`digiseo.html`**, **`el-majdoub.html`**, **`maison-monchef.html`**, **`supreme-toiture.html`** — case study pages
- **`404.html`** — served automatically by Vercel for unmatched routes; `noindex, follow`
- **`blog/`** — generated, see above. Do not hand-edit.
- **`casestudy/Case Study.html`** — case study template page that loads the React app below
- **`casestudy/app.jsx`** — React component tree for the interactive case study (loaded via Babel CDN, not bundled)
- **`casestudy/styles.css`** — styles for the case study page
- **`casestudy/tweaks-panel.jsx`** — reusable design-tweaking UI panel (see below)

### Language and SEO (read before touching titles or the language switcher)

The site ships three languages (FR/EN/AR) from a **single URL per page**, swapped
at runtime from `data-en` / `data-fr` / `data-ar` attributes.

**French is the indexed language.** Titles, meta descriptions and JSON-LD all
target Morocco in French, and Googlebot crawls as `en-US` — so the language init
in `assets/site-chrome.js`, `assets/index-lang.js` and the inline scripts on the
standalone pages deliberately has **no English branch**. A first-time visitor with
no `ls_lang` preference gets French; only `ar-*` browsers auto-switch. Re-adding an
English fallback would make Googlebot render every page in English underneath
French metadata, which is exactly the mismatch that flattened CTR to 0.5%.

**Never assign `document.title` from a hardcoded string.** The `<title>` tag is the
single source of truth; scripts read `title[data-en]` and localize from its
attributes. Same for descriptions — `meta[data-en]` elements get their `content`
updated. Google indexes the *rendered* DOM, so a hardcoded override silently
replaces whatever was tuned in the HTML.

Because each language shares one URL, `hreflang` does not apply — it needs
distinct URLs per language. Splitting into `/fr/` and `/en/` is the only way to
index more than one language, and would be a large change.

### CSS Approach

Most pages carry a large inline `<style>` block, but `index.html`, the city pages
and the legal/404 pages also load shared stylesheets from `assets/`
(`site.css`, `site-critical.css`, `section-headings.css`). The
standalone project and sub-pages (`contact`, `projects`, `tarifs`, the case
studies) are fully self-contained — a rule added to `assets/site.css` will **not**
reach them, so shared components have to be mirrored into each page's inline
block. Design tokens are CSS custom properties in `:root`:
- `--blue`, `--dark`, `--card`, `--border`, `--muted`, `--muted2` — color palette
- `--sp-xs` through `--sp-section` — spacing scale

### React Case Study Pattern

The case study page uses React + ReactDOM + Babel loaded from CDN (no bundler). JSX files are loaded as `type="text/babel"`. The `TWEAK_DEFAULTS` object between `/*EDITMODE-BEGIN*/` and `/*EDITMODE-END*/` markers is the source of truth for tweakable design values — this delimiter is used by an external edit-mode protocol.

**`tweaks-panel.jsx`** is a shared utility that:
- Provides the `useTweaks(defaults)` hook for managing tweak state
- Exports `<TweaksPanel>`, `<TweakSection>`, `<TweakSlider>`, `<TweakRadio>`, `<TweakToggle>`, `<TweakColor>` components
- Handles the `__activate_edit_mode` / `__deactivate_edit_mode` postMessage protocol for external control

### Assets

- `assets/images/` — card thumbnails and comparison screenshots used in `index.html`
- `assets/images/projects/<name>/` — per-project image sets (1.jpg/png, 2.png, 3.png)
- `logo.png` — studio logo

### Figma Source

`figma version/lsweb draft.fig` — the original Figma source file for the site design.

## Key Conventions

- Fonts: Inter (body), Playfair Display italic (accent/editorial headings), Satoshi (logo/display), Cairo (Arabic language support).
- The accent color in the case study is driven by `--accent` / `--accent-2` / `--accent-glow` CSS vars set by the `ACCENTS` map in `app.jsx`.
- Trilingual (FR/EN/AR) via JS-driven switching — Arabic uses the Cairo font and `dir="rtl"`. See the Language and SEO section above before changing any of it.
- Every new page needs: one `<h1>`, a `<link rel="canonical">`, `alt` on every image, a `sitemap.xml` entry, and internal links in from the footer — the existing pages all satisfy this, so a checker will flag regressions.
- Do not invent client results, statistics or testimonials for case studies; use only what the project actually did.
