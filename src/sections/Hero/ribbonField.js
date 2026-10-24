/* Pure functions: build a deterministic particle field, then paint it (optionally animated).
   Particles are bucketed into LEVELS colour levels so each level is drawn as ONE path (fast, even at 60fps). */
const BANDS = [
  { p: [[.56, 1.08], [.6, .55], [.74, .62], [.80, .02]], w: .052 },
  { p: [[.63, 1.08], [.72, .6], [.86, .66], [.90, .08]], w: .05 },
  { p: [[.71, 1.1], [.82, .66], [.97, .62], [1.03, .16]], w: .05 },
  { p: [[.69, .34], [.72, -.08], [.8, -.1], [.85, .12]], w: .04 },
];
export const LEVELS = 8;
export const RIPPLE_LIFE = 1200; // ms
const GHOST_LEVEL = 4;
export const STATIC_FX = { intro: 1, amb: false, rips: [] };

const bez = (p, t) => {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
};
export const ss = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
export const hash = (i, j) => {
  let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

export const cellFor = (W) => (W < 700 ? 8 : Math.max(8, Math.min(11, W / 150)));
/** The ribbon lives in the top part of the hero; on narrow screens it is capped so it never stretches. */
export const fieldHeight = (W, H) => Math.min(H, W * (W < 700 ? 1.05 : 0.95));
const influence = (W, cell) => ({ R: Math.max(90, Math.min(190, W * .11)), push: cell * 1.6 });

export function buildParticles(W, H) {
  const mobile = W < 700, cell = cellFor(W), Hh = fieldHeight(W, H), span = Math.max(W, 900);
  const paths = BANDS.map((b) => {
    const a = [];
    for (let i = 0; i <= 80; i++) { const q = bez(b.p, i / 80); a.push([q[0] * W, q[1] * Hh, i / 80]); }
    const w = b.w * span * (mobile ? 1.2 : 1), pad = w * 1.3; // 1.3 = peak of the thickness profile
    const xs = a.map((q) => q[0]), ys = a.map((q) => q[1]);
    // bounding box: cells outside it cannot be touched by this band, so skip the distance search
    return { a, w, x0: Math.min(...xs) - pad, x1: Math.max(...xs) + pad, y0: Math.min(...ys) - pad, y1: Math.max(...ys) + pad };
  });
  const cx = .56 * W + (mobile ? .1 * W : 0), cy = Hh * 1.05, rx = .17 * W * (mobile ? 1.4 : 1), ry = Hh * .72;
  // every particle stores `o`: its normalised distance from the dome. The intro sweep and ambient pulse travel along it.
  const ox = cx, oy = cy, maxD = Math.hypot(Math.max(ox, W - ox), oy) || 1;
  const lv = Array.from({ length: LEVELS }, () => ({ x: [], y: [], s: [], g: [], o: [] }));

  for (let j = 0; j * cell < Hh; j++) for (let i = 0; i * cell < W; i++) {
    const x = i * cell + cell / 2, y = j * cell + cell / 2;
    const ex = (x - cx) / rx, ey = (y - cy) / ry;
    let d = ss(1.15, .35, ex * ex + ey * ey) * (.55 + .45 * ss(0, 1, (y - Hh * .3) / (Hh * .5)));
    for (const b of paths) {
      if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) continue;
      // coarse pass on every 2nd sample, then refine on the two neighbours of the best one
      const a = b.a; let bi = 0, md = 1e9;
      for (let k = 0; k < a.length; k += 2) { const dx = x - a[k][0], dy = y - a[k][1], q = dx * dx + dy * dy; if (q < md) { md = q; bi = k; } }
      for (let k = bi - 1; k <= bi + 1; k += 2) {
        if (k < 0 || k >= a.length) continue;
        const dx = x - a[k][0], dy = y - a[k][1], q = dx * dx + dy * dy; if (q < md) { md = q; bi = k; }
      }
      const mt = a[bi][2], sg = ((x - a[bi][0]) + (y - a[bi][1])) * .7;
      const w = b.w * (.55 + .75 * Math.sin(Math.PI * Math.min(1, mt * 1.05)));
      let v = ss(1, .15, Math.sqrt(md) / w) * (1 - .55 * ss(.5, 1, mt));
      v *= .62 + .38 * Math.cos((sg / w) * Math.PI * 1.6 + mt * 6);
      d = Math.max(d, v);
    }
    d *= ss(.3, .5, x / W + .08 * Math.sin((y / Hh) * 5));
    const o = Math.min(1, Math.hypot(x - ox, y - oy) / maxD);
    const thr = .05 + hash(i, j) * .12;
    if (d < thr) {
      // "ghost" cells: invisible at rest, they light up under the pointer, ripples and the ambient pulse
      if (d > .015 && hash(i + 7, j + 13) < .55) { const L = lv[GHOST_LEVEL]; L.x.push(x); L.y.push(y); L.s.push(0); L.g.push(1); L.o.push(o); }
      continue;
    }
    const k = Math.min(1, d), L = lv[Math.min(LEVELS - 1, Math.floor(k * LEVELS))];
    L.x.push(x); L.y.push(y); L.s.push(Math.max(2, Math.round(cell * (.3 + .7 * Math.pow(k, .6))))); L.g.push(0); L.o.push(o);
  }
  return lv.map((l) => ({ x: Float32Array.from(l.x), y: Float32Array.from(l.y), s: Float32Array.from(l.s), g: Uint8Array.from(l.g), o: Float32Array.from(l.o) }));
}

