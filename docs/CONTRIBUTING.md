# Contributing

## Purpose

This guide defines how to work on Earth Mama's Kitchen without weakening the project as a professional portfolio case study.

The project values focused changes, accurate documentation, stable terminology, and evidence-backed validation.

## Case-study honesty

All contributions must preserve the approved framing:

> Earth Mama's Kitchen is a realistic professional portfolio case study inspired by a bakery business.

Do not describe the project as:

- an active client engagement;
- a live bakery operation;
- software officially operated by a business;
- an ecommerce checkout;
- a backend order-management platform.

## Branch naming

Use standard branch prefixes:

- `feature/...` for implementation stories;
- `fix/...` for defects;
- `docs/...` for documentation-only work;
- `chore/...` for maintenance;
- `refactor/...` for behaviour-preserving code structure changes.

Example:

```text
feature/emk-024-professional-documentation
```

Do not use assistant-specific branch prefixes.

## Scope discipline

Each story should have one clear purpose.

Avoid mixing:

- business-rule changes with visual polish;
- documentation cleanup with unrelated refactors;
- formatting churn with feature work;
- architecture changes with user-facing redesign;
- production behaviour changes with test-only work.

If repository-wide formatting or cleanup is needed, it should be its own story.

## Terminology

Use these terms consistently:

- Product Offering;
- Service Offering;
- Option Group;
- Workflow Type;
- reusable catalogues;
- Product Offering composition;
- declarative Business Rules;
- configuration-driven architecture;
- assumptions policy;
- preorder journey;
- enquiry journey.

The Product Offerings are:

- Floral Cupcake Bouquets;
- Edible Blooms;
- Bespoke Cakes.

The Service Offering is:

- Events & Catering.

Do not describe Product Offerings as categories. Do not describe Events & Catering as a Product Offering.

## Domain and configuration rules

Reusable catalogue values should be defined once and referenced by stable IDs.

Product Offerings should compose approved catalogue entries and own relationship-specific behaviour such as display order, selection limits, add-on overrides, and compatibility.

Business Rules should remain declarative and use the approved rule kinds:

- `requires`;
- `excludes`;
- `auto-selects`;
- `limits-selection`;
- `redirects-to-enquiry`;
- `requires-review`.

Do not duplicate catalogue values in Astro markup, browser scripts, tests, or documentation unless the duplication is clearly explanatory and kept in sync with source configuration.

## Documentation expectations

Update documentation when a change affects:

- Product Offerings;
- Service Offering behaviour;
- Option Groups;
- Workflow Types;
- Business Rules;
- pricing assumptions;
- allergen assumptions;
- SEO/indexing behaviour;
- accessibility decisions;
- testing conventions;
- deployment behaviour;
- environment variables;
- user-facing limitations.

Documentation must not invent capabilities that are not implemented.

## Validation

Use the narrowest validation that proves the change, then run the broader gate before opening or updating a pull request when practical.

Common commands:

```bash
npm run format:check
npm run lint
npm run check
npm run test
npm run build
npm run quality
npm run test:e2e
```

Playwright requires Chromium locally:

```bash
npx playwright install chromium
```

If `npm run quality` fails due to unrelated repository-wide Prettier debt on a branch, do not silently reformat the repository inside an unrelated story. Verify touched files and document the baseline debt.

## Pull request expectations

A pull request should include:

- clear objective;
- summary of changes;
- files or areas changed;
- validation performed;
- known warnings or deferred work;
- screenshots only when visual changes need review;
- documentation updates when behaviour or architecture changes.

PRs should avoid unrelated generated files such as:

- `dist/`;
- `.astro/`;
- `playwright-report/`;
- `test-results/`;
- local environment files.

## Commit messages

Use concise conventional-style messages where possible:

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `test: ...`
- `chore: ...`
- `refactor: ...`

The message should describe the change, not the tool that made it.

## Accessibility and user experience

Preserve:

- semantic controls;
- visible focus;
- keyboard access;
- label and error associations;
- reduced-motion behaviour;
- clear manual-send guidance for `mailto:` flows.

Do not introduce hover-only controls, false success language, hidden focusable inputs, or claims that an email has been sent.

## Security and privacy

Do not commit secrets, credentials, private customer data, private addresses, analytics IDs, or payment configuration.

The current v1 implementation does not require project-specific environment variables and does not have a backend that receives personal information.
