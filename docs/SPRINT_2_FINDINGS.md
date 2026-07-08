# Sprint 2 Findings

## Deprecated Instagram iframe attribute

- **Issue title:** Replace deprecated Instagram iframe scrolling attribute
- **Severity:** Sprint 2 Polish
- **Affected route:** `/about`
- **Reproduction steps:**
  1. Open `/about`.
  2. Inspect the Instagram iframe markup or run the Astro/browser validation that reports deprecated iframe attributes.
- **Expected behaviour:** Embedded Instagram content should avoid deprecated iframe attributes where possible.
- **Actual behaviour:** `src/pages/about.astro` uses `scrolling="no"` on the Instagram iframe.
- **Suggested follow-up:** Replace the deprecated iframe attribute with a CSS-based overflow approach if the embedded provider still renders correctly without the attribute.
