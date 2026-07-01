# 🍰 Earth Mama's Kitchen

Earth Mama's Kitchen is a professional frontend portfolio case study built around a realistic artisanal bakery business. The original bakery and its visual identity remain useful inspiration, but this repository is no longer presented as an active client engagement or as software currently used by that business.

The project is being developed as a production-minded bakery preorder website using Astro, TypeScript, and Tailwind CSS.

## Project direction

The goal of version 1.0.0 is to deliver a complete and credible customer experience that allows visitors to:

- browse the bakery's products;
- view product details;
- configure cakes and other bakery products;
- add configured products to a cart;
- submit preorder requests;
- contact the bakery.

This is not a tutorial or a claim of live commercial adoption. It is a realistic case study designed to demonstrate professional frontend engineering, product thinking, maintainable architecture, responsive UX, accessibility, SEO, performance, testing, documentation, and release discipline.

## Product ownership

Kelvin Carreño Espin is the Product Owner and final decision-maker for the project.

External client confirmation is not required. When real business information is unavailable, the project will use reasonable bakery-business assumptions. Material assumptions must be documented, applied consistently, and revisited when they affect user experience, business rules, content, or technical architecture.

The original bakery context remains inspiration rather than a source of ongoing requirements or approval.

## Technology

- **Astro** — static-first application architecture and performance
- **TypeScript** — strong typing and maintainability
- **Tailwind CSS** — responsive styling and shared design foundations
- **Embla Carousel** — focused carousel behavior where justified

## Current status

The repository contains an evolving product catalogue, product-detail routes, configurable preorder forms, a browser-persisted cart, and responsive presentation work.

The current implementation is being upgraded toward the planned v1.0.0 quality standard. Until that release is complete, some workflows and documentation may still be provisional.

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

The architecture and folder boundaries will continue to be refined incrementally through the v1.0.0 backlog.

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
