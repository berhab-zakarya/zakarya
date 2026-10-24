import { useEffect, useRef } from "react";
import { buildField, paintField } from "./contactField.js";

const MAX_BACKING_PIXELS = 3.5e6; // per canvas
const DEBOUNCE = 140;

/** Decorative, static square-particle field. Two stacked canvases; CSS fades the second one (opacity only)
 *  for a slow shimmer, and that animation is switched off for reduced motion. No JS animation loop at all. */
export default function ContactParticles() {
  const a = useRef(null), b = useRef(null);

  useEffect(() => {
    const ca = a.current, cb = b.current, host = ca.parentElement;
    let timer = 0, key = "";
    const build = () => {
      const r = host.getBoundingClientRect();
      const W = Math.round(r.width), H = Math.round(r.height);
      if (!W || !H || `${W}x${H}` === key) return;
      key = `${W}x${H}`;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (W * H * dpr * dpr > MAX_BACKING_PIXELS) dpr = Math.max(1, Math.sqrt(MAX_BACKING_PIXELS / (W * H)));
      const F = buildField(W, H);
      [ca, cb].forEach((cv, layer) => {
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        const ctx = cv.getContext("2d");
        ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
        paintField(ctx, F, layer, W, H);
      });
    };
    build();
    const ro = new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(build, DEBOUNCE); });
    ro.observe(host);
    return () => { clearTimeout(timer); ro.disconnect(); };
  }, []);

  return (
    <div className="contact__field" aria-hidden="true">
      <canvas ref={a} className="contact__canvas" />
      <canvas ref={b} className="contact__canvas contact__canvas--shimmer" />
    </div>
  );
}
