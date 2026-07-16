# SEO Metadata Audit

Date: 2026-07-17

Issue: EMK-018 — Implement Page-Level SEO Metadata

## Site URL source

The production URL is defined once in `astro.config.mjs`:

```text
https://earth-mamas-kitchen.vercel.app
```

`Layout.astro` uses Astro's `site` configuration to generate absolute canonical and social image URLs.

## Route metadata matrix

| Route                                    | Type             | Data source                                       | Title                                        | Description source                | Canonical                                | Social image                          | Indexing        |
| ---------------------------------------- | ---------------- | ------------------------------------------------- | -------------------------------------------- | --------------------------------- | ---------------------------------------- | ------------------------------------- | --------------- |
| `/`                                      | static page      | `homeMetadata`                                    | `Handcrafted Cakes & Edible Gifts in Cairns` | Static approved page metadata     | `/`                                      | `/images/flowerCupcakesBouquet2.webp` | index           |
| `/about`                                 | static page      | `aboutMetadata`                                   | `About`                                      | Static approved page metadata     | `/about`                                 | `/images/flowerCupcakesBouquet2.webp` | index           |
| `/order`                                 | utility page     | `orderMetadata`                                   | `Order Review`                               | Static utility-page metadata      | `/order`                                 | `/images/flowerCupcakesBouquet2.webp` | noindex, follow |
| `/events-catering`                       | Service Offering | `eventsCatering`                                  | `Events & Catering`                          | Service-specific enquiry metadata | `/events-catering`                       | `/images/events.webp`                 | index           |
| `/our-creations/floral-cupcake-bouquets` | Product Offering | `productOfferings` + `EXPLORE` presentation image | `Floral Cupcake Bouquets`                    | `floralCupcakeBouquets.summary`   | `/our-creations/floral-cupcake-bouquets` | `/images/flowerCupcakesBouquet2.webp` | index           |
| `/our-creations/edible-blooms`           | Product Offering | `productOfferings` + `EXPLORE` presentation image | `Edible Blooms`                              | `edibleBlooms.summary`            | `/our-creations/edible-blooms`           | `/images/cupcake.webp`                | index           |
| `/our-creations/bespoke-cakes`           | Product Offering | `productOfferings` + `EXPLORE` presentation image | `Bespoke Cakes`                              | `bespokeCakes.summary`            | `/our-creations/bespoke-cakes`           | `/images/cakes/mushroomLogCake.webp`  | index           |

## Findings before implementation

- The global layout rendered a generic hardcoded title and description for pages that did not pass explicit props.
- Canonical URLs were not rendered.
- Open Graph metadata was not rendered.
- Twitter/social-card metadata was not rendered.
- Favicon pointed to a PNG file while declaring `image/svg+xml`.
- Product Offering pages used canonical offering routes, but metadata was passed as loose `title` and `description` strings instead of a typed metadata contract.
- Events & Catering correctly used `ServiceOffering` data, but social metadata did not yet distinguish it from product pages.
- No `/contact` route exists.
- No custom 404 route exists in `src/pages`.

## Decisions

- `/order` remains internally accessible but is marked `noindex, follow` because it is a customer utility page for saved local cart configurations, not a search landing page.
- Product Offering titles and descriptions are derived from authoritative offering definitions.
- Product Offering social images use existing presentation images from the transitional `EXPLORE` model until that presentation layer is migrated.
- Events & Catering is represented as a Service Offering and custom enquiry pathway, not as a product.
- No sitemap, robots.txt, JSON-LD, Schema.org or breadcrumb metadata was added in EMK-018.
