# Accessibility Audit

Date: 2026-07-08

Issue: EMK-015 - Complete Semantic HTML and Form Accessibility Audit

Target baseline: WCAG 2.2 AA where applicable for a static Astro portfolio case study.

## Routes audited

- `/`
- `/about`
- `/events-catering`
- `/order`
- `/our-creations/floral-cupcake-bouquets`
- `/our-creations/edible-blooms`
- `/our-creations/bespoke-cakes`
- Unknown route / Astro 404 behaviour

## Forms audited

- Product Offering preorder forms
- Cart/order email handoff form
- Events & Catering enquiry form
- General contact form

## Automated tools used

No dedicated accessibility scanner such as axe, pa11y or Lighthouse CI is currently installed in the project.

Validation was performed with the existing project quality gate:

- `npm run format`
- `npm run quality`

## Manual checks performed

- Landmark structure and main content access
- Heading hierarchy on primary routes
- Keyboard access through header links, cart controls and forms
- Visible focus states for links, buttons and form controls
- Accessible names for icon-only links
- Programmatic labels for form fields
- Association between form controls, helper text and error/status messages
- Required field communication
- Live-region usage for cart, price, allergen and email handoff feedback
- Decorative and meaningful image alt text
- Unknown route behaviour

## Findings fixed

### HIGH — Missing skip link for keyboard users

- Affected area: Global layout
- Fix: Added a skip link that targets the main content landmark.
- Files: `src/layouts/Layout.astro`, `src/styles/components.css`

### HIGH — Cart link accessible name did not include current cart state

- Affected area: Header cart badge
- Fix: The cart link now receives a dynamic accessible name that includes the saved preorder configuration count.
- Files: `src/sections/Header.astro`

### HIGH — Icon-only social links lacked accessible names in some contexts

- Affected routes: `/about`, `/order`
- Fix: Added descriptive `aria-label` values to Instagram and Facebook icon links in the contact and order contexts.
- Files: `src/sections/Contact.astro`, `src/pages/order.astro`

### HIGH — Order handoff fields relied on placeholders instead of programmatic labels

- Affected route: `/order`
- Fix: Added screen-reader labels for full name, Australian mobile number and collection preference fields. Associated the fields with the preorder email status region for validation feedback.
- Files: `src/pages/order.astro`

### HIGH — Product Offering option groups did not consistently expose helper and validation text to assistive technology

- Affected routes:
  - `/our-creations/floral-cupcake-bouquets`
  - `/our-creations/edible-blooms`
  - `/our-creations/bespoke-cakes`
- Fix: Added stable label, description and validation message associations for rendered option groups. Multi-select groups now expose group semantics and checkbox controls reference the relevant instructions.
- Files: `src/components/PreOrderFeaturesSelector.astro`

### HIGH — Preorder notes label was not connected to its textarea

- Affected routes:
  - `/our-creations/floral-cupcake-bouquets`
  - `/our-creations/edible-blooms`
  - `/our-creations/bespoke-cakes`
- Fix: Added an explicit `id`/`for` association.
- Files: `src/pages/our-creations/[slug].astro`

### SPRINT 2 POLISH — Heading order on the order route included brand text before the page heading

- Affected route: `/order`
- Fix: Converted decorative brand/tagline headings to paragraph text while preserving their visual styling.
- Files: `src/pages/order.astro`

## Findings deferred

### SPRINT 2 POLISH — Instagram iframe uses deprecated `scrolling="no"`

- Affected route: `/about`
- Reason deferred: Already tracked in `docs/SPRINT_2_FINDINGS.md`. It is a non-blocking markup polish item and not part of the core form/accessibility fixes in EMK-015.

## Known limitations

- No automated accessibility scanner is currently part of the repository. Adding lightweight accessibility checks can be considered later if the project introduces browser-based test tooling.
- Allergen and business policy wording is treated as portfolio case-study content and still requires real operational/legal validation before commercial use.
