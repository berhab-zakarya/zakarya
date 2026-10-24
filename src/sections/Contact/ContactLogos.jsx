/** Placeholder text wordmarks, driven by site.contact.logos. To use real logos, render an <img>/<svg> inside each <li>.
 *  Styles w1..w4 give the row its editorial variety (see Hero.css for the shared weights). */
export default function ContactLogos({ title, logos }) {
  return (
    <div className="c-logos">
      <h3 className="c-logos__title">{title}</h3>
      <ul className="c-logos__row">
        {logos.map(([name, style]) => <li key={name} className={`c-logo ${style}`}>{name}</li>)}
      </ul>
    </div>
  );
}
