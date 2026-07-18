# Testing conventions

Earth Mama's Kitchen uses Vitest for focused, fast regression tests around the
configuration-driven frontend.

## Commands

```bash
npm run test
npm run test:e2e
npm run quality
```

`npm run quality` includes formatting checks, linting, Astro/TypeScript
validation, the Vitest suite, and the production build.

`npm run test:e2e` runs the Playwright critical-journey suite against a local
Astro dev server. Install the Chromium browser once before running it locally:

```bash
npx playwright install chromium
```

CI runs `npm run quality` first, then installs Playwright Chromium and runs
`npm run test:e2e` once. Playwright traces, screenshots, videos, and the HTML
report are retained only for failed CI runs.

## Test scope

The v1 automated suite intentionally focuses on high-value contracts:

- Product Offering and Service Offering identifiers, slugs, and route ownership.
- Product Offering configuration integrity.
- Reusable catalogue and business-rule references.
- Selection-limit, compatibility, auto-selection, and enquiry-redirection rules.
- AUD-cent validation.
- Cart state and persistence operations.
- Cart limit, malformed storage, storage failure, and seven-day expiry behavior.
- Generated preorder, Events & Catering, and general enquiry email payloads.

Tests should protect behavior that would be expensive or confusing to discover
manually. Avoid adding tests that merely duplicate implementation details or
lock in visual presentation.

## Browser and E2E testing boundary

Vitest remains the fast Node-based suite for domain, configuration, cart-state,
money, and pure email-content contracts. Playwright is used only for behavior
that must be verified in a rendered browser:

- navigating from the rendered catalogue into canonical Product Offering routes;
- completing representative Product Offering preorder flows;
- verifying visible dynamic validation, compatibility, and cart-limit behavior;
- reviewing, removing, and clearing cart items through the `/order` interface;
- confirming safe recovery from persisted, expired, or corrupt localStorage;
- preparing `mailto:` handoffs without opening an external email client;
- simulating clipboard success and fallback behavior without using the system
  clipboard;
- checking selected mobile journeys at a real viewport.

Do not duplicate every catalogue combination in Playwright. If a rule can be
asserted deterministically through pure data or pure functions, keep it in
Vitest.

## Production services

Tests must not send email, call production services, rely on Vercel, or require
external network access. Mailto and clipboard fallback behavior should be tested
by capturing generated strings only.

## Playwright conventions

E2E files live under `e2e/` and are grouped by customer journey. Shared helpers
belong in `e2e/helpers/` only when they remove real repetition.

Prefer selectors in this order:

1. `getByRole`
2. `getByLabel`
3. visible text that is a stable customer-facing contract
4. `data-testid` only when there is no accessible and stable alternative

Avoid selectors based on Tailwind classes, incidental DOM depth, or visual
position. Do not use `waitForTimeout`; wait for observable UI, URL, request,
dialog, or storage changes instead.

### `mailto:` handoff

Tests capture `mailto:` navigations as Playwright request events, then decode
the subject and body before asserting important content. Tests must never open
or depend on a real email client.

### Clipboard

Tests replace `navigator.clipboard.writeText` with an in-page mock. Success
assertions inspect the captured text, and failure assertions verify the readonly
manual-copy textarea. Tests must not write to the operating-system clipboard.

### localStorage and expiry

Cart persistence tests seed `myapp_cart` before navigation with deterministic
timestamps. Expiry is tested by setting an already-expired `expiresAt`; tests
must not wait for real time to pass.

### Debugging failures

Run the suite locally with:

```bash
npm run test:e2e
```

The Playwright HTML report is written to `playwright-report/`. Traces,
screenshots, and videos are configured for failures only so normal pull-request
runs stay small.

## Ambiguous business behavior

Do not invent unapproved business rules to make tests pass. If an expected
behavior is not defined by the requirements or current implementation, document
the gap instead of encoding it as a test.
