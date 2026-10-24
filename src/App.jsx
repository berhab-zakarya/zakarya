import { lazy, Suspense } from "react";
import SiteHeader from "./components/layout/SiteHeader.jsx";
import Hero from "./sections/Hero/Hero.jsx";
import { site } from "./content/site.js";

// Hero is eager (it is the LCP). Everything below is split into its own chunk.
const loadBelowFold = () => import("./sections/BelowFold.jsx");
const BelowFold = lazy(loadBelowFold);

// Start fetching the chunk once the hero has painted instead of waiting for React to need it.
if (typeof window !== "undefined") {
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  window.addEventListener("load", () => idle(loadBelowFold), { once: true });
}

export default function App() {
  return (
    <>
      <SiteHeader brand={site.brand} nav={site.nav} cta={site.hero.cta} ctaHref={site.contactHref} />
      <main>
        <Hero content={site.hero} contactHref={site.contactHref} />
        <Suspense fallback={<div className="below-fold-fallback" aria-hidden="true" />}>
          <BelowFold />
        </Suspense>
      </main>
    </>
  );
}
