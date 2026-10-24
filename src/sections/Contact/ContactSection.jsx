import { useEffect, useRef } from "react";
import ContactParticles from "./ContactParticles.jsx";
import ContactLogos from "./ContactLogos.jsx";
import InquiryForm from "./InquiryForm.jsx";
import "./Contact.css";

export default function ContactSection({ content: c }) {
  const ref = useRef(null);

  // 1) while this dark section is under the floating header, let the header CTA adopt its accent
  useEffect(() => {
    const el = ref.current, root = document.documentElement;
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? (root.dataset.surface = "contact") : delete root.dataset.surface; }, { rootMargin: "0px 0px -88% 0px" });
    io.observe(el);
    return () => { io.disconnect(); delete root.dataset.surface; };
  }, []);

  // 2) any "#contact" link (header CTA, hero CTA) also moves focus into the form once the scroll lands.
  //    Skipped on touch devices so the on-screen keyboard doesn't pop open unasked.
  useEffect(() => {
    const onClick = (e) => {
      if (!e.target.closest?.('a[href="#contact"]') || !window.matchMedia("(hover: hover)").matches) return;
      const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650;
      setTimeout(() => ref.current?.querySelector("[data-autofocus]")?.focus({ preventScroll: true }), delay);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const t = c.testimonial;
  return (
    <section className="contact" id="contact" ref={ref} aria-labelledby="contact-title">
      <ContactParticles />
      <div className="container contact__wrap">
        <div className="contact__panel">
          <div className="contact__intro">
            <p className="c-eyebrow">{c.eyebrow} <b>{c.tag}</b></p>
            <h2 id="contact-title" className="c-title">
              {c.title.map((line, i) => (
                <span key={i} className="c-title__line">
                  {line.map((p, k) => (typeof p === "string" ? p : <em key={k}>{p.b}</em>))}
                </span>
              ))}
            </h2>
            <p className="c-lead">{c.lead}</p>
            {c.bookingUrl && (
              <p className="c-alt">{c.bookingLead} <a href={c.bookingUrl} target="_blank" rel="noopener noreferrer">{c.bookingLabel} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></p>
            )}

            <div className="contact__proof">
              <ContactLogos title={c.logosTitle} logos={c.logos} />
              {t && (
                <figure className="c-quote">
                  <blockquote><p>“{t.quote.replace(/^["“]|["”]$/g, "")}”</p></blockquote>
                  <figcaption><strong>{t.author}</strong><span>{t.role}</span></figcaption>
                </figure>
              )}
            </div>
          </div>

          <div className="contact__form">
            <InquiryForm form={c.form} endpoint={c.endpoint} privacyHref={c.privacyHref} />
          </div>
        </div>
      </div>
    </section>
  );
}
