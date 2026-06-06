# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LS Web Studio — a freelance web studio portfolio site. Pure HTML/CSS/JS with no build system, bundler, or package manager. Open files directly in a browser or use a local dev server like Live Server (VS Code extension).

## Running the Project

```
# Serve locally (any static server works)
npx serve .
# or
python -m http.server 8080
```

There are no build steps, no `npm install`, no compilation. Edit files and refresh the browser.

## Architecture

### Site Structure

- **`index.html`** — main portfolio page (standalone, all CSS inline in `<style>` tags)
- **`adventure-keys.html`**, **`agadir-transfer.html`**, **`digiseo.html`**, **`supreme-toiture.html`** — individual project pages
- **`casestudy/Case Study.html`** — case study template page that loads the React app below
- **`casestudy/app.jsx`** — React component tree for the interactive case study (loaded via Babel CDN, not bundled)
- **`casestudy/styles.css`** — styles for the case study page
- **`casestudy/tweaks-panel.jsx`** — reusable design-tweaking UI panel (see below)

### CSS Approach

All pages use inline `<style>` blocks (no external CSS framework). Design tokens are defined as CSS custom properties in `:root`:
- `--blue`, `--dark`, `--card`, `--border`, `--muted` — color palette
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

- CSS is written directly in `<style>` blocks inside each HTML file — there is no shared stylesheet for the main pages (only `casestudy/styles.css` is external).
- Fonts: Inter (body), Playfair Display italic (accent/editorial headings), Satoshi (logo/display), Cairo (Arabic language support).
- The accent color in the case study is driven by `--accent` / `--accent-2` / `--accent-glow` CSS vars set by the `ACCENTS` map in `app.jsx`.
- Bilingual support (FR/AR) exists in `index.html` via JS-driven language switching — Arabic content uses the Cairo font and `dir="rtl"`.
