import { useCallback, useEffect, useRef, useState } from "react";
import Section from "../../components/layout/Section.jsx";
import ArrowIcon from "../../components/ui/ArrowIcon.jsx";
import "./Work.css";

const INITIAL = 5; // 2 wide cards + one row of 3 keeps the grid full on first paint
const STEP = 6; // two full rows per batch

export default function Work({ content: c }) {
  const items = c.items;
  const [count, setCount] = useState(() => Math.min(INITIAL, items.length));
  const listRef = useRef(null);
  const sentinelRef = useRef(null);
  const hasMore = count < items.length;

  const loadMore = useCallback(() => {
    setCount((n) => Math.min(n + STEP, items.length));
  }, [items.length]);

  // Load the next batch when the bottom of the list scrolls near the viewport.
  useEffect(() => {
    if (!hasMore || !("IntersectionObserver" in window)) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) loadMore(); },
      { rootMargin: "480px 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [hasMore, loadMore, count]);

  // New cards appear after the first paint, so useReveal cannot see them. Observe them here.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const list = listRef.current;
    if (!list) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.dataset.in = ""; io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    list.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count]);

  return (
    <Section id="work" title="Selected work" className="work">
      <p className="work__lead" data-reveal>{c.lead}</p>
      <ul className="work__grid" ref={listRef}>
        {items.slice(0, count).map((p, i) => (
          <li key={p.name} className="work__card" data-reveal style={{ "--d": i % 3 }}>
            <span className="work__idx" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <div className="work__top">
              <p className="work__kind">{p.kind}</p>
              {p.href && (
                <a className="work__link" href={p.href} target="_blank" rel="noopener noreferrer">
                  {p.href.replace(/^https?:\/\//, "")} <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
            {p.logo && <img className="work__logo" src={p.logo} alt="" height="56" loading="lazy" onError={(e) => { e.currentTarget.hidden = true; }} />}
            <h3 className="work__name">{p.name}</h3>
            <p className="work__text">{p.text}</p>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div className="work__more" ref={sentinelRef}>
          <button type="button" className="work__more-btn" onClick={loadMore}>Load more projects</button>
          <p className="work__count" aria-live="polite">Showing {Math.min(count, items.length)} of {items.length} projects</p>
        </div>
      ) : (
        <p className="work__count work__count--done" aria-live="polite">All {items.length} projects shown</p>
      )}
    </Section>
  );
}