const STYLES = Array.from({ length: LEVELS }, (_, l) => {
  const k = (l + .5) / LEVELS;
  return { fill: `rgb(${Math.round(200 + (1 - k) * 32)},${Math.round(50 + (1 - k) * 110)},${Math.round(26 + (1 - k) * 114)})`, alpha: .55 + .45 * k };
});

/**
 * m  = { x, y, s }  pointer position (canvas px) and strength 0..1
 * t  = time in ms (rAF timestamp)
 * fx = { intro 0..1, amb: boolean, rips: [{x, y, t0}] }  (STATIC_FX = plain, finished picture)
 */
export function paintRibbon(ctx, P, W, H, cell, m, t, fx = STATIC_FX) {
  ctx.clearRect(0, 0, W, H);
  const active = !!m && m.s > .01;
  const { R, push } = influence(W, cell), R2 = R * R;
  const rips = fx.rips, nr = rips.length, introDone = fx.intro >= 1;

  for (let l = 0; l < LEVELS; l++) {
    const L = P[l], st = STYLES[l];
    ctx.fillStyle = st.fill; ctx.globalAlpha = st.alpha;
    ctx.beginPath();
    for (let i = 0; i < L.x.length; i++) {
      const o = L.o[i];
      let k = 1;
      if (!introDone) { k = ss(0, 1, (fx.intro * 1.35 - o) / .3); if (k <= 0) continue; } // sweep outward from the dome
      let x = L.x[i], y = L.y[i], grow = 0, glow = 0;

      if (fx.amb) { // slow pulse travelling outward through the ribbon
        const v = .5 + .5 * Math.sin(o * 10 - t * .0012), w = v * v * v;
        grow = .4 * w; glow = .9 * Math.max(0, w - .45);
      }
      if (active) { // pointer: push away, grow, light up ghosts
        const dx = x - m.x, dy = y - m.y, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const dist = Math.sqrt(d2) || 1;
          const f = ss(R, 0, dist) * m.s * (.8 + .2 * Math.cos(dist * .09 - t * .006));
          x += (dx / dist) * f * push; y += (dy / dist) * f * push;
          grow += .7 * f; glow = Math.max(glow, f);
        }
      }
      for (let r = 0; r < nr; r++) { // click / tap shockwaves
        const rp = rips[r], age = t - rp.t0;
        if (age < 0 || age > RIPPLE_LIFE) continue;
        const dx = x - rp.x, dy = y - rp.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const band = ss(60, 0, Math.abs(dist - age * .55));
        if (band <= 0) continue;
        const a = 1 - age / RIPPLE_LIFE, f = band * a * a;
        x += (dx / dist) * f * cell * 2.4; y += (dy / dist) * f * cell * 2.4;
        grow += .9 * f; glow = Math.max(glow, .9 * f);
      }

      const s = (L.g[i] ? cell * .75 * glow : L.s[i] * (1 + grow)) * k;
      if (s >= 1) ctx.rect(x - s / 2, y - s / 2, s, s);
    }
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}