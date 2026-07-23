# Deployment and Release Configuration

## Purpose

This document explains how Earth Mama's Kitchen is built, deployed, smoke-tested, redeployed, rolled back and prepared for a future `v1.0.0` release.

Earth Mama's Kitchen is a realistic professional portfolio case study inspired by a bakery business. Deployment must not imply that the website is an active commercial bakery platform, live checkout, booking system, payment processor, backend order-management system or server-side email service.

## Hosting model

The application is a static Astro site deployed to Vercel.

Production URL:

```text
https://earth-mamas-kitchen.vercel.app
```

This is the approved production URL currently configured in `astro.config.mjs`. No approved custom domain is present in the repository.

The configured site URL is used for:

- canonical URLs;
- Open Graph and social metadata;
- sitemap generation;
- robots policy;
- structured data identifiers.

## Build and install configuration

Install dependencies with the committed lockfile:

```bash
npm ci
```

Build the static site:

```bash
npm run build
```

The build outputs static files to:

```text
dist/
```

`dist/` is generated output and is not committed.

CI uses Node.js 22. Local development and release validation should use Node.js 22 where possible to match CI.

## Environment variables

The current v1 implementation does not require project-specific environment variables.

Do not add placeholder variables, `.env` files or fake secrets for v1.

Do not commit:

- API keys;
- email credentials;
- payment credentials;
- analytics tokens;
- private business addresses;
- private customer data;
- deployment secrets.

If future work introduces environment variables, documentation must distinguish:

- public variables safe for browser exposure;
- private/server-only variables;
- whether each variable is required or optional;
- the expected value format;
- where it is configured locally, in GitHub and in Vercel.

Secrets must never use a public/client prefix.

## GitHub Actions

The workflow in `.github/workflows/quality.yml` runs on:

- pull requests targeting `main`;
- pushes to `main`.

The workflow:

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

## Repository and hosting controls

The repository stores:

- Astro static build configuration;
- GitHub Actions workflow configuration;
- Vercel headers and cache configuration in `vercel.json`;
- sitemap and robots generation code;
- documentation for release and rollback procedures.

GitHub UI settings should enforce, where available:

- pull requests before merging to `main`;
- required passing status checks before merge;
- no direct force-push workflow on `main`;
- reviewed changes for release branches.

Vercel UI settings should confirm:

- the project deploys from the GitHub repository;
- `main` is the production branch;
- preview deployments are available for pull requests;
- no unnecessary environment variables are configured;
- production deployment uses the same build command and install behaviour described here.

These UI settings are not fully represented in repository files and must be verified manually before release.

## Security headers

Production security headers are configured in `vercel.json`.

The current policy is based on resources actually used by the site:

- local Astro scripts and generated assets;
- inline JSON-LD and Astro inline scripts;
- inline styles used by Astro components and existing presentation;
- local font files from `@fontsource`;
- local images and safe image data URLs;
- the Instagram embed bridge from `cdn.jsdelivr.net`;
- the Instagram iframe hosted by `app.mirror-app.com`;
- `mailto:` handoff links;
- Clipboard API usage from the same origin.

Configured headers:

