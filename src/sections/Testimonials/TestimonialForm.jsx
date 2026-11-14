import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { avatarColor, detectDirection, initialOf, isConfigured, LIMITS, ROLES, submitTestimonial } from "../../lib/testimonials.js";
import "./TestimonialForm.css";

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

function FallbackAvatar({ name, size = 44 }) {
  return (
    <span className="tf-avatar tf-avatar--letter" style={{ "--avatar-bg": avatarColor(name), width: size, height: size }} aria-hidden="true">
      {initialOf(name)}
    </span>
  );
}

export default function TestimonialForm({ content: c, onClose, onSubmitted }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [direction, setDirection] = useState("ltr");
  const [directionTouched, setDirectionTouched] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const headingRef = useRef(null);
  const fileRef = useRef(null);
  const connected = isConfigured();

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
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  useEffect(() => {
    if (!done) headingRef.current?.focus();
  }, [step, done]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && !submitting) { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll('button:not([disabled]), input, textarea, select, [href], [tabindex]:not([tabindex="-1"])');
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const pickPhoto = (event) => {
    const next = event.target.files?.[0];
    event.target.value = "";
    if (!next) return;
    if (!next.type.startsWith("image/")) { setError(c.errors.photoType); return; }
    if (next.size > LIMITS.fileBytes) { setError(c.errors.photoSize); return; }
    setError("");
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };

  const removePhoto = () => {
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onQuote = (value) => {
    setQuote(value);
    if (!directionTouched) setDirection(detectDirection(value));
  };

  const validateStep = () => {
    if (step === 0 && name.trim().length < 2) { setError(c.errors.name); return false; }
    if (step === 1) {
      const length = quote.trim().length;
      if (length < LIMITS.quoteMin) { setError(c.errors.quoteShort); return false; }
      if (length > LIMITS.quoteMax) { setError(c.errors.quoteLong); return false; }
    }
    setError("");
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, 2));
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (step < 2) { next(); return; }
    if (!validateStep()) return;
    if (!connected) { setError(c.errors.notConfigured); return; }
    setSubmitting(true);
    setError("");
    try {
      await submitTestimonial({ name, role, quote, direction, file });
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError(err?.message || c.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  const title = done ? c.successTitle : c.title;
  const stepHeading = done ? c.successTitle : c.stepHeadings[step];

  return createPortal(
    <div className="tf" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) onClose(); }}>
      <div className="tf__dialog" role="dialog" aria-modal="true" aria-labelledby="tf-title" ref={dialogRef}>
        <div className="tf__head">
          <div>
            <p className="tf__eyebrow">{c.eyebrow}</p>
            <h2 className="tf__title" id="tf-title">{title}</h2>
          </div>
          <button type="button" className="tf__close" ref={closeRef} onClick={onClose} disabled={submitting} aria-label={c.close}>
            <CloseIcon />
          </button>
        </div>

        {!done && (
          <ol className="tf__steps" aria-label={c.progressLabel}>
            {c.steps.map((label, i) => (
              <li key={label} className={`tf__step${i === step ? " is-current" : ""}${i < step ? " is-done" : ""}`} aria-current={i === step ? "step" : undefined}>
                <span className="tf__step-n">{i + 1}</span>
                <span className="tf__step-label">{label}</span>
              </li>
            ))}
          </ol>
        )}

        <form className="tf__body" onSubmit={submit} noValidate>
          <h3 className="tf__heading" ref={headingRef} tabIndex={-1}>{stepHeading}</h3>

          {done ? (
            <div className="tf__success">
              <span className="tf__check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <p>{c.successBody}</p>
              <button type="button" className="tf__primary" onClick={onClose}>{c.close}</button>
            </div>
          ) : (
            <>
              {!connected && <p className="tf__notice">{c.errors.notConfigured}</p>}

              {step === 0 && (
                <div className="tf__fields">
                  <label className="tf__field">
                    <span>{c.nameLabel}</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={c.namePlaceholder}
                      maxLength={LIMITS.name}
                      autoComplete="name"
                      dir="auto"
                      autoFocus
                    />
                  </label>

                  <fieldset className="tf__roles">
                    <legend>{c.roleLabel}</legend>
                    <div className="tf__chips">
                      {ROLES.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`tf__chip${role === option ? " is-active" : ""}`}
                          onClick={() => setRole(role === option ? "" : option)}
                        >
                          {c.roles[option]}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                      placeholder={c.rolePlaceholder}
                      maxLength={LIMITS.role}
                      aria-label={c.rolePlaceholder}
                    />
                  </fieldset>

                  <div className="tf__photo">
                    <span className="tf__label">{c.photoLabel}</span>
                    <div className="tf__photo-row">
                      {preview ? <img className="tf-avatar" src={preview} alt="" width="52" height="52" /> : <FallbackAvatar name={name || "?"} size={52} />}
                      <div className="tf__photo-actions">
                        <button type="button" className="tf__link" onClick={() => fileRef.current?.click()}>
                          {preview ? c.photoChange : c.photoCta}
                        </button>
                        {preview && <button type="button" className="tf__link tf__link--muted" onClick={removePhoto}>{c.photoRemove}</button>}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} hidden />
                    </div>
                    <p className="tf__hint">{c.photoHint}</p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="tf__fields">
                  <label className="tf__field">
                    <span>{c.quoteLabel}</span>
                    <textarea
                      value={quote}
                      onChange={(event) => onQuote(event.target.value)}
                      placeholder={c.quotePlaceholder}
                      maxLength={LIMITS.quoteMax}
                      rows={6}
                      dir={direction}
                      autoFocus
                    />
                    <span className="tf__counter">{quote.trim().length} / {LIMITS.quoteMax}</span>
                  </label>

                  <div className="tf__direction" role="group" aria-label={c.directionLabel}>
                    <span className="tf__label">{c.directionLabel}</span>
                    <div className="tf__chips">
                      <button type="button" className={`tf__chip${direction === "ltr" ? " is-active" : ""}`} onClick={() => { setDirection("ltr"); setDirectionTouched(true); }}>{c.directionLtr}</button>
                      <button type="button" className={`tf__chip${direction === "rtl" ? " is-active" : ""}`} onClick={() => { setDirection("rtl"); setDirectionTouched(true); }}>{c.directionRtl}</button>
                    </div>
                    <p className="tf__hint">{c.quoteHint}</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="tf__review">
                  <div className="tf__preview" dir={direction}>
                    <blockquote>{quote}</blockquote>
                    <div className="tf__preview-author">
                      {preview ? <img className="tf-avatar" src={preview} alt="" width="44" height="44" /> : <FallbackAvatar name={name || "?"} />}
                      <div>
                        <p className="tf__preview-name">{name}</p>
                        {role && <p className="tf__preview-role">{role}</p>}
                      </div>
                    </div>
                  </div>
                  <p className="tf__hint">{c.reviewNote}</p>
                </div>
              )}

              {error && <p className="tf__error" role="alert">{error}</p>}

              <div className="tf__actions">
                {step > 0 ? (
                  <button type="button" className="tf__secondary" onClick={back} disabled={submitting}>{c.back}</button>
                ) : (
                  <span />
                )}
                {step < 2 ? (
                  <button type="button" className="tf__primary" onClick={next}>{c.next}</button>
                ) : (
                  <button type="submit" className="tf__primary" disabled={submitting || !connected}>
                    {submitting ? c.submitting : c.submit}
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>,
    document.body,
  );
}
