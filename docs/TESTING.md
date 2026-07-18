# Testing conventions

Earth Mama's Kitchen uses Vitest for focused, fast regression tests around the
configuration-driven frontend.

## Commands

```bash
npm run test
npm run quality
```

`npm run quality` includes formatting checks, linting, Astro/TypeScript
validation, the Vitest suite, and the production build.

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

## Browser and component testing boundary

The current test runner uses the Node environment only. This keeps the pull
request suite lightweight and avoids introducing a browser/E2E dependency before
the project needs one.

For now, component-facing behavior is protected through declarative option-group
contracts and pure browser helpers. If future issues require full rendered Astro
component assertions, introduce that capability deliberately in a separate
testing scope.

## Production services

Tests must not send email, call production services, rely on Vercel, or require
external network access. Mailto and clipboard fallback behavior should be tested
by verifying generated strings only.

## Ambiguous business behavior

Do not invent unapproved business rules to make tests pass. If an expected
behavior is not defined by the requirements or current implementation, document
the gap instead of encoding it as a test.
