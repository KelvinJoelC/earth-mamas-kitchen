# 🍰 Earth Mama's Kitchen

Earth Mama's Kitchen is a professional frontend portfolio case study built around a realistic artisanal bakery business. The original bakery and its visual identity remain useful inspiration, but this repository is no longer presented as an active client engagement or as software currently used by that business.

The project is being developed as a production-minded bakery preorder website using Astro, TypeScript, and Tailwind CSS.

## Project direction

The goal of version 1.0.0 is to deliver a complete and credible customer experience that allows visitors to:

- browse three configurable Product Offerings;
- understand product details, pricing guidance, lead times, and policies;
- configure guided preorders and design briefs;
- add configured offerings to a cart;
- submit preorder requests for bakery review;
- submit custom enquiries for Events & Catering;
- contact the bakery.

This is not a tutorial or a claim of live commercial adoption. It is a realistic case study designed to demonstrate professional frontend engineering, product thinking, maintainable architecture, responsive UX, accessibility, SEO, performance, testing, documentation, and release discipline.

## Product ownership

Kelvin Carreño Espin is the Product Owner and final decision-maker for the project.

External client confirmation is not required. When real business information is unavailable, the project will use reasonable bakery-business assumptions. Material assumptions must be documented, applied consistently, and revisited when they affect user experience, business rules, content, or technical architecture.

The original bakery context remains inspiration rather than a source of ongoing requirements or approval.

## Domain terminology

Version 1 uses the following terms consistently:

- **Product Offering:** a configurable bakery product available through preorder.
  - Floral Cupcake Bouquets
  - Edible Blooms
  - Bespoke Cakes
- **Service Offering:** a consultation-led service rather than a standard configurable product.
  - Events & Catering
- **Option Groups:** reusable configuration concepts such as sizes, flavours, fillings, frostings, colour palettes, add-ons, design briefs, and enquiry fields.
- **Workflow Type:** the customer journey assigned to an offering.
  - `guided-preorder`
  - `design-brief-preorder`
  - `custom-enquiry`

The three Product Offerings are not categories containing multiple separately named products.

## Domain architecture direction

The planned v1 architecture is configuration-driven without attempting to become a database or unrestricted form engine.

Reusable catalogues define shared concepts such as flavours, fillings, frostings, colour palettes, add-ons, dietary adaptations, occasions, and workflow types. Product Offerings reference the catalogue entries they support and provide relationship-specific settings such as selection limits, availability, price adjustments, ordering, and review requirements.

### Add-on ownership model

The Global Add-on Catalogue is the single source of truth for add-on identity. Every global definition contains only:

- stable ID;
- customer-facing name;
- description;
- default price in AUD cents;
- global availability;
- default review requirement.

A Product Offering owns the relationship between itself and a supported add-on. Its configuration references the add-on ID and may define a product-specific price override, availability override, review override, display order, and compatibility rules.

Supported offerings, workflow compatibility, and display order are not duplicated in the global definition. This avoids bidirectional data that can drift out of sync.

The approved v1 Global Add-on Catalogue contains:

- Gift Message
- Personalised Acrylic Topper
- Personalised Ribbon
- Fairy Lights
- Premium Bouquet Wrapping
- Premium Gift Bag
- Premium Cupcake Packaging
- Custom Cupcake Toppers
- Premium Cupcake Decorations
- Edible Image
- Chocolate Drip
- Sugar Flowers
- Fresh Flowers
- Macarons
- Edible Gold Leaf

Business rules use a limited set of typed, declarative operations—for example requirements, exclusions, automatic selections, selection limits, and redirects to custom enquiry. Global policies, workflow rules, offering rules, and compatibility rules remain separate.

For v1, these contracts and catalogues can remain strongly typed TypeScript data. A database or CMS is not required.

## Technology

- **Astro** — static-first application architecture and performance
- **TypeScript** — strong typing and maintainability
- **Tailwind CSS** — responsive styling and shared design foundations
- **Embla Carousel** — focused carousel behavior where justified

## Current status

The repository contains an evolving catalogue, offering-detail routes, configurable preorder forms, a browser-persisted cart, and responsive presentation work.

The current implementation is being upgraded toward the planned v1.0.0 domain model and quality standard. Until that release is complete, some workflows, terminology, and documentation may still be provisional.

See the [GitHub Issues](https://github.com/KelvinJoelC/earth-mamas-kitchen/issues) for the ordered delivery backlog.

## Project structure

```text
public/                 Static public assets
src/
├── assets/             Source-managed visual assets
├── components/         Reusable UI components
├── consts/             Current static catalogue data
├── layouts/            Shared page layouts
├── models/             Current domain types
├── pages/              Astro routes
├── sections/           Page-level content sections
└── styles/             Global and feature styles
```

The architecture and folder boundaries will be refined incrementally through the v1.0.0 backlog.

## Local development

```bash
npm install
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Astro development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | View available Astro commands |

## Live demo

[earth-mamas-kitchen.vercel.app](https://earth-mamas-kitchen.vercel.app)

The deployed site may represent work in progress until v1.0.0 is released.

## Developer

Developed by **Kelvin Carreño Espin**, Frontend Developer and Product Owner.

This repository is intended to show how a realistic business product can be taken from an early implementation to a documented, tested, accessible, and production-quality frontend release.
