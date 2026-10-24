/** Text wordmarks as placeholders. To use real logos, replace each <li> text with an <img>/<svg>. */
export default function LogoGrid({ title, copy, logos }) {
  return (
    <div className="logos">
      <h3 className="logos__title">{title}</h3>
      <p className="logos__copy">{copy}</p>
      <ul className="logos__grid">
        {logos.map(([name, style]) => <li key={name} className={style}>{name}</li>)}
      </ul>
    </div>
  );
}
