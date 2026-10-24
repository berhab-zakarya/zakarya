import { useEffect, useId, useRef, useState } from "react";
import CtaButton from "../ui/CtaButton.jsx";
import "./SiteHeader.css";

/** Fixed floating header. It lives outside any section, so it always sits on its own layer (--z-header). */
export default function SiteHeader({ brand, nav, cta, ctaHref }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuId = useId();
  const [active, setActive] = useState("");

  // mark the nav link of the section currently in view
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
    }, { rootMargin: "-45% 0px -50% 0px" });
    // the sections are lazy, so keep looking until they exist
    const t = setInterval(() => {
      const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
      if (els.length === ids.length) { els.forEach((el) => io.observe(el)); clearInterval(t); }
    }, 400);
    return () => { clearInterval(t); io.disconnect(); };
  }, [nav]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__row">
        <nav className="site-header__bar" ref={ref} aria-label="Main">
          <a className="site-header__brand" href="#top" aria-label={`${brand}, back to top`}>{brand}<i>.</i></a>
          <button type="button" className="site-header__toggle" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)}>
            <span className="site-header__lines" aria-hidden="true" />Menu
          </button>
          <div className="site-header__menu" id={menuId} data-open={open}>
            {nav.map((n) => <a key={n.label} href={n.href} aria-current={active === n.href ? "true" : undefined} onClick={() => setOpen(false)}>{n.label}</a>)}
          </div>
        </nav>
        <CtaButton className="site-header__cta" href={ctaHref} label={cta} />
      </div>
    </header>
  );
}
