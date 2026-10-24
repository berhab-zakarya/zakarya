import Section from "../../components/layout/Section.jsx";
import ArrowIcon from "../../components/ui/ArrowIcon.jsx";
import "./Work.css";

export default function Work({ content: c }) {
  return (
    <Section id="work" title="Selected work" className="work">
      <p className="work__lead" data-reveal>{c.lead}</p>
      <ul className="work__grid">
        {c.items.map((p, i) => (
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
    </Section>
  );
}
