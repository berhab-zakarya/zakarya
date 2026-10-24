import { memo, useEffect, useRef } from "react";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import { RIPPLE_LIFE, STATIC_FX, buildParticles, cellFor, fieldHeight, paintRibbon } from "./ribbonField.js";

const MAX_BACKING_PIXELS = 5e6; // cap canvas memory on big/hi-dpi screens
const RESIZE_DEBOUNCE = 120;
const INTRO_MS = 1100;
const IDLE_FRAME_MS_MOBILE = 50; // phones: ~20fps ambient pulse, saves battery and main-thread time
const IDLE_FRAME_MS = 33;       // ambient pulse runs at ~30fps when nothing else is happening

/**
 * Decorative canvas. Fills its positioned parent and listens to that parent's pointer.
 *
 * Motion: intro sweep from the dome, slow ambient pulse, pointer push/glow, click & tap shockwaves.
 * Performance
 *  - All animation state lives in a ref: no React renders while animating.
 *  - ONE rAF loop. It stops when the hero is off-screen or the tab is hidden, and restarts on return.
 *  - Reduced motion: no loop at all, the finished picture is painted once.
 *  - Particles rebuild only when geometry changes (width / capped height), resize is debounced.
 */
function DotRibbon() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const st = useRef({
    P: null, W: 0, H: 0, cell: 8, key: "", raf: 0, last: 0, t0: 0, visible: true, wake: null, repaint: () => { },
    m: { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 },
    fx: { intro: reduced ? 1 : 0, amb: false, rips: [] }, // start empty when the intro will play: no wasted full paint that is cleared right after
  });

  // 1) geometry: build + resize
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"), s = st.current;
    let timer = 0;
    s.repaint = () => s.P && paintRibbon(ctx, s.P, s.W, s.H, s.cell, s.m, performance.now(), s.fx);

    const build = () => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const W = r.width, H = r.height;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (W * H * dpr * dpr > MAX_BACKING_PIXELS) dpr = Math.max(1, Math.sqrt(MAX_BACKING_PIXELS / (W * H)));
      const bw = Math.round(W * dpr), bh = Math.round(H * dpr);
      if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; } // resizing clears the bitmap
      ctx.setTransform(bw / W, 0, 0, bh / H, 0, 0);
      const key = `${Math.round(W)}x${Math.round(fieldHeight(W, H))}`;
      if (key !== s.key || !s.P) { s.P = buildParticles(W, H); s.key = key; }
      s.W = W; s.H = H; s.cell = cellFor(W);
      s.repaint();
      s.wake && s.wake(); // the motion loop may have been waiting for the first layout
    };

    build(); // first paint is immediate
    const ro = new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(build, RESIZE_DEBOUNCE); });
    ro.observe(cv);
    return () => { clearTimeout(timer); ro.disconnect(); };
  }, []);

  // 2) motion loop + pointer (skipped entirely for reduced motion)
  useEffect(() => {
    if (reduced) return;
    const cv = ref.current, host = cv.parentElement, ctx = cv.getContext("2d"), s = st.current, m = s.m, fx = s.fx;

    fx.intro = 0; fx.amb = true; fx.rips.length = 0; s.t0 = performance.now(); s.last = 0;
    s.repaint(); // clears the finished picture painted by effect 1, so the intro starts from empty

    const frame = (t) => {
      s.raf = 0;
      if (!s.visible || document.hidden) return; // restarted by the observers below
      const introActive = fx.intro < 1;
      const busy = introActive || m.ts > 0 || m.s > .01 || fx.rips.length > 0;
      if (!busy && t - s.last < (s.W < 700 ? IDLE_FRAME_MS_MOBILE : IDLE_FRAME_MS)) { s.raf = requestAnimationFrame(frame); return; }
      s.last = t;

      if (introActive) { const p = Math.min(1, (t - s.t0) / INTRO_MS); fx.intro = 1 - Math.pow(1 - p, 3); }
      m.x += (m.tx - m.x) * .22; m.y += (m.ty - m.y) * .22; m.s += (m.ts - m.s) * .1;
      if (m.ts === 0 && m.s <= .01) m.s = 0;
      while (fx.rips.length && t - fx.rips[0].t0 > RIPPLE_LIFE) fx.rips.shift();

      paintRibbon(ctx, s.P, s.W, s.H, s.cell, m, t, fx);
      s.raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!s.raf && s.P && s.visible && !document.hidden) s.raf = requestAnimationFrame(frame); };
    s.wake = start;

    const local = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const onMove = (e) => {
      if (e.pointerType === "touch") return; // touch uses taps, never hover
      [m.tx, m.ty] = local(e);
      if (m.ts === 0) { m.x = m.tx; m.y = m.ty; }
      m.ts = 1; start();
    };
    const onLeave = () => { m.ts = 0; start(); };
    const onDown = (e) => {
      const [x, y] = local(e);
      fx.rips.push({ x, y, t0: performance.now() });
      if (fx.rips.length > 4) fx.rips.shift();
      start();
    };

    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) start(); });
    io.observe(host);
    document.addEventListener("visibilitychange", start);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown, { passive: true });
    start();

    return () => {
      cancelAnimationFrame(s.raf); s.raf = 0; s.wake = null;
      io.disconnect();
      document.removeEventListener("visibilitychange", start);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      Object.assign(fx, STATIC_FX, { rips: [] }); m.ts = 0; m.s = 0;
      s.repaint(); // leave the finished static picture behind
    };
  }, [reduced]);

  return <canvas ref={ref} className="dot-ribbon" aria-hidden="true" />;
}

export default memo(DotRibbon);