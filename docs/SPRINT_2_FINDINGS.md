# Sprint 2 Findings

## Deprecated Instagram iframe attribute — resolved in EMK-017

- **Issue title:** Replace deprecated Instagram iframe scrolling attribute
- **Severity:** Sprint 2 Polish
- **Affected route:** `/about`
- **Reproduction steps:**
  1. Open `/about`.
  2. Inspect the Instagram iframe markup or run the Astro/browser validation that reports deprecated iframe attributes.
- **Expected behaviour:** Embedded Instagram content should avoid deprecated iframe attributes where possible.
- **Actual behaviour:** Previously, `src/pages/about.astro` used `scrolling="no"` on the Instagram iframe.
- **Resolution:** Resolved in EMK-017 by removing the deprecated attribute and adding a descriptive iframe title while preserving the existing embed.

## EMK-017 Responsive and Cross-Browser Polish

- **Viewport matrix used:** 360px, 390px, 768px, 1024px, 1280px and 1440px.
- **Browser matrix used:** Chrome latest, Firefox latest and Safari/WebKit-compatible CSS assumptions where possible.

### Findings fixed

- **HIGH — Touch targets were too small on some primary actions**
  - **Affected routes:** Product Offering pages, `/order`, `/about`, `/events-catering`, carousel sections.
  - **Fix:** Shared button/icon/form-control foundations now enforce a minimum 44px interactive size. Product preorder action buttons and related-product links were adjusted to preserve touch usability.

- **HIGH — Carousel slide widths could cause horizontal overflow**
  - **Affected routes:** `/about`, `/order`, Product Offering detail pages.
  - **Fix:** Awards carousel slides now use container-relative full-width sizing instead of viewport-width sizing. Related offering carousel cards now use bounded responsive widths.

- **MEDIUM — Long cart summary content could wrap awkwardly or overflow**
  - **Affected route:** `/order`.
  - **Fix:** Cart summary cards now use defensive wrapping, safer grid min-widths and mobile-friendly destructive action layout.

- **MEDIUM — General contact title area could compress on small screens**
  - **Affected route:** `/about`.
  - **Fix:** Contact heading row now wraps safely within a bounded container.

- **MEDIUM — Deprecated Instagram iframe attribute**
  - **Affected route:** `/about`.
  - **Fix:** Removed `scrolling="no"` and added a descriptive iframe title while preserving the existing embed.

### Findings deferred

- **SPRINT 2 NOTE — Content encoding mojibake**
  - **Affected routes:** Multiple pages.
  - **Reason deferred:** Text such as `â€™` and emoji mojibake appears to be an encoding/content issue rather than a responsive or cross-browser layout defect. It should be handled in a dedicated copy/content cleanup issue to avoid mixing concerns.

- **SPRINT 2 NOTE — Aesthetic refinements**
  - **Affected routes:** Multiple pages.
  - **Reason deferred:** Minor spacing preferences and visual redesign opportunities remain outside EMK-017 unless they affect usability, clipping, overflow or supported viewport behaviour.
