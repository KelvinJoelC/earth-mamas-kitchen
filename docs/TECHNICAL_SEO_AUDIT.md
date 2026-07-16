# EMK-019 Technical SEO and Structured Data Audit

Date: 2026-07-17

## Scope

EMK-019 adds technical SEO discovery files and truthful structured data for the Earth Mama's Kitchen portfolio case study.

The implementation intentionally does not represent the project as an active bakery, LocalBusiness, product catalogue with availability, checkout, booking system, or live commercial service.

## Production site URL

The production site URL remains configured in `astro.config.mjs`:

```txt
https://earth-mamas-kitchen.vercel.app
```

This value is used for canonical URLs, social image URLs, the sitemap and robots policy.

## Sitemap

Generated route: `/sitemap.xml`

The sitemap is generated from canonical route configuration and includes indexable public content routes only:

| Route                                    | Included | Reason                                                                                        |
| ---------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `/`                                      | Yes      | Public homepage                                                                               |
| `/about`                                 | Yes      | Public brand/story/contact page                                                               |
| `/events-catering`                       | Yes      | Public Service Offering enquiry page                                                          |
| `/our-creations/floral-cupcake-bouquets` | Yes      | Canonical Product Offering route                                                              |
| `/our-creations/edible-blooms`           | Yes      | Canonical Product Offering route                                                              |
| `/our-creations/bespoke-cakes`           | Yes      | Canonical Product Offering route                                                              |
| `/order`                                 | No       | Non-content cart/review workflow; page-level `noindex, follow` remains the indexing directive |

No legacy `/products/...` routes are generated. Unknown offering URLs continue to resolve through Astro's standard 404 behaviour.

## Robots policy

Generated route: `/robots.txt`

Policy:

- allows crawling of public content;
- references the generated sitemap;
- does not block `/order`, because blocking it would prevent crawlers from seeing its page-level `noindex, follow` directive.

## Structured data

Structured data is rendered globally as a single JSON-LD `@graph` from `Layout.astro`.

Included schema types:

- `WebSite`
- `CreativeWork`
- `Person`

The `WebSite` node describes the public website as a frontend portfolio case study based on a realistic artisan bakery experience.

The `CreativeWork` node describes the project as a frontend portfolio case study.

The `Person` node attributes the project to Kelvin Carreno as developer/author.

## Explicitly excluded schema

The following schema types and claims are intentionally excluded:

- `Bakery`
- `LocalBusiness`
- `Organization` representing an active bakery operator
- `Product`
- `Offer`
- `AggregateOffer`
- availability claims
- purchase, checkout, booking, delivery or payment claims
- fixed-price Events & Catering claims

This prevents machine-readable metadata from implying that Silvia currently operates the business or that the site accepts active commercial orders.

## Social profiles

Only profiles already visible or approved in the project are included:

- `https://www.instagram.com/earthmamaskitchen`
- `https://www.facebook.com/profile.php?id=100067897911008`
- `https://github.com/KelvinJoelC/earth-mamas-kitchen`
- `https://www.linkedin.com/in/kcarrenoespin`

## Validation performed

- Generated `/sitemap.xml` inspected after `astro build`.
- Generated `/robots.txt` inspected after `astro build`.
- Generated HTML inspected for JSON-LD.
- Verified no generated output contains `Bakery`, `LocalBusiness`, `Product`, `Offer` or availability schema.
- Verified `/order` remains `noindex, follow` and is excluded from the sitemap.
- Verified canonical Product Offering routes remain the only offering routes emitted in the sitemap.

Structured data uses Schema.org vocabulary and is intentionally conservative. It should be revalidated against production content and Product Owner decisions before any future commercial launch.
