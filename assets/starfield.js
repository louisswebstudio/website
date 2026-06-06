/* Galactic starfield background — shared across pages.
   Requires a <canvas id="global-starfield"> fixed behind the content. */
(function () {
  const canvas = document.getElementById('global-starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  let W = 0, H = 0, cx = 0, cy = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;
    cy = H / 2;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  /* ── Stars ── */
  const MOBILE = W < 640;
  /* Mobile bumped from 250 → 500 so the starfield reads clearly on phones,
     close to the desktop 600 while staying lighter for performance. */
  const COUNT  = MOBILE ? 500 : 600;

  function newStar(s) {
    s = s || {};
    s.x  = (Math.random() - 0.5) * 2000;
    s.y  = (Math.random() - 0.5) * 2000;
    s.z  = Math.random() * 1000;
    s.pz = s.z;
    return s;
  }
  const stars = Array.from({ length: COUNT }, () => newStar());

  /* ── Pointer / touch ── */
  let pointer = { x: cx, y: cy, active: false };
  let idleTimer = null;
  let isIdle = true;

  function onPointerMove(e) {
    // Use first touch point or mouse position
    const src = e.touches ? e.touches[0] : e;
    pointer.x = src.clientX;
    pointer.y = src.clientY;
    pointer.active = true;
    isIdle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { isIdle = true; }, 3000);
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('touchmove',   onPointerMove, { passive: true });

  /* ── Speed logic ── */
  function getSpeed() {
    if (isIdle || !pointer.active) return MOBILE ? 0.35 : 0.15;
    const dx = pointer.x - cx;
    const dy = pointer.y - cy;
    const dist    = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.sqrt(cx * cx + cy * cy) || 1;
    return 0.12 + (dist / maxDist) * 0.9;
  }

  /* ── Static frame for reduced-motion ── */
  function drawStatic() {
    ctx.fillStyle = '#060607';
    ctx.fillRect(0, 0, W, H);
    for (const s of stars) {
      const sx = (s.x / s.z) * 400 + cx;
      const sy = (s.y / s.z) * 400 + cy;
      const b  = 1 - s.z / 1000;
      ctx.fillStyle = `rgba(255,255,255,${b.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.4, b * 1.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── Main loop ── */
  function animate() {
    if (!W) { requestAnimationFrame(animate); return; }

    // Lighter clear on mobile → trails persist longer, so the field reads more clearly.
    ctx.fillStyle = MOBILE ? 'rgba(6,6,7,0.16)' : 'rgba(6,6,7,0.22)';
    ctx.fillRect(0, 0, W, H);

    const speed = getSpeed();

    for (const s of stars) {
      s.pz = s.z;
      s.z -= speed;

      if (s.z <= 0) { newStar(s); s.pz = s.z; continue; }

      const sx = (s.x / s.z)  * 400 + cx;
      const sy = (s.y / s.z)  * 400 + cy;
      const px = (s.x / s.pz) * 400 + cx;
      const py = (s.y / s.pz) * 400 + cy;

      // Cull stars that have left the viewport
      if (sx < -80 || sx > W + 80 || sy < -80 || sy > H + 80) { newStar(s); continue; }

      const b = 1 - s.z / 1000;

      // Streak line — cap at 50 px
      let dx = sx - px, dy = sy - py;
      const len = Math.sqrt(dx * dx + dy * dy);
      let startX = px, startY = py;
      if (len > 25) {
        const t = (len - 25) / len;
        startX = px + dx * t;
        startY = py + dy * t;
      }

      // Mobile: brighter + thicker strokes (with a visible-width floor) for clarity.
      ctx.strokeStyle = `rgba(255,255,255,${(b * (MOBILE ? 1 : 0.85)).toFixed(3)})`;
      ctx.lineWidth   = MOBILE ? Math.max(0.9, b * 1.7) : b * 1.0;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  if (reducedMotion) {
    drawStatic();
  } else {
    requestAnimationFrame(animate);
  }
})();
