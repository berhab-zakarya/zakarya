/** Standard page block. Usage: <Section id="work" tone="surface" title="Selected work">…</Section> */
export default function Section({ id, tone = "bg", title, className = "", children }) {
  return (
    <section id={id} className={`section section--${tone} ${className}`} aria-labelledby={title ? `${id}-title` : undefined}>
      <div className="container">
        {title && <h2 id={`${id}-title`} className="section__title">{title}</h2>}
        {children}
      </div>
    </section>
  );
}
