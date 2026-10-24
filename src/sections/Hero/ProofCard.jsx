import CtaButton from "../../components/ui/CtaButton.jsx";

export default function ProofCard({ title, rows, cta, href, priceLink }) {
  return (
    <aside className="proof" aria-labelledby="proof-title">
      <h2 id="proof-title" className="proof__title">{title}</h2>
      {rows.map(([value, label]) => (
        <div className="proof__row" key={value}><strong>{value}</strong><span>{label}</span></div>
      ))}
      <CtaButton variant="dark" className="proof__cta" href={href} label={cta} />
      {priceLink && (
        <a className="proof__price" href={priceLink.href}>
          <span>{priceLink.label}</span><small>{priceLink.note}</small>
          <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
        </a>
      )}
    </aside>
  );
}
