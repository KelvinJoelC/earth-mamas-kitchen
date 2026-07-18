# Earth Mama's Kitchen

Earth Mama's Kitchen is a realistic professional portfolio case study inspired by a bakery business.

It models the frontend experience for a boutique bakery that offers handcrafted celebration products, guided preorder requests, and consultation-led event enquiries. The project is not presented as an active client engagement, a live commercial bakery operation, or software officially operated by a business.

## What the project demonstrates

The project is designed to show professional frontend engineering in a realistic product context:

- configuration-driven Product Offering composition;
- reusable catalogues and stable IDs;
- declarative Business Rules;
- typed domain modelling with TypeScript;
- static Astro routing and page metadata;
- accessible forms and keyboard-friendly interactions;
- local cart persistence with expiry;
- manual `mailto:` and clipboard handoff instead of a backend;
- focused Vitest and Playwright coverage;
- CI validation and Vercel deployment.

## Business problem

A custom bakery receives orders that depend on size, flavours, colours, add-ons, allergens, design notes, production lead time, and manual review. A basic contact form is too vague, but a fixed ecommerce checkout would overpromise pricing and availability.

This case study solves that problem by guiding visitors through realistic preorder and enquiry journeys while keeping every request provisional until a human review happens.

The application never claims that an order has been accepted, paid for, booked, or sent to a server.

## Product Owner and assumptions policy

Kelvin Carreno Espin acts as the Product Owner for this portfolio case study.

When a real commercial requirement is unavailable, decisions are made as documented assumptions. Assumptions must be:

1. realistic for a boutique bakery;
2. traceable to documentation or implementation;
3. clearly separated from verified facts;
4. revisited if they affect user experience, Business Rules, pricing, allergens, SEO, privacy, or technical architecture.

Assumptions must not be presented as confirmed client requirements or legally verified operational facts.

## Domain terminology

The v1 catalogue uses the following terms consistently.

### Product Offerings

- Floral Cupcake Bouquets
- Edible Blooms
- Bespoke Cakes

Product Offerings are configurable offerings. They are not product categories.

### Service Offering

- Events & Catering

Events & Catering is a consultation pathway. It is not a Product Offering and is not added to the cart.

### Option Groups

Option Groups describe reusable configuration inputs such as sizes, flavours, fillings, frostings, colour palettes, add-ons, design brief fields, and enquiry fields.

### Workflow Types

- `guided-preorder`
- `design-brief-preorder`
- `custom-enquiry`

## Version 1 journeys

### Product Offering preorder journey

Visitors can:

1. browse the homepage catalogue;
2. open a canonical Product Offering route;
3. configure supported Option Groups;
4. trigger dynamic pricing, validation, allergen summaries, and Business Rules;
5. add a valid configuration to the local cart;
6. review, remove, or clear saved configurations;
7. enter collection/contact details on `/order`;
8. prepare a preorder email using `mailto:`;
9. copy the generated message manually if the email client does not open.

The website stores cart data in `localStorage` for seven days. It does not send preorder data to a backend.

### Events & Catering enquiry journey

Visitors can open `/events-catering`, complete a short custom-enquiry form, and prepare a structured `mailto:` email. The journey starts a conversation only; it does not confirm availability, pricing, booking, payment, delivery, or setup.

### General contact journey

The About page includes a general contact form. It prepares a general-enquiry email and offers a manual copy fallback. It is separate from preorder and Events & Catering journeys.

## Technology stack

