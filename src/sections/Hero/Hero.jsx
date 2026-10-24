import CtaButton from "../../components/ui/CtaButton.jsx";
import DotRibbon from "./DotRibbon.jsx";
import ProofCard from "./ProofCard.jsx";
import LogoGrid from "./LogoGrid.jsx";
import "./Hero.css";

export default function Hero({ content, contactHref }) {
  const c = content;
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__stage">
        <DotRibbon />
        <div className="container hero__copy">
          <p className="hero__eyebrow">{c.eyebrow} <b>{c.tag}</b></p>
          <h1 id="hero-title" className="hero__title">
            {c.lines.map((line, i) => (
              <span key={i} className="hero__line">
                <span className="hero__line-in" style={{ "--i": i }}>
                  {line.map((p, k) => (typeof p === "string" ? p : <em key={k}>{p.b}</em>))}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero__lead">{c.lead}</p>
          <CtaButton className="hero__cta" href={contactHref} label={c.cta} />
        </div>
      </div>

      <div className="hero__lower">
        <div className="container hero__lower-grid">
          <ProofCard title={c.proofTitle} rows={c.proof} cta={c.cardCta} href={contactHref} priceLink={c.priceLink} />
          <LogoGrid title={c.logosTitle} copy={c.logosCopy} logos={c.logos} />
        </div>
      </div>
    </section>
  );
}