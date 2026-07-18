# Deployment

## Purpose

This document explains how Earth Mama's Kitchen is built and deployed as a realistic professional portfolio case study.

The deployment must not imply that the website is an active commercial bakery platform, live checkout, booking system, payment processor, or backend order-management system.

## Hosting model

The application is a static Astro site deployed to Vercel.

Production URL:

```text
https://earth-mamas-kitchen.vercel.app
```

This URL is configured in `astro.config.mjs` and is used for:

- canonical URLs;
- Open Graph and social metadata;
- sitemap generation;
- robots policy;
- structured data identifiers.

## Build command

The production build command is:

```bash
npm run build
```

The build outputs static files to:

```text
dist/
```

`dist/` is generated output and is not committed.

## Install command

Use npm with the committed lockfile:

```bash
npm ci
```

The project does not use pnpm or Yarn.

## Runtime requirements

CI uses Node.js 22.

Local development should use Node.js 22 where possible to match CI and deployment behaviour.

## Environment variables

The current v1 implementation does not require project-specific environment variables.

Do not commit:

- API keys;
- email credentials;
- payment credentials;
- analytics tokens;
- private business addresses;
- private customer data;
- deployment secrets.

If future work introduces environment variables, the documentation must define whether each variable is required or optional, the expected format, and where it is configured.

## GitHub Actions

The workflow in `.github/workflows/quality.yml` runs on:

- pull requests targeting `main`;
- pushes to `main`.

The workflow currently:

1. checks out the repository;
2. sets up Node.js 22;
3. installs dependencies with `npm ci`;
4. runs `npm run quality`;
5. installs Playwright Chromium;
6. runs `npm run test:e2e`;
7. uploads Playwright diagnostics only on failure.

`npm run quality` includes:

- Prettier format check;
- ESLint;
- Astro check;
- Vitest;
- production build.

Playwright E2E tests run as a separate CI step after the main quality command.

## SEO and indexing behaviour

The site generates:

- `/sitemap.xml`;
- `/robots.txt`;
- page-level metadata;
- conservative JSON-LD structured data.

Indexable public routes are:

- `/`;
- `/about`;
- `/events-catering`;
- `/our-creations/floral-cupcake-bouquets`;
- `/our-creations/edible-blooms`;
- `/our-creations/bespoke-cakes`.

The `/order` route is intentionally excluded from the sitemap and uses `noindex, follow` because it is a local cart and preorder-review utility page.

Structured data represents the project as a portfolio case study. It intentionally excludes `Bakery`, `LocalBusiness`, `Product`, `Offer`, price availability, booking, checkout, delivery, and payment schema.

See:

- [SEO metadata audit](SEO_METADATA_AUDIT.md)
- [Technical SEO audit](TECHNICAL_SEO_AUDIT.md)

## Deployment limitations

The deployed site does not provide:

- server-side form submission;
- SMTP or transactional email;
- online payment;
- checkout;
- account management;
- admin tools;
- remote database persistence;
- image upload or file storage;
- real-time booking confirmation.

All preorder, enquiry, and contact journeys generate content for the visitor to send manually through their own email client.

## Deployment checklist

Before treating a build as release-ready:

1. Run `npm ci`.
2. Run `npm run quality`.
3. Install Playwright Chromium if needed: `npx playwright install chromium`.
4. Run `npm run test:e2e`.
5. Run `npm run build`.
6. Confirm no generated artifacts such as `dist/`, `playwright-report/`, or `test-results/` are committed.
7. Confirm metadata and documentation still describe the site as a portfolio case study.
