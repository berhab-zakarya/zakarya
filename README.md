# Portfolio

A React portfolio built with Vite.

## Development

```bash
npm install
npm run dev
```

Create a production build and preview it locally:

```bash
npm run build
npm run preview
```

Vite writes the production build to `dist/`.

## Project structure

- `src/content/site.js`: Site copy, content, configuration, and placeholders. Replace placeholders with accurate, verified information.
- `src/styles/tokens.css`: Colours, spacing, fonts, and the z-index scale.
- `src/components/ui/`: Reusable UI components.
- `src/components/layout/`: Shared layout components, including `Section` and `SiteHeader`.
- `src/sections/<Name>/`: One folder per page section. Register sections in `App.jsx`.
- `src/sections/BelowFold.jsx`: Lazy-loaded content below the hero.
- `src/hooks/useReveal.js`: Scroll-based reveal behaviour.
- `src/lib/submitInquiry.js`: Contact form submission logic.
- `src/lib/` and section-specific files: Form state, validation, canvas effects, and supporting utilities.

### Adding a section

Create `src/sections/Foo/Foo.jsx` and its stylesheet. Register the section in `App.jsx`.

Use `<Section id="foo">` or the section's own markup, depending on the layout.

### Layering

Use the `--z-*` variables defined in `tokens.css`. Avoid arbitrary z-index values.

## Deployment

### GitHub Pages

The site is deployed from the `berhab-zakarya/zakarya` repository.

Production build:

```bash
npm run build
```

The generated static files are placed in `dist/`. The GitHub Actions deployment workflow must build the project and publish the contents of this directory.

GitHub Pages settings:

1. Open the repository's **Settings → Pages**.
2. Select **GitHub Actions** as the deployment source if using a workflow-based deployment.
3. Verify the workflow builds the project successfully and uploads `dist/`.

### Vite base path

The `base` setting must match the public URL used to serve the application.

For the GitHub Pages project URL:

`https://berhab-zakarya.github.io/zakarya/`

use:

```js
base: "/zakarya/",
```

For a custom domain serving the site at its root:

`https://zakarya.is-a.dev/`

use:

```js
base: "/",
```

The current `vite.config.js` does not specify `base`, so Vite uses `/` by default. This is appropriate for the custom-domain deployment.

Do not use `/zakarya/` as the base path for a site served from the root of a custom domain.

### Custom domain

A custom domain can point to the existing GitHub Pages deployment. It does not require a different hosting platform.

For an approved `is-a.dev` subdomain:

- Configure the domain registration to point to `berhab-zakarya.github.io`.
- Follow the official registration and domain-verification instructions.
- After the registration is accepted, open the portfolio repository's **Settings → Pages**.
- Add the approved custom domain.
- Enable **Enforce HTTPS** once the certificate is available.

The intended public URL is `https://zakarya.is-a.dev/`, subject to domain availability, approval, and successful DNS configuration.

