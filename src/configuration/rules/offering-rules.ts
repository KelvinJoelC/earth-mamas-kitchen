import type { BusinessRule } from '@/domain/rules';

export const offeringRules = [
  {
    id: 'small-bouquet-limits-one-flavour',
    kind: 'limits-selection',
    description: 'A seven-cupcake bouquet supports one flavour.',
    scope: { kind: 'product-offering', offeringId: 'floral-cupcake-bouquets' },
    when: {
      kind: 'selection-equals',
      groupId: 'bouquet-size',
      value: 'small-bouquet',
    },
    targetGroupId: 'cupcake-flavours',
    maximumSelections: 1,
  },
  {
    id: 'medium-bouquet-limits-two-flavours',
    kind: 'limits-selection',
    description: 'A twelve-cupcake bouquet supports up to two flavours.',
    scope: { kind: 'product-offering', offeringId: 'floral-cupcake-bouquets' },
    when: {
      kind: 'selection-equals',
      groupId: 'bouquet-size',
      value: 'medium-bouquet',
    },
    targetGroupId: 'cupcake-flavours',
    maximumSelections: 2,
  },
  {
    id: 'large-bouquet-limits-three-flavours',
    kind: 'limits-selection',
    description: 'A nineteen-cupcake bouquet supports up to three flavours.',
    scope: { kind: 'product-offering', offeringId: 'floral-cupcake-bouquets' },
    when: {
      kind: 'selection-equals',
      groupId: 'bouquet-size',
      value: 'large-bouquet',
    },
    targetGroupId: 'cupcake-flavours',
    maximumSelections: 3,
  },
  {
    id: 'small-box-limits-one-flavour',
    kind: 'limits-selection',
    description: 'A six-cupcake box supports one flavour.',
    scope: { kind: 'product-offering', offeringId: 'edible-blooms' },
    when: { kind: 'selection-equals', groupId: 'box-size', value: 'small-box' },
    targetGroupId: 'cupcake-flavours',
    maximumSelections: 1,
  },
  {
    id: 'standard-box-limits-two-flavours',
    kind: 'limits-selection',
    description: 'A twelve-cupcake box supports up to two flavours.',
    scope: { kind: 'product-offering', offeringId: 'edible-blooms' },
    when: {
      kind: 'selection-equals',
      groupId: 'box-size',
      value: 'standard-box',
    },
    targetGroupId: 'cupcake-flavours',
    maximumSelections: 2,
  },
  {
    id: 'party-box-limits-three-flavours',
    kind: 'limits-selection',
    description: 'A twenty-four-cupcake box supports up to three flavours.',
    scope: { kind: 'product-offering', offeringId: 'edible-blooms' },
    when: { kind: 'selection-equals', groupId: 'box-size', value: 'party-box' },
    targetGroupId: 'cupcake-flavours',
    maximumSelections: 3,
  },
  {
    id: 'celebration-box-limits-four-flavours',
    kind: 'limits-selection',
    description: 'A forty-eight-cupcake box supports up to four flavours.',
    scope: { kind: 'product-offering', offeringId: 'edible-blooms' },
    when: {
      kind: 'selection-equals',
      groupId: 'box-size',
      value: 'celebration-box',
    },
    targetGroupId: 'cupcake-flavours',
    maximumSelections: 4,
  },
  {
    id: 'more-than-forty-eight-cupcakes-redirects-to-enquiry',
    kind: 'redirects-to-enquiry',
    description:
      'Orders above 48 cupcakes require an Events & Catering consultation.',
    scope: { kind: 'product-offering', offeringId: 'edible-blooms' },
    when: {
      kind: 'numeric-threshold',
      field: 'cupcake-count',
      operator: 'greater-than',
      value: 48,
    },
    serviceOfferingId: 'events-catering',
  },
  {
    id: 'more-than-two-tiers-redirects-to-enquiry',
    kind: 'redirects-to-enquiry',
    description:
      'Cakes above two tiers require an Events & Catering consultation.',
    scope: { kind: 'product-offering', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'numeric-threshold',
      field: 'tier-count',
      operator: 'greater-than',
      value: 2,
    },
    serviceOfferingId: 'events-catering',
  },
  {
    id: 'more-than-sixty-servings-redirects-to-enquiry',
    kind: 'redirects-to-enquiry',
    description: 'Cakes above approximately 60 servings require consultation.',
    scope: { kind: 'product-offering', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'numeric-threshold',
      field: 'servings',
      operator: 'greater-than',
      value: 60,
    },
    serviceOfferingId: 'events-catering',
  },
  {
    id: 'wedding-scale-redirects-to-enquiry',
    kind: 'redirects-to-enquiry',
    description:
      'Wedding-scale cakes require an Events & Catering consultation.',
    scope: { kind: 'product-offering', offeringId: 'bespoke-cakes' },
    when: { kind: 'request-flag', flag: 'wedding-scale', value: true },
    serviceOfferingId: 'events-catering',
  },
  {
    id: 'large-corporate-order-redirects-to-enquiry',
    kind: 'redirects-to-enquiry',
    description:
      'Large corporate orders require an Events & Catering consultation.',
    scope: { kind: 'product-offering', offeringId: 'bespoke-cakes' },
    when: { kind: 'request-flag', flag: 'large-corporate-order', value: true },
    serviceOfferingId: 'events-catering',
  },
  {
    id: 'venue-delivery-or-setup-redirects-to-enquiry',
    kind: 'redirects-to-enquiry',
    description:
      'Venue delivery or setup requires an Events & Catering consultation.',
    scope: { kind: 'product-offering', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'request-flag',
      flag: 'venue-delivery-or-setup',
      value: true,
    },
    serviceOfferingId: 'events-catering',
  },
  {
    id: 'complex-structural-design-redirects-to-enquiry',
    kind: 'redirects-to-enquiry',
    description:
      'Complex structural designs require an Events & Catering consultation.',
    scope: { kind: 'product-offering', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'request-flag',
      flag: 'complex-structural-design',
      value: true,
    },
    serviceOfferingId: 'events-catering',
  },
] as const satisfies readonly BusinessRule[];
