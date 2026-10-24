import { useEffect, useId, useRef, useState } from "react";
import CtaButton from "../../components/ui/CtaButton.jsx";
import { submitInquiry } from "../../lib/submitInquiry.js";
import { INITIAL, VALIDATORS } from "./formModel.js";

/** Two-step inquiry form (project, then contact). Values live in one state object, errors are DERIVED from the validators
 *  (shown after blur or a failed Continue), so Back/forward never loses or desyncs anything. */
export default function InquiryForm({ form, endpoint, privacyHref }) {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | error | done
  const [delivered, setDelivered] = useState(false);
  const [announce, setAnnounce] = useState("");
  const headingRef = useRef(null);
  const moved = useRef(false);
  const last = form.steps.length - 1;

  const stepErrors = VALIDATORS[step] ? VALIDATORS[step](values) : {};
  const showError = (name) => (touched[name] || attempted[step]) && stepErrors[name];

  // after a step change (not on first paint) move focus to the step heading so keyboard/AT users land in the right place
  useEffect(() => { if (moved.current) headingRef.current?.focus({ preventScroll: true }); }, [step, status]);

  // the pricing calculator ("Send this estimate") pre-fills the project type, description and budget
  useEffect(() => {
    const onPrefill = (e) => {
      const { projectType, description, budget, estimate } = e.detail || {};
      setValues((v) => ({ ...v, projectType, description, budget, estimate }));
      setTouched({}); setAttempted({}); setStatus("idle"); setStep(1); // project is already described, so start at contact
    };
    window.addEventListener("inquiry:prefill", onPrefill);
    return () => window.removeEventListener("inquiry:prefill", onPrefill);
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));
  const bind = (name) => ({
    id: `${uid}-${name}`, name, value: values[name],
    onChange: (e) => set(name, e.target.value),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    "aria-invalid": showError(name) ? true : undefined,
    "aria-describedby": showError(name) ? `${uid}-${name}-err` : undefined,
  });

  const field = ({ name, label, optional, wide, children }) => (
    <div className={`f ${wide ? "f--wide" : ""}`}>
      <label className="f__label" htmlFor={`${uid}-${name}`}>{label}{optional && <span> (optional)</span>}</label>
      {children}
      {showError(name) && <p className="f__err" id={`${uid}-${name}-err`}><span aria-hidden="true">!</span>{stepErrors[name]}</p>}
    </div>
  );
  const text = ({ name, label, type = "text", optional, auto, wide, ...rest }) => field({ name, label, optional, wide, children: (
      <input className="f__input" type={type} autoComplete={auto} aria-required={!optional || undefined} {...bind(name)} {...rest} />
  ) });
  const select = ({ name, label, options, optional, noEmpty }) => field({ name, label, optional, children: (
      <select className="f__input f__select" aria-required={!optional || undefined} {...bind(name)}>
        {!noEmpty && <option value="">Select…</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
  ) });

  const go = (n) => { moved.current = true; setStep(n); };

  const send = async () => {
    setStatus("submitting"); setAnnounce("Sending your inquiry…");
    try {
      const res = await submitInquiry({ ...values, submittedAt: new Date().toISOString() }, { endpoint });
      moved.current = true; setDelivered(res.delivered); setStatus("done");
      setAnnounce(res.delivered ? form.done.title : form.done.localTitle);
    } catch {
      setStatus("error"); setAnnounce("Your inquiry could not be sent. Please try again.");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    const errs = Object.keys(VALIDATORS[step](values));
    if (errs.length) {
      setAttempted((a) => ({ ...a, [step]: true }));
      setAnnounce(`${errs.length} ${errs.length === 1 ? "field needs" : "fields need"} attention before you continue.`);
      document.getElementById(`${uid}-${errs[0]}`)?.focus();
      return;
    }
    setAnnounce("");
    step < last ? go(step + 1) : send();
  };

  const reset = () => { setValues(INITIAL); setTouched({}); setAttempted({}); setStatus("idle"); setAnnounce(""); moved.current = true; setStep(0); };

  const live = <p className="sr-only" role="status" aria-live="polite">{announce}</p>;

  if (status === "done") {
    return (
      <div className="form" data-autofocus-root>
        {live}
        <div className="form__done">
          <span className="form__tick" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
          <h3 className="form__title" tabIndex={-1} ref={headingRef} data-autofocus>{delivered ? form.done.title : form.done.localTitle}</h3>
          <p className="form__body">{delivered ? form.done.body : form.done.localBody}</p>
          {!delivered && <button type="button" className="form__link" onClick={reset}>Start over</button>}
        </div>
      </div>
    );
  }

  const s = form.steps[step];
  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-title`}>
      {live}
      <p className="form__step">Step {step + 1} of {form.steps.length}</p>
      <h3 className="form__title" id={`${uid}-title`}>{form.title}</h3>

      <ol className="progress" aria-label="Inquiry progress" style={{ "--n": form.steps.length }}>
        {form.steps.map((st, i) => (
          <li key={st.label} className="progress__item" data-state={i < step ? "done" : i === step ? "current" : "todo"} aria-current={i === step ? "step" : undefined}>
            <span className="progress__bar" aria-hidden="true" />
            <span className="progress__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="progress__label">{st.label}<span className="sr-only">{i < step ? " (completed)" : i === step ? " (current step)" : ""}</span></span>
          </li>
        ))}
      </ol>

      {values.estimate && (
        <p className="form__estimate">
          <span>Pricing estimate attached: <b>{values.estimate.match(/Estimated price: ([\d,]+ DZD)/)?.[1]}</b></span>
          <button type="button" className="form__link" onClick={() => set("estimate", "")}>Remove</button>
        </p>
      )}

      <div className="form__panel" key={step}>
        <h4 className="form__heading" tabIndex={-1} ref={headingRef} data-autofocus>{s.heading}</h4>

        {step === 0 && (
          <>
            <fieldset className="choice">
              <legend className="f__label">Project type <span>(optional)</span></legend>
              <div className="choice__row">
                {form.projectTypes.map((o) => (
                  <label key={o} className="chip">
                    <input type="radio" name={`${uid}-type`} value={o} checked={values.projectType === o} onChange={() => set("projectType", o)} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid grid--one">
              {field({ name: "description", label: "What are you building?", wide: true,
                children: <textarea className="f__input f__area" rows={5} aria-required="true" placeholder="Who is it for, and what should it do first?" {...bind("description")} /> })}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid">
              {text({ name: "name", label: "Name", auto: "name" })}
              {text({ name: "email", label: "Email", type: "email", auto: "email", inputMode: "email" })}
              {text({ name: "phone", label: "Phone / WhatsApp", type: "tel", optional: true, auto: "tel", inputMode: "tel" })}
              {select({ name: "budget", label: "Budget", optional: true, options: form.budgets, noEmpty: true })}
            </div>
            <p className="form__note">
              {form.privacyNote}{privacyHref && <> <a href={privacyHref}>Privacy policy</a>.</>}
            </p>
          </>
        )}
      </div>

      {status === "error" && (
        <p className="form__fail" role="alert"><span aria-hidden="true">!</span>Your inquiry couldn't be sent. Check your connection and try again.</p>
      )}

      <div className="form__actions">
        {step > 0 && <button type="button" className="form__back" onClick={() => go(step - 1)} disabled={status === "submitting"}>Back</button>}
        <CtaButton type="submit" variant="dark" className="form__cta" disabled={status === "submitting"}
          label={status === "submitting" ? "Sending…" : step < last ? "Continue" : status === "error" ? "Try again" : "Send project inquiry"} />
      </div>
    </form>
  );
}
