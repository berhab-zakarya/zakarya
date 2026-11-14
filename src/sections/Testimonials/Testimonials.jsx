import { useCallback, useEffect, useRef, useState } from "react";
import CtaButton from "../../components/ui/CtaButton.jsx";
import TestimonialForm from "./TestimonialForm.jsx";
import { avatarColor, fetchTestimonials, initialOf } from "../../lib/testimonials.js";
import "./Testimonials.css";

const GAP = 24;
const COPIES = 3;

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "M12.5 4.5L7 10l5.5 5.5" : "M7.5 4.5L13 10l-5.5 5.5"} />
    </svg>
  );
}

function Avatar({ name, src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className="tm-avatar tm-avatar--letter" style={{ "--avatar-bg": avatarColor(name) }} aria-hidden="true">
        {initialOf(name)}
      </span>
    );
  }
  return <img className="tm-avatar" src={src} alt="" width="44" height="44" loading="lazy" onError={() => setFailed(true)} />;
}

function Card({ item, index, total, hidden, onPrev, onNext }) {
  const rtl = item.direction === "rtl";
  return (
    <article className="tm-card" dir={rtl ? "rtl" : "ltr"} aria-hidden={hidden || undefined}>
      <div className="tm-card__side">
        <p className="tm-card__count" dir="ltr">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="tm-card__count-total">/ {String(total).padStart(2, "0")}</span>
        </p>
        <div className="tm-card__nav">
          <button type="button" className="tm-nav" onClick={onPrev} aria-label="Previous testimonial" tabIndex={hidden ? -1 : 0}>
            <Chevron dir="left" />
          </button>
          <button type="button" className="tm-nav" onClick={onNext} aria-label="Next testimonial" tabIndex={hidden ? -1 : 0}>
            <Chevron dir="right" />
          </button>
        </div>
      </div>
      <div className="tm-card__body">
        <blockquote className="tm-card__quote">{item.quote}</blockquote>
        <div className="tm-card__author">
          <Avatar name={item.name} src={item.avatar_url} />
          <div>
            <p className="tm-card__name">{item.name}</p>
            {item.role && <p className="tm-card__role">{item.role}</p>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials({ content: c }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [formOpen, setFormOpen] = useState(false);

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const offset = useRef(0);
  const target = useRef(null);
  const paused = useRef(false);
  const drag = useRef(null);
  const size = useRef({ step: 0, set: 0 });

  const load = useCallback(() => {
    let alive = true;
    setStatus("loading");
    fetchTestimonials()
      .then((rows) => { if (alive) { setItems(rows); setStatus("ready"); } })
      .catch(() => { if (alive) { setItems([]); setStatus("error"); } });
    return () => { alive = false; };
  }, []);

  useEffect(() => load(), [load]);

  const list = Array.from({ length: COPIES }, () => items).flat();

  const measure = useCallback(() => {
    const kids = trackRef.current?.children;
    if (!kids || kids.length <= items.length || !items.length) return;
    size.current.step = Math.abs(kids[1].offsetLeft - kids[0].offsetLeft);
    size.current.set = Math.abs(kids[items.length].offsetLeft - kids[0].offsetLeft);
  }, [items.length]);

  useEffect(() => {
    if (!items.length) return;
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 699px)").matches;
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const set = size.current.set;

      if (target.current !== null) {
        const diff = target.current - offset.current;
        offset.current += diff * Math.min(1, dt * 9);
        if (Math.abs(diff) < 0.5) { offset.current = target.current; target.current = null; }
      } else if (!paused.current && !drag.current && !reduce && !narrow) {
        offset.current += c.speed * dt;
      }

      if (set > 0) {
        while (offset.current >= set) {
          offset.current -= set;
          if (target.current !== null) target.current -= set;
        }
        while (offset.current < 0) {
          offset.current += set;
          if (target.current !== null) target.current += set;
        }
      }

      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-offset.current}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [items.length, measure, c.speed]);

  const go = useCallback((step) => {
    const from = target.current !== null ? target.current : offset.current;
    target.current = from + step * size.current.step;
  }, []);

  const onPointerDown = (event) => {
    if (event.target.closest("button")) return;
    drag.current = { x: event.clientX, start: offset.current };
    target.current = null;
    viewportRef.current?.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!drag.current) return;
    offset.current = drag.current.start - (event.clientX - drag.current.x);
  };
  const endDrag = () => { drag.current = null; };
  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
  };

  const hasItems = status === "ready" && items.length > 0;
  const emptyText = status === "error" ? c.error : c.empty;

  return (
    <section id="testimonials" className="tm" aria-labelledby="testimonials-title">
      <div className="container">
        <header className="tm__head" data-reveal>
          <p className="tm__label">
            {c.label}
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M6 14L14 6M8 6h6v6" />
            </svg>
          </p>
          <div className="tm__headmain">
            <h2 id="testimonials-title" className="tm__title">
              {c.title.map((line) => <span key={line}>{line}</span>)}
            </h2>
            <p className="tm__lead">{c.lead}</p>
            <CtaButton label={c.cta} onClick={() => setFormOpen(true)} />
          </div>
        </header>
      </div>

      {status === "loading" && (
        <div className="container tm__static" aria-hidden="true">
          <div className="tm__skeletons">
            {[0, 1].map((i) => <div className="tm-card tm-card--skeleton" key={i} />)}
          </div>
        </div>
      )}

      {status !== "loading" && !hasItems && (
        <div className="container">
          <div className="tm__empty" data-reveal>
            <p>{emptyText}</p>
            <button type="button" className="tm__empty-cta" onClick={() => setFormOpen(true)}>{c.cta}</button>
          </div>
        </div>
      )}

      {hasItems && (
        <div className="container">
          <div
            className="tm__viewport"
            ref={viewportRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") paused.current = true; }}
            onPointerLeave={(e) => { if (e.pointerType === "mouse") paused.current = false; }}
            onFocus={() => { paused.current = true; }}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) paused.current = false; }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="tm__track" ref={trackRef} style={{ gap: GAP }}>
              {list.map((item, i) => {
                const original = i < items.length;
                return (
                  <Card
                    key={`${item.id}-${i}`}
                    item={item}
                    index={i % items.length}
                    total={items.length}
                    hidden={!original}
                    onPrev={() => go(-1)}
                    onNext={() => go(1)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <TestimonialForm
          content={c.form}
          onClose={() => setFormOpen(false)}
          onSubmitted={() => load()}
        />
      )}
    </section>
  );
}
