import ArrowIcon from "./ArrowIcon.jsx";
import "./CtaButton.css";

/** Blue label + separate white arrow square. variant: "light" (on light bg) | "dark" (inside a dark card).
 *  With `href` it renders a link; without it, ONE real <button> (type/onClick/disabled), so label + arrow are a single control. */
export default function CtaButton({ href, label, variant = "light", className = "", type = "button", disabled = false, onClick }) {
  const inner = (
    <>
      <span className="btn__label">{label}</span>
      <span className="btn__arrow"><ArrowIcon /></span>
    </>
  );
  const cls = `btn btn--${variant} ${className}`;
  if (href) return <a className={cls} href={href} onClick={onClick}>{inner}</a>;
  return <button className={cls} type={type} disabled={disabled} onClick={onClick}>{inner}</button>;
}
