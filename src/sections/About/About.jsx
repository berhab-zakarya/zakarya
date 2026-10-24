import Section from "../../components/layout/Section.jsx";
import "./About.css";

export default function About({ content: c }) {
  return (
    <Section id="about" tone="surface" title={c.title} className="about">
      <div className="about__grid">
        <div className="about__text" data-reveal>
          {c.text.map((t) => <p key={t}>{t}</p>)}
        </div>
        <div className="about__steps">
          <h3 className="about__steps-title" data-reveal>{c.stepsTitle}</h3>
          <ol>
            {c.steps.map(([title, text], i) => (
              <li key={title} data-reveal style={{ "--d": i + 1 }}>
                <span className="about__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