- [Astro](https://astro.build/) for static-first page rendering and routing.
- TypeScript for domain and configuration safety.
- Tailwind CSS v4 through `@tailwindcss/vite`.
- Astro Image where source assets are imported by Astro.
- Embla Carousel for carousel behaviour where it is already justified.
- Vitest for fast domain, configuration, cart, money, and email-content tests.
- Playwright for critical rendered customer journeys.
- ESLint, Prettier, Astro check, and GitHub Actions for quality gates.
- Vercel for static deployment.

## Local setup

Requirements:

- Node.js 22, matching CI.
- npm, using the committed `package-lock.json`.

Install dependencies:

```bash
npm ci
```

Start local development:

```bash
npm run dev
```

Install Playwright Chromium once before running E2E tests locally:

```bash
npx playwright install chromium
```

## Scripts

| Command                | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `npm run dev`          | Start the local Astro development server                          |
| `npm run format`       | Format the repository with Prettier                               |
| `npm run format:check` | Check formatting without modifying files                          |
| `npm run lint`         | Run ESLint                                                        |
| `npm run check`        | Run Astro diagnostics and TypeScript validation                   |
| `npm run test`         | Run the Vitest suite                                              |
| `npm run test:e2e`     | Run Playwright critical-journey tests                             |
| `npm run build`        | Create a production build                                         |
| `npm run quality`      | Run format check, lint, Astro check, Vitest, and production build |
| `npm run preview`      | Preview the production build locally                              |

CI runs `npm run quality`, installs Playwright Chromium, and then runs `npm run test:e2e`.

## Routes

Indexable public routes:

- `/`
- `/about`
- `/events-catering`
- `/our-creations/floral-cupcake-bouquets`
- `/our-creations/edible-blooms`
- `/our-creations/bespoke-cakes`

Utility route:

- `/order` is kept as `noindex, follow` because it is a local cart and preorder-review workflow, not a search landing page.

There is no `/contact` route and no `/our-creations` landing route in v1.

## Project structure

```text
src/
├── assets/          Assets imported into Astro/Vite
├── browser/         Browser lifecycle, DOM integration, cart and mailto scripts
├── components/      Reusable Astro components
├── configuration/   Reusable catalogues, Product Offerings, Service Offerings, workflows and rules
├── consts/          Transitional presentation data still used by the homepage catalogue
├── content/         Editorial content such as awards
├── domain/          Framework-independent types and business logic
├── layouts/         Shared Astro layout shell
├── models/          Transitional presentation model types
├── pages/           Astro routes
├── sections/        Page-level content sections
└── styles/          Global styles, tokens and shared CSS foundations
```

See [Application Architecture](docs/ARCHITECTURE.md) for dependency rules, ownership boundaries, and trade-offs.

## Documentation map

- [Business requirements](BUSINESS_REQUIREMENTS.md)
- [Application architecture](docs/ARCHITECTURE.md)
- [Testing conventions](docs/TESTING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Contributing](docs/CONTRIBUTING.md)
- [UI foundations](docs/UI_FOUNDATIONS.md)
- [Accessibility audit](docs/ACCESSIBILITY_AUDIT.md)
- [SEO metadata audit](docs/SEO_METADATA_AUDIT.md)
- [Technical SEO audit](docs/TECHNICAL_SEO_AUDIT.md)
- [Asset optimisation audit](docs/ASSET_OPTIMIZATION_AUDIT.md)
- [Sprint 2 findings](docs/SPRINT_2_FINDINGS.md)

## Deployment

The production URL is currently:

[https://earth-mamas-kitchen.vercel.app](https://earth-mamas-kitchen.vercel.app)

The site is built as a static Astro application and deployed through Vercel. Canonical URLs, sitemap generation, robots policy, and social metadata use the configured production site URL.

See [Deployment](docs/DEPLOYMENT.md) for details.

## Environment variables

The current v1 implementation does not require project-specific environment variables.

Do not add secrets, API keys, email credentials, payment credentials, analytics tokens, or private business details to the repository.

## Limitations

This portfolio case study intentionally does not implement:

- backend submission;
- server-side email delivery;
- database persistence;
- image upload or file storage;
- online payment;
- checkout;
- customer accounts;
- admin dashboards;
- real-time booking or capacity management;
- analytics or advertising tracking.

All pricing, dates, dietary requests, design interpretation, availability, and payment arrangements remain subject to manual review in the generated email workflow.

## Quality and testing notes

The automated suite is intentionally focused:

- Vitest protects domain, configuration, cart-state, money, and email-content contracts.
- Playwright protects high-value rendered customer journeys.
- Tests do not call production services or send emails.

If a branch shows unrelated repository-wide Prettier debt, do not mix broad formatting churn into feature work. Format the files changed by the current story unless the story explicitly owns repository-wide formatting.

## Developer

Developed by Kelvin Carreno Espin as a frontend portfolio case study.

The project is intended to demonstrate how realistic product requirements can be translated into a maintainable, tested, accessible, configuration-driven Astro frontend.
