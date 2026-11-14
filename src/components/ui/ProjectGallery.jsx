import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import "./ProjectGallery.css";

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "prev" ? "M12.5 4.5L7 10l5.5 5.5" : "M7.5 4.5L13 10l-5.5 5.5"} />
    </svg>
  );
}

/** Full-screen screenshot viewer. Main image slides horizontally, thumbnails scroll vertically. */
export default function ProjectGallery({ project, onClose }) {
  const images = project.images;
  const [mainRef, mainApi] = useEmblaCarousel({ axis: "x", loop: false });
  const [thumbsRef, thumbsApi] = useEmblaCarousel({ axis: "y", containScroll: "keepSnaps", dragFree: true });
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  useEffect(() => {
    if (!mainApi) return;
    const onSelect = () => {
      const next = mainApi.selectedScrollSnap();
      setIndex(next);
      thumbsApi?.scrollTo(next);
    };
    onSelect();
    mainApi.on("select", onSelect).on("reInit", onSelect);
    return () => { mainApi.off("select", onSelect).off("reInit", onSelect); };
  }, [mainApi, thumbsApi]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key === "ArrowLeft") { event.preventDefault(); mainApi?.scrollPrev(); }
      if (event.key === "ArrowRight") { event.preventDefault(); mainApi?.scrollNext(); }
      if (event.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mainApi, onClose]);

  const jumpTo = (i) => { mainApi?.scrollTo(i); };

  return createPortal(
    <div className="pg" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pg__dialog" role="dialog" aria-modal="true" aria-labelledby="pg-title" ref={dialogRef}>
        <div className="pg__head">
          <div>
            <h2 className="pg__title" id="pg-title">{project.name}</h2>
            <p className="pg__meta">{project.kind} · {images.length} screenshots</p>
          </div>
          <div className="pg__head-actions">
            <p className="pg__counter" aria-live="polite">{index + 1} / {images.length}</p>
            <button className="pg__close" type="button" ref={closeRef} onClick={onClose} aria-label="Close screenshots">
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="pg__body">
          <div className="pg__main">
            <div className="pg__stage">
              <div className="pg__viewport" ref={mainRef}>
                <div className="pg__container">
                  {images.map((img) => (
                    <figure className="pg__slide" key={img.src}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        loading="eager"
                        decoding="async"
                        className="pg__img"
                      />
                    </figure>
                  ))}
                </div>
              </div>
              <button className="pg__nav pg__nav--prev" type="button" onClick={() => mainApi?.scrollPrev()} disabled={index === 0} aria-label="Previous screenshot">
                <Chevron dir="prev" />
              </button>
              <button className="pg__nav pg__nav--next" type="button" onClick={() => mainApi?.scrollNext()} disabled={index === images.length - 1} aria-label="Next screenshot">
                <Chevron dir="next" />
              </button>
            </div>
            <p className="pg__caption">{images[index]?.alt}</p>
          </div>

          <div className="pg__thumbs" aria-label="Screenshot thumbnails">
            <div className="pg__thumbs-viewport" ref={thumbsRef}>
              <div className="pg__thumbs-container">
                {images.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    className={`pg__thumb${i === index ? " is-active" : ""}`}
                    onClick={() => jumpTo(i)}
                    aria-label={`Screenshot ${i + 1}: ${img.alt}`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    <img src={img.src} alt="" width={img.width} height={img.height} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
