/* Contact background: a deterministic field of square particles that flows like a topographic map.
   Same technique as the hero ribbon (one path per colour level, hashed thresholds, size = density),
   but the density comes from warped value-noise contours + dense edge/corner pools instead of ribbons.
   Particles are split into two interleaved layers so the page can shimmer by fading ONE canvas (opacity only). */
import { hash, ss } from "../Hero/ribbonField.js";

export const LEVELS = 8;
const lerp = (a, b, t) => a + (b - a) * t;

function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(hash(xi, yi), hash(xi + 1, yi), u), lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), u), v);
}
const fbm = (x, y) => .55 * vnoise(x, y) + .3 * vnoise(x * 2.1 + 5.2, y * 2.1 + 1.3) + .15 * vnoise(x * 4.3 + 9.1, y * 4.3 + 3.7);

export const cellFor = (W) => (W < 700 ? 7 : Math.max(8, Math.min(10, W / 150)));

/** Dense pools: [x, y, radius] as fractions of the canvas (radius of width). Chosen edges/corners, like the reference. */
const POOLS = [[.02, .12, .2], [.98, .03, .22], [.0, .62, .16], [.1, 1.0, .24], [.93, .94, .2], [.55, 1.02, .16]];

export function buildField(W, H) {
  const mobile = W < 700, cell = cellFor(W), minDim = Math.min(W, H);
  const lv = Array.from({ length: LEVELS }, () => [{ x: [], y: [], s: [] }, { x: [], y: [], s: [] }]);
  for (let j = 0; j * cell < H; j++) for (let i = 0; i * cell < W; i++) {
    const x = i * cell + cell / 2, y = j * cell + cell / 2;
    const n = fbm(x / 340 + 3.1, y / 340 + 7.7);
    const n2 = fbm(x / 340 + n * 1.7, y / 340 - n * 1.3);
    const flow = .5 + .5 * Math.sin(n2 * 12 + x / 900);               // contour bands
    const edge = ss(minDim * .32, 0, Math.min(x, W - x, y, H - y));    // denser toward the borders
    let pool = 0;
    for (const [px, py, pr] of POOLS) { const d = Math.hypot(x - px * W, y - py * H) / (pr * W); pool = Math.max(pool, Math.exp(-d * d * 1.6)); }
    let d = (.12 + .88 * ss(.34, .86, n2)) * (.25 + .75 * flow) * (.18 + .82 * edge) * .78;
    d = Math.min(1, d + pool * .5);
    d *= .25 + .75 * ss(.12, .34, vnoise(x / 46 + 11, y / 46 + 4));      // sparse gaps and tears
    if (mobile) d *= .8;
    if (d < .1 + hash(i, j) * .2) continue;
    const k = Math.min(1, d), l = Math.min(LEVELS - 1, Math.floor(k * LEVELS));
    const layer = hash(i + 3, j + 5) < .42 ? 1 : 0;
    const L = lv[l][layer];
    L.x.push(x); L.y.push(y); L.s.push(Math.max(2, Math.round(cell * (.26 + .56 * Math.pow(k, .7)))));
  }
  return lv.map((pair) => pair.map((l) => ({ x: Float32Array.from(l.x), y: Float32Array.from(l.y), s: Float32Array.from(l.s) })));
}

/* umber -> rust -> vermilion -> sand: the densest cells run hot */
const STOPS = [[0, [70, 44, 30]], [.5, [168, 66, 36]], [.86, [255, 123, 85]], [1, [255, 214, 190]]];
const colorAt = (k) => {
  for (let i = 1; i < STOPS.length; i++) if (k <= STOPS[i][0]) {
    const [a, ca] = STOPS[i - 1], [b, cb] = STOPS[i], t = (k - a) / (b - a);
    return `rgb(${Math.round(lerp(ca[0], cb[0], t))},${Math.round(lerp(ca[1], cb[1], t))},${Math.round(lerp(ca[2], cb[2], t))})`;
  }
  return "rgb(255,214,190)";
};
const STYLES = Array.from({ length: LEVELS }, (_, l) => { const k = (l + .5) / LEVELS; return { fill: colorAt(k), alpha: .5 + .5 * k }; });

export function paintField(ctx, F, layer, W, H) {
  ctx.clearRect(0, 0, W, H);
  for (let l = 0; l < LEVELS; l++) {
    const L = F[l][layer];
    if (!L.x.length) continue;
    ctx.fillStyle = STYLES[l].fill; ctx.globalAlpha = STYLES[l].alpha;
    ctx.beginPath();
    for (let i = 0; i < L.x.length; i++) ctx.rect(L.x[i] - L.s[i] / 2, L.y[i] - L.s[i] / 2, L.s[i], L.s[i]);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
