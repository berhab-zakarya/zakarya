import Section from "../../components/layout/Section.jsx";
import "./Services.css";

export default function Services({ content: c }) {
  return (
    <Section id="services" tone="surface" title="Services" className="services">
      <p className="services__lead" data-reveal>{c.lead}</p>
      <ol className="services__list">
        {c.items.map((s, i) => (
          <li key={s.title} data-reveal style={{ "--d": i }}>
            <span className="services__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="stack" data-reveal>
        <h3 className="stack__title">{c.stackTitle}</h3>
        <div className="stack__cols">
          {c.stack.map((g) => (
            <div key={g.group} className="stack__col">
              <h4>{g.group}</h4>
              <ul>{g.tools.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
