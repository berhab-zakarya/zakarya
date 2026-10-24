import { useEffect } from "react";

/** Fades `[data-reveal]` elements in once as they scroll into view. Stagger with style={{ "--d": index }}.
 *  Does nothing (content simply stays visible) with reduced motion or without IntersectionObserver. */
export default function useReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    root.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.dataset.in = ""; io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => { io.disconnect(); root.classList.remove("js-reveal"); };
  }, []);
}
