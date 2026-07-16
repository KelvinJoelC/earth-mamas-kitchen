# Asset Optimization Audit

Date: 2026-07-16

Issue: EMK-020 — Optimize Images, Fonts and Visual Assets

## Scope reviewed

- `public/`
- `src/assets/`
- `src/pages/`
- `src/components/`
- `src/sections/`
- `src/layouts/`
- `src/styles/`
- `src/configuration/`

## Asset inventory

| Asset                                       | Format | Dimensions |   Size | Current use                                            |
| ------------------------------------------- | ------ | ---------: | -----: | ------------------------------------------------------ |
| `public/favicon.png`                        | PNG    |    300×348 | 122 KB | Direct favicon and public logo fallback                |
| `src/assets/images/favicon.png`             | PNG    |    300×348 | 122 KB | Astro-optimized logo in hero/about sections            |
| `public/images/award.webp`                  | WebP   |  1024×1024 | 104 KB | Awards carousel via `AWARDS.id`                        |
| `public/images/cupcake.webp`                | WebP   |  1024×1024 | 119 KB | Edible Blooms presentation and order summary           |
| `public/images/events.webp`                 | WebP   |  1295×1338 | 185 KB | Events & Catering Explore block                        |
| `public/images/flowerCupcakesBouquet2.webp` | WebP   |    783×936 | 130 KB | Floral Cupcake Bouquets presentation and order summary |
| `public/images/cakes/mushroomLogCake.webp`  | WebP   |  1024×1024 | 232 KB | Bespoke Cakes presentation and order summary           |
| `src/assets/cart.svg`                       | SVG    |    viewBox | 0.6 KB | Header cart icon                                       |
| `src/assets/facebook.svg`                   | SVG    |      40×40 | 0.5 KB | Social link icon                                       |
| `src/assets/github.svg`                     | SVG    |    256×250 | 2.1 KB | Footer link icon                                       |
| `src/assets/instagram.svg`                  | SVG    |    256×256 | 2.3 KB | Social link icon                                       |
| `src/assets/linkedin.svg`                   | SVG    |    256×256 | 0.8 KB | Footer link icon                                       |

## Findings

- The favicon/logo exists in both `public/` and `src/assets/`. This is intentional for now:
  - `public/favicon.png` is required for direct browser/favicon access and public fallback paths.
  - `src/assets/images/favicon.png` allows Astro to optimize logo usage in Astro-rendered sections.
- Public product images are used by both Astro pages and browser-rendered cart summaries. They remain in `public/` to preserve existing stable runtime URLs.
- Astro's build optimized only the imported logo asset before EMK-020. Public image URLs are served as static files, so rendered images need explicit dimensions, loading strategy, and decoding hints.
- Several public images were no longer referenced by the source model, pages, styles, or browser scripts.

## Changes made

- Removed unused public raster assets:
  - `public/images/brithdaycake-removebg-preview.png`
  - `public/images/flowerCupcakesBouquet.webp`
  - `public/images/footer.webp`
  - `public/images/cakes/floralCake.webp`
  - `public/images/cakes/mermaidCake.webp`
- Added explicit dimensions and browser hints to rendered images where missing:
  - `width` / `height`
  - `sizes`
  - `loading`
  - `decoding`
  - `fetchpriority` for above-the-fold logo/product hero images
- Preserved View Transition names and existing routes.

## Decisions

- No image format conversions were introduced in this issue. The current used raster catalogue is already WebP except the logo PNG.
- No SVG icons were converted or removed because they are small and intentionally imported as inline components.
- No font package changes were made. The current font dependencies are explicit brand fonts and are imported centrally from `src/styles/global.css`.
- No JavaScript lifecycle or cart logic changed.

## Deferred

- A future image pass could move product images from `public/` into `src/assets/` and expose hashed/optimized URLs to browser scripts through a typed asset registry. That would be a larger architectural change and was intentionally avoided in EMK-020.
