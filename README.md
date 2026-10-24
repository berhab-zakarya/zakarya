# Portfolio

    npm install
    npm run dev

- `src/content/site.js`: all copy and placeholders (replace with real, verified info)
- `src/styles/tokens.css`: colours, spacing, fonts and the z-index scale
- `src/components/ui|layout`: reusable pieces (CtaButton, Section, SiteHeader)
- `src/sections/<Name>/`: one folder per page section; register it in `App.jsx`
- Hero ribbon: `ribbonField.js` (pure field + painter) and `DotRibbon.jsx` (canvas + pointer interaction)

Adding a section: create `src/sections/Foo/Foo.jsx` (+ `.css`), then use `<Section id="foo">` or your own markup in `App.jsx`.
Layering: use the `--z-*` variables from tokens.css, never raw numbers.

## Performance notes
- Hero is eager (LCP); everything below it is a lazy chunk (`sections/BelowFold.jsx`). Give heavy future sections their own `lazy()` import.
- React is a separate vendor chunk (`vite.config.js`) so it stays cached across deploys.
- Outfit is self-hosted via `@fontsource-variable/outfit` (no third-party request; only needed unicode subsets download).
- Below-the-fold `.section` uses `content-visibility: auto`.
- Ribbon: pointer state lives in refs (no React renders), the field rebuilds only when width / capped height change (debounced),
  the rAF loop runs only while the pointer is active, and the backing store is capped at ~5M pixels.
- Don't wrap things in `memo`/`useMemo` by default: App has no state, so nothing re-renders. Measure first.

## Contact / project inquiry (`#contact`)
- `src/sections/Contact/`: `ContactSection` (layout, left column), `InquiryForm` (3-step form), `formModel.js` (state + validators),
  `ContactParticles` + `contactField.js` (square-particle background), `ContactLogos`, `Contact.css` (palette tokens at the top, scoped to `.contact`).
- Content/config: `site.contact` in `src/content/site.js` (copy, logos, testimonial, option lists, `endpoint`, `bookingUrl`, `privacyHref`).
- Submission: `src/lib/submitInquiry.js`. `contact.endpoint` empty = local mode (nothing is sent, and the UI says so). Set it to POST JSON to a real endpoint.
- `CtaButton` now renders a real `<button>` when no `href` is given. `.btn` reads `--accent`, `--accent-press`, `--btn-ink`.
- While `#contact` is under the floating header, `<html data-surface="contact">` re-themes the header CTA (see `SiteHeader.css`).

## Work logos & pricing
- Logos live in `public/logos/` and are referenced by `logo:` in `site.work.items`. **Add `algecom.png` there by hand** (missing files are hidden automatically).
- Live pricing (`#pricing`): everything is in `site.pricing` (DZD): MVP base price per type, the `plans` presets (MVP / Launch-ready / Custom), add-ons, student rate and budget buckets. Maths is in `sections/Pricing/estimate.js`.
- Flow: pick a type, pick a plan. Add-ons only appear under "Custom", pre-filled with what the previous plan included.

## Pricing basis (DZD, Oct 2026)
MVP starts at 180,000 DZD (SaaS), 200,000 (mobile), 280,000 (marketplace), 300,000 (business system). Launch-ready adds design, payments and an admin dashboard where they apply.
Reference points: Algiers agencies quote 1.5M–5M DZD for a custom web MVP (2.5M+ for a clean custom foundation) per Kolonell, Sept 2026; OnyxLab (Mar 2026) put an experienced freelancer's mobile MVP around 200k DZD. These prices sit well under agency level on purpose. Adjust `base` / `price` values to what you can actually deliver at.

## Contact form
Two steps (project, contact). Required: description, name, email. Optional: project type, phone/WhatsApp, budget (defaults to "Not sure yet").
`testimonial: null` hides the quote block; add `{ quote, author, role }` when you have a real one.

## Effects
- `hooks/useReveal.js` + `[data-reveal]` (stagger with `--d`): sections fade in once on scroll; disabled with reduced motion.
- Plan switch has a sliding thumb, extras expand with a grid-rows transition, work cards get a blue underline wipe and logo colour on hover, nav highlights the section in view.

## Palette (Oct 2026)
Warm paper (`--bg #efece5`), warm black (`--ink #15130f`) and ONE accent, vermilion (`--accent #c8321a`; softened to `#ff7b55` on the dark contact panel). Roughly 60% paper, 30% black/surface, 10% accent.
Why: blue-to-purple gradients, glowing orbs and neon-on-black are the default look of AI-generated sites, and "generic tech blue" and orange-teal are listed with them. Warm neutrals plus a single unexpected accent read as deliberate.
Contrast checked: accent on paper 4.5:1, white on the accent button 5.4:1, body text 7.6:1, dark panel text 16:1, input borders 3:1.
Re-theme by editing `tokens.css` and the `--c-*` block at the top of `Contact.css`. Particle/ribbon colours live in `contactField.js` (STOPS) and `ribbonField.js`.

## Copy rules (keep new text honest and specific)
- Say what is true and checkable: a number, a project name, a price. If a sentence would fit any developer's site, cut or rewrite it.
- No "not X, but Y" constructions, no setup lines ("Here's the thing"), no "seamless / robust / empower / elevate / unlock / journey".
- No filler trust words ("honest", "real", "passionate"). No exclamation marks, no emoji, no em dashes.
- Vary sentence length. Lists of three only when there really are three things.
- Bold and accent colour only where it carries meaning (a price, a call to action).
- Don't invent testimonials, client counts or availability. Placeholders stay hidden until real.
