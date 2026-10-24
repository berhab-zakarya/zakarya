import { useEffect, useRef, useState } from "react";
import Section from "../../components/layout/Section.jsx";
import CtaButton from "../../components/ui/CtaButton.jsx";
import { addonsFor, budgetFor, computeEstimate, fmt, planPicks, planSubtotal, summarize } from "./estimate.js";
import "./Pricing.css";

/** Eases a displayed number toward `target` so price changes feel live. Respects reduced motion. */
function useAnimatedNumber(target, ms = 380) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { from.current = target; setShown(target); return; }
    const start = performance.now(), a = from.current;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      const v = Math.round(a + (target - a) * (1 - Math.pow(1 - t, 3)));
      from.current = v; setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return shown;
}

export default function Pricing({ content: c }) {
  const [typeId, setTypeId] = useState(c.types[0].id);
  const [planId, setPlanId] = useState(c.plans[0].id);
  const [custom, setCustom] = useState([]);
  const [student, setStudent] = useState(false);

  const picked = planPicks(c, typeId, planId, custom);
  const est = computeEstimate(c, typeId, picked, student);
  const plan = c.plans.find((p) => p.id === planId);
  const planIndex = c.plans.indexOf(plan);
  const price = useAnimatedNumber(est.total);
  const addons = addonsFor(c, typeId);
  const customOpen = plan.addons === null;

  const pickType = (id) => {
    setTypeId(id);
    setCustom((p) => p.filter((a) => addonsFor(c, id).some((x) => x.id === a)));
  };
  // switching to "Custom" starts from whatever the previous plan included, so nothing is lost
  const pickPlan = (id) => { if (id === "custom" && !customOpen) setCustom(picked); setPlanId(id); };
  const toggle = (id) => setCustom((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // hand the estimate to the contact form; the "#contact" link itself does the scrolling
  const sendEstimate = () => {
    window.dispatchEvent(new CustomEvent("inquiry:prefill", {
      detail: {
        projectType: est.type.formType,
        description: `${est.type.name}, ${plan.name}${est.addons.length ? `: ${est.addons.map((a) => a.name.toLowerCase()).join(", ")}` : ""}.`,
        budget: budgetFor(c, est.total),
        estimate: summarize(est, plan.name),
      },
    }));
  };

  return (
    <Section id="pricing" title={c.title} className="pricing">
      <p className="pricing__lead" data-reveal>{c.lead}</p>

      <div className="est" data-reveal>
        <div className="est__options">
          <fieldset className="est__group">
            <legend><span aria-hidden="true">1</span>What are you building?</legend>
            <div className="est__types">
              {c.types.map((t) => (
                <label key={t.id} className="est__type" data-on={t.id === typeId}>
                  <input type="radio" name="est-type" value={t.id} checked={t.id === typeId} onChange={() => pickType(t.id)} />
                  <strong>{t.name}</strong>
                  <span>{t.desc}</span>
                  <em>MVP from {fmt(t.base)}</em>
                </label>
              ))}
            </div>
            <p className="est__includes"><b>MVP includes:</b> {est.type.includes.join(" · ")}</p>
          </fieldset>

          <fieldset className="est__group">
            <legend><span aria-hidden="true">2</span>How complete should it be?</legend>
            <div className="seg" style={{ "--i": planIndex, "--n": c.plans.length }}>
              {c.plans.map((p) => (
                <label key={p.id} className="seg__opt" data-on={p.id === planId}>
                  <input type="radio" name="est-plan" value={p.id} checked={p.id === planId} onChange={() => pickPlan(p.id)} />
                  <strong>{p.name}</strong>
                  <small>{p.addons === null ? "Choose extras" : `${fmt(planSubtotal(c, typeId, p))} DZD`}</small>
                </label>
              ))}
            </div>
            <p className="est__plandesc">{plan.desc}</p>

            <div className="est__extras" data-open={customOpen}>
              <div className="est__addons">
                {addons.map((a) => (
                  <label key={a.id} className="est__addon" data-on={custom.includes(a.id)}>
                    <input type="checkbox" checked={custom.includes(a.id)} onChange={() => toggle(a.id)} tabIndex={customOpen ? 0 : -1} />
                    <span className="est__box" aria-hidden="true" />
                    <span className="est__addon-text"><strong>{a.name}</strong><small>{a.desc}</small></span>
                    <em>+{fmt(a.price)}</em>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          <p className="est__else">{c.elseLabel} <a href="#contact">{c.elseCta}</a></p>
        </div>

        <aside className="est__sum" aria-label="Your estimate">
          <p className="est__label">YOUR ESTIMATE</p>
          <p className="est__price">
            <span className="est__num">{fmt(price)}</span> <span className="est__cur">DZD</span>
          </p>
          {est.student && (
            <p className="est__saving"><s>{fmt(est.subtotal)} DZD</s> <b>−{fmt(est.discount)} student discount</b></p>
          )}
          <dl className="est__facts">
            <div className="est__more"><dt>Typical range</dt><dd>{fmt(est.low)} – {fmt(est.high)}</dd></div>
            <div><dt>Timeline</dt><dd>≈ {est.weeksMin}–{est.weeksMax} weeks</dd></div>
          </dl>

          <ul className="est__lines est__more">
            <li><span>{est.type.name} MVP</span><span>{fmt(est.type.base)}</span></li>
            {est.addons.map((a) => <li key={a.id}><span>{a.name}</span><span>+{fmt(a.price)}</span></li>)}
          </ul>

          <label className="est__student" data-on={student}>
            <input type="checkbox" checked={student} onChange={(e) => setStudent(e.target.checked)} />
            <span className="est__box" aria-hidden="true" />
            <span>{c.studentLabel}: −{Math.round(c.studentRate * 100)}% <small className="est__more">{c.studentNote}</small></span>
          </label>

          <CtaButton variant="dark" className="est__cta" href="#contact" label={c.ctaLabel} onClick={sendEstimate} />
          <p className="est__note est__more">{c.disclaimer}</p>
          <p className="sr-only" role="status" aria-live="polite">
            Estimate: {fmt(est.total)} DZD, about {est.weeksMin} to {est.weeksMax} weeks.{est.student ? " Student discount applied." : ""}
          </p>
        </aside>
      </div>
    </Section>
  );
}
