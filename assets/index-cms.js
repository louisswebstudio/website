  // ── Minimal Sanity read client ──
  // Previously this imported the full '@sanity/client' SDK from esm.sh, which
  // pulled in ~200 transitive module requests (rxjs, get-it, node polyfills…)
  // just to run two read-only GROQ queries — the single biggest source of
  // network requests on the page. Both queries are plain GETs against Sanity's
  // public query API (apicdn.sanity.io, the same CDN-backed endpoint useCdn:true
  // used), so we hit it directly with fetch() and ship zero third-party JS.
  const SANITY = {
    projectId: 'jlkob3wz',
    dataset: 'production',
    apiVersion: '2024-05-01',
  }

  const client = {
    async fetch(query) {
      const url = `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}`
        + `/data/query/${SANITY.dataset}?query=${encodeURIComponent(query)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
      const { result } = await res.json()
      return result
    },
  }

  // ── FETCH PROJECTS → inject into bento grid ──
  // Wrapped in try/catch so a CMS/network failure leaves the static fallback
  // markup in place instead of throwing an uncaught error to the console.
  try {
  const projects = await client.fetch(
    `*[_type == "project"] | order(order asc)[0...4] {
      title, slug, clientName, tags, liveUrl, featured,
      "coverUrl": coverImage.asset->url
    }`
  )

  const bentoPositions = ['bento-card-1','bento-card-2','bento-card-3','bento-card-4']
  const bentoGrid = document.querySelector('.bento-grid')

  if (bentoGrid && projects.length > 0) {
    bentoGrid.innerHTML = projects.map((p, i) => {
      const pos = bentoPositions[i] || 'bento-card-1'
      const tag = p.tags?.[0] || 'Web Design'
      const href = p.liveUrl ? `href="${p.liveUrl}"` : ''
      const tag2 = `${pos} ${i % 2 === 0 ? '' : 'dark2'}`
      return `
        <a ${href} class="bento-card ${tag2} glow-card" target="_blank" rel="noopener">
          <div class="bento-thumb">
            ${p.coverUrl ? `<img class="bento-hover-img is-static" src="${p.coverUrl}" alt="${p.title}" width="500" height="548" loading="lazy">` : ''}
          </div>
          <div class="bento-info">
            <div>
              <div class="bento-cat">${tag}</div>
              <div class="bento-title">${p.title}</div>
              ${p.clientName ? `<div class="bento-result">${p.clientName}</div>` : ''}
            </div>
            <div class="bento-btn-expand">
              <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <span>See it live</span>
            </div>
          </div>
        </a>`
    }).join('')
    if (window.initGlowCards) window.initGlowCards();
  }
  } catch (err) {
    console.warn('Projects could not be loaded from the CMS; keeping static content.', err)
  }

  // ── FETCH TESTIMONIALS → inject into static grid ──
  try {
  const testimonials = await client.fetch(
    `*[_type == "testimonial"] | order(_createdAt asc) {
      clientName, clientRole, quote, rating,
      "projectTitle": projectRef->title
    }`
  )

  if (testimonials.length > 0) {
    const pages = [{ cards: testimonials.map(t => ({
      text: t.quote,
      name: t.clientName,
      role: t.clientRole || 'Client',
      img: null
    }))}]

    window.testiData = pages

    const grid = document.getElementById('testiGrid')
    if (grid && window.renderTestiCards) {
      grid.innerHTML = window.renderTestiCards()
      const lang = localStorage.getItem('ls_lang') || 'fr'
      if (lang !== 'en') applyTranslations(lang)
      if (window.initGlowCards) window.initGlowCards();
    }
  }
  } catch (err) {
    console.warn('Testimonials could not be loaded from the CMS; keeping static content.', err)
  }
