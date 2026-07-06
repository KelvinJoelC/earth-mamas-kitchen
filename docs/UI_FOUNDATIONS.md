# Shared UI Foundations

## Purpose

Earth Mama's Kitchen uses a small CSS foundation for repeated controls and
surfaces. It consolidates existing visual decisions without creating a full
design system or changing the bakery's established brand identity.

## Ownership

- `src/styles/tokens.css` owns semantic aliases for existing colours,
  typography, spacing, radii, shadows, focus colours, and transition timing.
- `src/styles/components.css` owns small composable classes that have a
  demonstrated repeated use case.
- `src/styles/global.css` remains the single import entrypoint.
- Feature-specific layout and one-off presentation stay local to their Astro
  component, usually as Tailwind utilities.

## Shared foundations

- `.ui-button` supplies common interaction and accessibility states.
- `.ui-button--primary` represents the repeated blue form action.
- `.form-label`, `.form-control`, and `.form-control--soft` cover the two
  existing form-control treatments.
- `.form-message` with help or error modifiers provides consistent supporting
  text when a form genuinely needs it.
- `.surface-card` represents the repeated white, rounded preorder surface.
- `.social-links-surface` and `.ui-icon-link` cover repeated icon-link groups.

Modifiers are composed with their base class. They are not standalone styles.

## Decision rule

> Do not introduce an abstraction without a demonstrated repeated use case.

Use a shared foundation when the same visual and interaction contract appears
in multiple locations. Keep styles local when they express a feature's unique
layout, imagery, animation, or presentation. A similar colour alone is not a
reason to create or extend a shared class.

New tokens must represent an existing visual decision or an approved design
change. Avoid purely visual names such as `purple-button` or `large-card`;
prefer names that communicate role and intent.
