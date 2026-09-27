/* Imdad Areeph — cinematic scroll portfolio
 * Scenes are sticky stages; each drives a canvas from scroll progress.
 * If frames/<clip>/manifest.json exists, the canvas scrubs that frame sequence
 * (see scripts/extract-frames.sh). Otherwise a procedural stand-in is drawn.
 */
(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const AMBER = '#e2a76f', CREAM = '#f1e9db', INK = '#0a0908';
  const DISPLAY = '"Anton", Impact, "Arial Narrow", sans-serif';
  const MONO = '"SFMono-Regular", Consolas, monospace';

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !RM) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
  }

  /* ---------- frame sequence ---------- */
  class Frames {
    constructor(clip) { this.clip = clip; this.ready = false; this.settled = false; this.imgs = []; this.loaded = 0; this.count = 0; }
    async load() {
      let m;
      try {
        const r = await fetch(`frames/${this.clip}/manifest.json`, { cache: 'no-cache' });
        if (r.ok) m = await r.json();
      } catch (e) { /* no manifest: stand-in */ }
      if (!m || !m.count) { this.settled = true; return false; }
      this.count = m.count; this.settled = true; this.pad = m.pad || 4; this.ext = m.ext || 'webp';
      this.imgs = new Array(this.count).fill(null);
      const order = [];
      // coarse-to-fine so the scrub is usable before every frame arrives
      for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < this.count; i += step) if (!order.includes(i)) order.push(i);
      let inflight = 0, idx = 0;
      await new Promise(res => {
        const next = () => {
          if (idx >= order.length) { if (inflight === 0) res(); return; }
          const i = order[idx++]; inflight++;
          const img = new Image();
          img.decoding = 'async';
          img.onload = img.onerror = () => { inflight--; this.imgs[i] = img.naturalWidth ? img : null; this.loaded++; if (this.loaded === 1) this.ready = true; next(); };
          img.src = `frames/${this.clip}/${String(i + 1).padStart(this.pad, '0')}.${this.ext}`;
        };
        for (let k = 0; k < 6; k++) next();
      });
      return this.ready;
    }
    at(p) {
      if (!this.ready) return null;
      const want = clamp(Math.round(p * (this.count - 1)), 0, this.count - 1);
      if (this.imgs[want]) return this.imgs[want];
      for (let d = 1; d < this.count; d++) {
        if (this.imgs[want - d]) return this.imgs[want - d];
        if (this.imgs[want + d]) return this.imgs[want + d];
      }
      return null;
    }
  }

  // focalY: where the image's vertical anchor sits when the canvas is taller than the image
  // (0 = top, .5 = centre). Faces live in the upper third of a 16:9 frame, so bias upward.
  const cover = (ctx, img, w, h, scale = 1, dx = 0, dy = 0, focalY = .32) => {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    const s = Math.max(w / iw, h / ih) * scale, dw = iw * s, dh = ih * s;
    const oy = dh > h ? (h - dh) * focalY : (h - dh) / 2;
    ctx.drawImage(img, (w - dw) / 2 + dx, oy + dy, dw, dh);
  };

  /* ---------- procedural stand-ins ---------- */
  const rnd = (seed) => { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const dust = (ctx, w, h, p, seed = 7, n = 70) => {
    const r = rnd(seed);
    ctx.save(); ctx.fillStyle = AMBER;
    for (let i = 0; i < n; i++) {
      const x = ((r() + p * .06 * (i % 3 + 1)) % 1) * w, y = ((r() - p * .12) % 1 + 1) % 1 * h, sz = .6 + r() * 1.8;
      ctx.globalAlpha = .08 + r() * .25;
      ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  };
  const vignette = (ctx, w, h, cx = .78, cy = .2, k = .32) => {
    const g = ctx.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, Math.max(w, h) * .75);
    g.addColorStop(0, `rgba(226,167,111,${k})`); g.addColorStop(.45, 'rgba(120,70,30,.08)'); g.addColorStop(1, 'rgba(10,9,8,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  };
  const panel = (ctx, x, y, w, h, title, sub, lit, u) => {
    ctx.save();
    ctx.fillStyle = lit ? 'rgba(226,167,111,.10)' : 'rgba(18,16,14,.78)';
    ctx.strokeStyle = lit ? AMBER : 'rgba(241,233,219,.16)'; ctx.lineWidth = lit ? 1.4 : 1;
    ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = lit ? CREAM : 'rgba(241,233,219,.7)';
    // shrink the title until it fits the panel
    let fs = u * .03; ctx.font = `${fs}px ${DISPLAY}`;
    const maxW = w - u * .04;
    while (fs > 8 && ctx.measureText(title.toUpperCase()).width > maxW) { fs *= .92; ctx.font = `${fs}px ${DISPLAY}`; }
    ctx.textBaseline = 'top';
    ctx.fillText(title.toUpperCase(), x + u * .02, y + u * .02);
    if (sub && h > u * .07) {
      let ss = u * .015; ctx.font = `${ss}px ${MONO}`;
      while (ss > 6 && ctx.measureText(sub).width > maxW) { ss *= .92; ctx.font = `${ss}px ${MONO}`; }
      ctx.fillStyle = lit ? AMBER : 'rgba(163,151,138,.9)'; ctx.fillText(sub, x + u * .02, y + h - ss - u * .02);
    }
    ctx.restore();
  };
  const label = (ctx, text, x, y, u, size = .017, color = AMBER, align = 'left') => {
    ctx.save(); ctx.fillStyle = color; ctx.font = `600 ${u * size}px ${MONO}`; ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), x, y); ctx.restore();
  };

  const STANDIN = {
    hero(ctx, w, h, p, s) {
      ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
      if (s.poster && s.poster.complete && s.poster.naturalWidth) {
        cover(ctx, s.poster, w, h, lerp(1.22, 1.0, ease(p)), lerp(-w * .06, w * .04, p), lerp(h * .02, -h * .02, p));
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, 'rgba(10,9,8,.85)'); g.addColorStop(.5, 'rgba(10,9,8,.15)'); g.addColorStop(1, 'rgba(10,9,8,.55)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      vignette(ctx, w, h, .82, .18, .26);
      dust(ctx, w, h, p, 3, 90);
    },
    builder(ctx, w, h, p, s) {
      const u = Math.min(w, h);
      ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
      vignette(ctx, w, h, .5, .1, .22);
      const steps = [['Business Intent', 'problem · outcome'], ['Product Agents', 'requirements'], ['Architect Agents', 'solution design'], ['Planning Agents', 'work breakdown'], ['Coding Agents', 'implementation'], ['Delivery Agents', 'CI / CD'], ['Validation', 'test · release']];
      const narrow = (s.cssW || w) < 900, cols = narrow ? 4 : 7;
      const gap = w * .02, pw = (w * .88 - gap * (cols - 1)) / cols, ph = u * .11;
      const lit = Math.floor(p * 8);
      // the stand-in sits behind the pillar copy, so keep it quiet
      ctx.save(); ctx.globalAlpha = .55; ctx.strokeStyle = 'rgba(226,167,111,.35)'; ctx.lineWidth = 1;
      const pos = steps.map((_, i) => {
        const row = Math.floor(i / cols), col = i % cols, fl = Math.sin(p * 6 + i * 1.3) * u * .01;
        const rowW = Math.min(cols, steps.length - row * cols) * (pw + gap) - gap;
        return { x: w * .06 + (w * .88 - rowW) / 2 + col * (pw + gap), y: h * .16 + row * (ph + u * .05) + (col % 2 ? u * .015 : -u * .015) + fl };
      });
      steps.forEach((st, i) => {
        panel(ctx, pos[i].x, pos[i].y, pw, ph, st[0], st[1], i < lit, u);
        if (i < 6) { ctx.beginPath(); ctx.moveTo(pos[i].x + pw, pos[i].y + ph / 2); ctx.lineTo(pos[i + 1].x, pos[i + 1].y + ph / 2); ctx.stroke(); }
      });
      const y2 = h * .84;
      ctx.fillStyle = 'rgba(226,167,111,.5)'; ctx.fillRect(w * .06, y2, w * .88 * clamp(p * 1.4, 0, 1), 1);
      const cuts = ['Knowledge · domain context', 'Governance · policy & controls', 'Human review · approval', 'Evaluation · quality & evidence'];
      cuts.forEach((t, i) => {
        const c = narrow ? i % 2 : i, r = narrow ? Math.floor(i / 2) : 0, per = narrow ? 2 : 4;
        label(ctx, t, w * .06 + c * (w * .88 / per), y2 + u * .03 + r * u * .03, u, .014, i / 4 < p ? AMBER : 'rgba(163,151,138,.75)');
      });
      label(ctx, 'ADLC · Agentic Development Lifecycle', w * .06, h * .1, u, .015, 'rgba(226,167,111,.85)');
      ctx.restore();
      dust(ctx, w, h, p, 11, 60);
    },
    creator(ctx, w, h, p, s) {
      const u = Math.min(w, h);
      ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
      vignette(ctx, w, h, .2, .15, lerp(.05, .3, clamp(p * 2, 0, 1)));
      ctx.save(); ctx.globalAlpha = .6;
      const stages = ['Flight search', 'Seat selection', 'Payment', 'Ticketing'];
      const pw = Math.min(w * .17, u * .38), ph = u * .11, gap = (w * .8 - pw * 4) / 3, x0 = w * .1, y0 = h * .2;
      stages.forEach((t, i) => panel(ctx, x0 + i * (pw + gap), y0, pw, ph, t, 'event · reactive', i / 4 < p, u));
      const by = y0 + ph + u * .12;
      ctx.save(); ctx.strokeStyle = AMBER; ctx.lineWidth = 2; ctx.globalAlpha = .8;
      ctx.beginPath(); ctx.moveTo(x0, by); ctx.lineTo(x0 + w * .8, by); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = CREAM;
      for (let i = 0; i < 14; i++) { const x = x0 + ((i / 14 + p * .9) % 1) * w * .8; ctx.beginPath(); ctx.arc(x, by, 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = 'rgba(226,167,111,.4)'; ctx.lineWidth = 1;
      stages.forEach((t, i) => { const cx = x0 + i * (pw + gap) + pw / 2; ctx.beginPath(); ctx.moveTo(cx, y0 + ph); ctx.lineTo(cx, by); ctx.stroke(); });
      ctx.restore();
      label(ctx, 'Event backbone · Solace · Kafka · RabbitMQ', x0, by - u * .03, u, .015);
      const cy = by + u * .1, cw = Math.min(w * .22, u * .5);
      ['WebFlux service · search', 'WebFlux service · booking', 'WebFlux service · fulfilment'].forEach((t, i) => {
        const cx = x0 + i * (w * .8 - cw) / 2;
        panel(ctx, cx, cy, cw, u * .08, 'Spring WebFlux', t.split('· ')[1], (i + 1) / 4 < p, u);
        ctx.save(); ctx.strokeStyle = 'rgba(226,167,111,.4)'; ctx.beginPath(); ctx.moveTo(cx + cw / 2, by); ctx.lineTo(cx + cw / 2, cy); ctx.stroke(); ctx.restore();
      });
      const ty = h * .86;
      label(ctx, 'OpenTelemetry trace', x0, ty - u * .03, u, .015);
      ctx.fillStyle = 'rgba(241,233,219,.08)'; ctx.fillRect(x0, ty, w * .8, u * .012);
      const spans = [[0, .28], [.3, .22], [.54, .18], [.74, .26]];
      spans.forEach(([a, l], i) => { const vis = clamp((p - i * .12) * 2.2, 0, 1); ctx.fillStyle = i % 2 ? AMBER : '#b0641a'; ctx.fillRect(x0 + w * .8 * a, ty + i * u * .015, w * .8 * l * vis, u * .01); });
      ctx.restore();
      dust(ctx, w, h, p, 19, 50);
    },
    closer(ctx, w, h, p, s) {
      const u = Math.min(w, h), cx = w / 2, cy = h * .64; // walls sit below the finale copy
      ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
      const flare = clamp((p - .7) / .3, 0, 1);
      vignette(ctx, w, h, .5, .5, lerp(.1, .5, flare));
      const left = ['Orchestrator', 'Specialist agents', 'MCP tools', 'Human approval'];
      const right = ['Solace', 'Kafka', 'RabbitMQ', 'Topics · reactive services'];
      const travel = p * 1.6;
      ctx.save(); ctx.strokeStyle = 'rgba(226,167,111,.18)'; ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + i * w * .35, h + 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + i * w * .35, -10); ctx.stroke(); }
      ctx.restore();
      const drawWall = (items, side) => {
        items.forEach((t, i) => {
          let z = ((i / items.length + 0.15 - travel * .25) % 1 + 1) % 1; // 0 = far, 1 = near
          const depth = .12 + z * .88, sc = depth;
          const pw = u * .34 * sc, ph = u * .2 * sc;
          const x = side < 0 ? cx - w * .12 * depth - pw - w * .12 * sc : cx + w * .12 * depth + w * .12 * sc;
          const y = cy - ph / 2;
          ctx.save(); ctx.globalAlpha = clamp(z * 1.6, .12, 1) * lerp(.85, 1, flare);
          panel(ctx, x, y, pw, ph, t, side < 0 ? 'agent orchestration' : 'event backbone', z > .55 || flare > .5, u * sc);
          ctx.restore();
        });
      };
      ctx.save(); ctx.globalAlpha = .55; drawWall(left, -1); drawWall(right, 1); ctx.restore();
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, u * .45);
      g.addColorStop(0, `rgba(226,167,111,${lerp(.12, .55, flare)})`); g.addColorStop(1, 'rgba(10,9,8,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      label(ctx, 'Agent orchestration', w * .06, h * .1, u, .015);
      label(ctx, 'Event backbone', w * .94, h * .1, u, .015, AMBER, 'right');
      dust(ctx, w, h, p, 23, 80);
    }
  };

  /* ---------- scene runtime ---------- */
  class Scene {
    constructor(el) {
      this.el = el; this.name = el.dataset.scene; this.clip = el.dataset.clip;
      this.canvas = el.querySelector('.scene__canvas'); this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.badge = el.querySelector('[data-clip-badge]');
      this.frames = new Frames(this.clip);
      this.poster = null; if (el.dataset.poster) { this.poster = new Image(); this.poster.src = el.dataset.poster; this.poster.onload = () => this.dirty = true; }
      this.p = -1; this.dirty = true; this.w = 0; this.h = 0;
      this.resize();
      this.frames.load().then(ok => { if (!ok && this.badge) this.badge.hidden = false; this.dirty = true; });
    }
    resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const r = this.canvas.getBoundingClientRect();
      this.cssW = r.width; this.w = Math.round(r.width * dpr); this.h = Math.round(r.height * dpr);
      if (this.canvas.width !== this.w || this.canvas.height !== this.h) { this.canvas.width = this.w; this.canvas.height = this.h; }
      this.dirty = true;
    }
    progress() {
      const r = this.el.getBoundingClientRect(), vh = innerHeight;
      return clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    }
    visible() { const r = this.el.getBoundingClientRect(); return r.bottom > -innerHeight * .5 && r.top < innerHeight * 1.5; }
    draw() {
      if (!this.visible()) return;
      const p = this.progress();
      if (!this.dirty && Math.abs(p - this.p) < .0008) return;
      this.p = p; this.dirty = false;
      const { ctx, w, h } = this;
      if (!this.frames.settled) { ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h); this.dirty = true; return; }
      if (this.frames.count) {
        const img = this.frames.at(p);
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        if (img) cover(ctx, img, w, h);
        if (this.frames.loaded < this.frames.count) this.dirty = true;
        return;
      }
      (STANDIN[this.name] || STANDIN.hero)(ctx, w, h, p, this);
    }
  }

  const scenes = [...document.querySelectorAll('.scene')].map(el => new Scene(el));
  addEventListener('resize', () => scenes.forEach(s => s.resize()), { passive: true });

  /* ---------- hero kinetic type ---------- */
  const heroEl = document.getElementById('hero');
  const letters = [...heroEl.querySelectorAll('.hero__name .l')];
  const eyebrow = heroEl.querySelector('[data-hero-eyebrow]'), sub = heroEl.querySelector('[data-hero-sub]'), hint = heroEl.querySelector('[data-hero-hint]');
  const heroType = p => {
    if (RM) return;
    // letters track in across the first 45% of the orbit, then hold; ease out at the end
    letters.forEach((l, i) => {
      const t = clamp((p - i * .028) / .22, 0, 1), e = 1 - Math.pow(1 - t, 3);
      const out = clamp((p - .86) / .14, 0, 1);
      l.style.transform = `translateY(${lerp(110, 0, e) - out * 30}%) skewY(${lerp(8, 0, e)}deg)`;
      l.style.opacity = String(1 - out);
    });
    const on = p > .3;
    eyebrow.style.opacity = on ? '1' : '0'; eyebrow.style.transform = on ? 'none' : 'translateY(12px)';
    const s2 = p > .5;
    sub.style.opacity = s2 ? '1' : '0'; sub.style.transform = s2 ? 'none' : 'translateY(16px)';
    hint.style.opacity = p > .08 ? '0' : '1';
  };

  /* ---------- pillars ---------- */
  const pillars = [...document.querySelectorAll('.pillar')], dots = [...document.querySelectorAll('[data-dot]')];
  const pillarsEl = document.getElementById('pillars');
  const pillarsAt = p => {
    // 0–.12 lead-in, then thirds; last pillar holds to the end
    const idx = p < .12 ? -1 : Math.min(2, Math.floor((p - .12) / .29));
    pillars.forEach((el, i) => { el.classList.toggle('is-on', i === idx); el.classList.toggle('is-gone', i < idx); });
    dots.forEach((d, i) => d.classList.toggle('is-on', i <= idx));
  };

  /* ---------- work cards ---------- */
  const cards = [...document.querySelectorAll('.card')], workEl = document.getElementById('work');
  const cardsAt = p => cards.forEach((c, i) => c.classList.toggle('is-in', p > .15 + i * .1));
  cards.forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', `${x * 100}%`); c.style.setProperty('--my', `${y * 100}%`);
      if (!RM) c.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`;
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });

  /* ---------- stats count-up ---------- */
  const statsEl = document.getElementById('stats');
  const countUp = () => {
    statsEl.querySelectorAll('[data-count]').forEach(el => {
      const n = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      if (RM) { el.textContent = pre + n + suf; return; }
      const t0 = performance.now(), dur = 1400;
      const step = t => { const k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3); el.textContent = pre + Math.round(n * e) + (k === 1 ? suf : ''); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    statsEl.querySelectorAll('[data-count-text]').forEach(el => { el.textContent = el.dataset.countText; });
  };
  const so = new IntersectionObserver(([e]) => { if (e.isIntersecting) { so.disconnect(); countUp(); } }, { threshold: .3 });
  so.observe(statsEl);

  /* ---------- finale ---------- */
  const finaleEl = document.getElementById('finale'), finaleLines = [...finaleEl.querySelectorAll('.finale__title .line')];
  const finaleAt = p => { if (RM) return; finaleLines.forEach((l, i) => { const t = clamp((p - .1 - i * .12) / .3, 0, 1); l.style.transform = `translateY(${lerp(30, 0, 1 - Math.pow(1 - t, 3))}px)`; l.style.opacity = String(t); }); };

  /* ---------- frame loop ---------- */
  const progress = document.getElementById('progress');
  const sceneOf = el => scenes.find(s => s.el === el);
  const tick = (time) => {
    if (lenis) lenis.raf(time);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    scenes.forEach(s => s.draw());
    heroType(sceneOf(heroEl).progress());
    pillarsAt(sceneOf(pillarsEl).progress());
    cardsAt(sceneOf(workEl).progress());
    finaleAt(sceneOf(finaleEl).progress());
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // anchors through Lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href')); if (!t) return; e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: 0 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));
  document.getElementById('yr').textContent = new Date().getFullYear();
})();