- `Content-Security-Policy`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` disabling unused browser capabilities while allowing same-origin clipboard write;
- `Strict-Transport-Security` for HTTPS production delivery;
- immutable cache headers for hashed `/_astro/*` build assets.

### CSP trade-offs

The CSP allows `'unsafe-inline'` for scripts because the current Astro output includes inline scripts such as JSON-LD and Astro/Vite inline execution points. It allows `'unsafe-inline'` for styles because the current UI uses inline style attributes and Astro component styles.

These allowances are documented limitations rather than a target end state. Removing them would require a separate CSP-hardening story that changes how inline scripts/styles are emitted and validated.

The CSP uses `frame-ancestors 'none'` for clickjacking protection instead of adding redundant legacy frame headers.

Do not claim these headers are live in production until a Vercel deployment has been inspected.

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

Structured data represents the project as a portfolio case study. It intentionally excludes `Bakery`, `LocalBusiness`, `Product`, `Offer`, price availability, booking, checkout, delivery and payment schema.

See:

- [SEO metadata audit](SEO_METADATA_AUDIT.md)
- [Technical SEO audit](TECHNICAL_SEO_AUDIT.md)

## Error and fallback behaviour

The site is static. It does not implement server-side error handling.

Unknown routes use the custom Astro 404 page at `src/pages/404.astro`. The page:

- explains that the page was not found;
- links back to the homepage;
- uses normal layout metadata;
- is marked `noindex, follow`;
- does not imply a backend or server failure.

Other production fallbacks:

- malformed Product Offering slugs resolve to Astro/Vercel 404 behaviour;
- malformed or expired cart data is recovered to an empty cart state;
- expired cart data is removed automatically;
- unavailable Clipboard API reveals a readonly manual-copy textarea;
- failed clipboard writes show fallback copy instructions;
- unavailable email clients are handled through the visible manual-copy guidance.

## Production-safe mailto model

The v1 site uses `mailto:` only.

It does not use:

- form endpoints;
- server-side submissions;
- transactional email;
- SMTP credentials;
- databases;
- private submission secrets.

The current public contact target is defined in `src/browser/email-content.js`.

All generated mailto subjects and bodies are URL encoded with `encodeURIComponent`. User-controlled text is placed inside the email body rather than concatenated into the `mailto:` structure directly.

The interface may say that it:

- prepares an email;
- opens the visitor's email application;
- copies a message;
- asks the visitor to send the message manually.

It must not claim that:

- the message was sent;
- the bakery received it;
- a request was submitted;
- an order was accepted;
- a booking was confirmed.

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
- real-time booking confirmation;
- analytics or advertising tracking.

All preorder, enquiry and contact journeys generate content for the visitor to send manually through their own email client.

## Pre-deployment checks

Before merging or promoting a release candidate:

1. Confirm the branch is approved for release review.
2. Confirm the working tree is clean.
3. Confirm the branch is based on the latest `main`.
4. Confirm the production domain remains `https://earth-mamas-kitchen.vercel.app` unless an approved custom domain decision exists.
5. Confirm no project-specific environment variables are required for v1.
6. Confirm no secrets or generated artifacts are staged.
7. Run local validation where practical:

   ```bash
   npm ci
   npm run format:check
   npm run lint
   npm run check
   npm run test
   npm run build
   npx playwright install chromium
   npm run test:e2e
   git diff --check
   ```

8. Confirm GitHub Actions passes on the pull request.
9. Confirm Vercel preview deployment succeeds.
10. Confirm documentation still describes the project as a portfolio case study.

## Deployment flow

For normal production deployment:

1. Merge the approved pull request into `main`.
2. GitHub Actions runs on `main`.
3. Vercel builds and deploys the `main` commit to production.
4. Verify the production deployment URL.
5. Perform the production smoke test below.

Preview deployments are created by Vercel for pull requests when the GitHub integration is enabled. Preview deployments are useful for review, but they are not the production release.

## Production smoke test

After production deployment, verify:

- homepage loads;
- `/about` loads;
- `/events-catering` loads;
- `/order` loads;
- `/our-creations/floral-cupcake-bouquets` loads;
- `/our-creations/edible-blooms` loads;
- `/our-creations/bespoke-cakes` loads;
- an unknown route displays the custom 404 page;
- cart persists through refresh;
- malformed or expired cart data recovers safely;
- preorder email draft is prepared;
- Events & Catering email draft is prepared;
- general-contact email draft is prepared;
- copy-to-clipboard success path works;
- manual-copy fallback is usable when clipboard is unavailable;
- no journey claims a message was delivered, received, submitted, accepted or confirmed;
- `/sitemap.xml` is available;
- `/robots.txt` is available and points to the production sitemap;
- `/order` remains `noindex, follow`;
- security headers are present in live responses;
- Vercel serves hashed `/_astro/*` assets with immutable cache headers.

## Redeployment

To redeploy the same approved commit:

1. Open the Vercel project dashboard.
2. Locate the successful deployment for the approved commit.
3. Use Vercel's redeploy action for that deployment.
4. Confirm the redeployed build completes successfully.
5. Repeat the production smoke test.

Do not create a new source commit merely to redeploy unchanged source.

## Rollback

If production has a blocking defect:

1. Identify the last known good production deployment in Vercel.
2. Promote or redeploy that deployment through Vercel if an immediate rollback is required.
3. Record the rollback deployment and affected commit.
4. Open a new fix or revert pull request in GitHub.
5. Avoid force-pushing or rewriting `main`.
6. Run the required CI checks.
7. Merge the reviewed fix or revert.
8. Repeat the production smoke test.

If the issue is documentation-only or non-blocking, prefer a normal corrective pull request rather than an emergency rollback.

## `v1.0.0` release tag procedure

Do not create the `v1.0.0` tag until the release-owning issue approves it.

Recommended procedure:

1. Merge all approved v1 work into `main`.
2. Confirm required GitHub Actions checks pass on `main`.
3. Confirm Vercel production deployment succeeds.
4. Perform the production smoke test.
5. Confirm release notes accurately describe the portfolio case study.
6. Identify the approved release commit SHA on `main`.
7. Create an annotated semantic-version tag:

   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0 <approved-commit-sha> -m "Release v1.0.0"
   ```

8. Push the tag:

   ```bash
   git push origin v1.0.0
   ```

9. Create the GitHub release from the `v1.0.0` tag.
10. Verify the release page and production deployment.
11. Record rollback information, including the previous known-good deployment.

The actual v1 release remains owned by the release story and must not be performed during deployment-hardening work.