Official guides:
- [is-a.dev: GitHub Pages](https://docs.is-a.dev/guides/github-pages/)
- [Vite: Static deployment](https://vite.dev/guide/static-deploy)
- [GitHub: Custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

**Eligibility note:** is-a.dev is intended for personal developer websites and non-commercial software-related projects. Commercial service pages, including pricing plans, may be rejected under its current rules. Confirm eligibility before submitting a domain request.

## Performance notes

- The hero loads eagerly to support Largest Contentful Paint (LCP).
- Content below the hero is lazy-loaded through `sections/BelowFold.jsx`. Give future heavy sections their own `lazy()` imports.
- React is split into a separate vendor chunk in `vite.config.js` to improve caching between deployments.
- Outfit is self-hosted through `@fontsource-variable/outfit`; no third-party font request is required.
- Below-the-fold `.section` elements use `content-visibility: auto`.
- The ribbon effect keeps pointer state in refs, avoiding React renders during pointer movement.
- The ribbon field rebuilds only when its width or capped height changes, using a debounced resize handler.
- The animation loop runs through `requestAnimationFrame` only while the pointer is active.
- The ribbon's backing store is capped at approximately five million pixels.
- Avoid adding `memo()` or `useMemo()` without evidence of a performance problem. Measure first.

## Contact and project inquiries

The contact section is located in `src/sections/Contact/`.

Its main pieces include:

- `ContactSection`: Main layout and left column.
- `InquiryForm`: Multi-step inquiry form.
- `formModel.js`: Form state and validation.
- `ContactParticles` and `contactField.js`: Square-particle background effect.
- `ContactLogos`: Contact-section logos.
- `Contact.css`: Contact-specific styles and palette tokens.

### Configuration

The `site.contact` object in `src/content/site.js` controls the copy, logos, testimonial, option lists, `endpoint`, `bookingUrl`, and `privacyHref`.

### Submission behaviour

`src/lib/submitInquiry.js` handles form submission.

An empty `contact.endpoint` enables local mode. No inquiry is sent, and the interface communicates that state.

To receive inquiries, configure a real endpoint that accepts the expected JSON payload and implement the appropriate server-side validation.

The endpoint must be a real, tested service. Do not expose private API credentials in client-side code.

`CtaButton` renders a real `<button>` when no `href` is provided. The `.btn` styles use `--accent`, `--accent-press`, and `--btn-ink`.

When `#contact` is beneath the floating header, `<html data-surface="contact">` re-themes the header CTA through `SiteHeader.css`.

## Work logos and pricing

### Work logos

Logos are stored in `public/logos/` and referenced through `logo` properties in `site.work.items`.

Add `algecom.png` manually when the asset is available. Missing logo files are hidden automatically.

### Pricing configuration

Live pricing is configured in `site.pricing` in `src/content/site.js`, with amounts expressed in DZD.

Configuration includes:

- MVP base prices by project type.
- The MVP, Launch-ready, and Custom plan presets.
- Add-ons.
- Student rates.
- Budget options.

Pricing calculations live in `src/sections/Pricing/estimate.js`.

The flow allows the visitor to choose a project type and plan. Add-ons appear under Custom, pre-filled with the features included in the previously selected plan.

### Pricing basis (DZD, October 2026)

Current configured starting prices:

| Project type | Starting price |
|---|---:|
| SaaS MVP | 180,000 DZD |
| Mobile MVP | 200,000 DZD |
| Marketplace MVP | 280,000 DZD |
| Business system MVP | 300,000 DZD |

Launch-ready plans add design, payments, and an admin dashboard where applicable.

The original pricing rationale references Algiers agency estimates attributed to Kolonell (September 2026) and a mobile MVP estimate attributed to OnyxLab (March 2026). Verify those sources and update the figures before relying on them publicly.

Adjust the `base` and `price` values to reflect the work, scope, and delivery commitments you can support.

## Contact form

The form collects project details and contact information.

Required fields include:

- Project description.
- Name.
- Email.

Optional fields include project type, phone or WhatsApp, and budget. The budget defaults to `Not sure yet`.

Setting `testimonial: null` hides the testimonial block. Only add a testimonial using a verified quote, author, and role.

## Effects

- `hooks/useReveal.js` and `[data-reveal]` provide staggered scroll reveals through the `--d` variable. The effect is disabled for users who prefer reduced motion.
- The plan switch uses a sliding thumb.
- Additional plan options expand with a grid-row transition.
- Work cards use an animated blue underline and logo-colour changes on hover.
- Navigation highlights the section currently in view.

## Palette (October 2026)

The visual system uses:

- Warm paper: `--bg: #efece5`
- Warm black: `--ink: #15130f`
- Primary accent: `--accent: #c8321a`
- Contact-panel accent: `#ff7b55`

The intended distribution is approximately 60% paper, 30% dark surfaces, and 10% accent.

The palette uses warm neutrals and a single vermilion accent to keep the visual identity consistent.

Reported contrast ratios:

| Element | Contrast ratio |
|---|---:|
| Accent on paper | 4.5:1 |
| White on accent button | 5.4:1 |
| Body text | 7.6:1 |
| Dark-panel text | 16:1 |
| Input borders | 3:1 |

These ratios should be rechecked against the actual rendered colours whenever tokens change.

Re-theme the site through `tokens.css` and the `--c-*` block at the top of `Contact.css`.

Particle and ribbon colours are configured in `contactField.js` (`STOPS`) and `ribbonField.js`.

## Copy rules

Keep all new copy specific, accurate, and verifiable.

- Use checkable details such as project names, prices, and demonstrable outcomes.
- Avoid generic claims that could describe any developer.
- Avoid constructions such as "not X, but Y".
- Avoid introductory filler such as "Here's the thing".
- Avoid vague marketing language such as "seamless", "robust", "empower", "elevate", "unlock", and "journey".
- Avoid filler trust words such as "honest", "real", and "passionate".
- Do not use exclamation marks, emoji, or em dashes in portfolio copy.
- Vary sentence length. Use lists of three only when there are genuinely three items.
- Apply bold text and accent colours only when they communicate meaningful information, such as a price or primary call to action.
- Never invent testimonials, client counts, project outcomes, or availability.
- Keep placeholder content hidden until it has been replaced with verified information.