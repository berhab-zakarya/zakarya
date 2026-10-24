import About from "./About/About.jsx";
import useReveal from "../hooks/useReveal.js";
import Work from "./Work/Work.jsx";
import Services from "./Services/Services.jsx";
import Pricing from "./Pricing/Pricing.jsx";
import ContactSection from "./Contact/ContactSection.jsx";
import { site } from "../content/site.js";

/* Everything under the hero lives in this lazily loaded chunk so the first paint only ships the hero.
   When these sections get real content, give each its own folder and its own lazy() import. */
export default function BelowFold() {
  useReveal();
  return (
    <>
      <Work content={site.work} />
      <Services content={site.services} />
      <Pricing content={site.pricing} />
      <About content={site.about} />
      <ContactSection content={site.contact} />
    </>
  );
}
