import type { AddOnId } from '@/configuration/catalogues/add-ons';
import { fillingCatalogue } from '@/configuration/catalogues/fillings';
import { frostingCatalogue } from '@/configuration/catalogues/frostings';
import { spongeFlavourCatalogue } from '@/configuration/catalogues/sponge-flavours';
import { addOnCustomerInputs } from '@/configuration/offerings/add-on-inputs';
import type { BusinessRuleId } from '@/configuration/rules/rules';
import { designBriefPreorderWorkflow } from '@/configuration/workflows/design-brief-preorder';
import type { WorkflowId } from '@/configuration/workflows/workflows';
import type { ProductOfferingAddOnConfiguration } from '@/domain/add-ons';
import { audCents } from '@/domain/money';
import type { OptionGroup } from '@/domain/option-groups';
import type { ProductOfferingDefinition } from '@/domain/offerings';

const bespokeCakeSizeOptions = [
  {
    value: '6-inch-round',
    label: '6" Round Cake',
    description: 'Approximately 15â€“20 servings',
    price: audCents(11000),
    attributes: {
      minimumServings: 15,
      maximumServings: 20,
      tierCount: 1,
    },
  },
  {
    value: '8-inch-round',
    label: '8" Round Cake',
    description: 'Approximately 40â€“50 servings',
    price: audCents(17000),
    attributes: {
      minimumServings: 40,
      maximumServings: 50,
      tierCount: 1,
    },
  },
  {
    value: 'two-tier-6-and-8-inch',
    label: '2-Tier Cake (6" + 8")',
    description: 'Approximately 55 servings',
    price: audCents(26000),
    attributes: { approximateServings: 55, tierCount: 2 },
  },
] as const;

export const bespokeCakes = {
  id: 'bespoke-cakes',
  slug: 'bespoke-cakes',
  name: 'Bespoke Cakes',
  summary:
    'Handcrafted celebration cakes configured through a detailed design brief.',
  workflowId: 'design-brief-preorder',
  leadTime: { unit: 'calendar-days', minimum: 5 },
  optionGroups: [
    {
      id: 'cake-size',
      kind: 'priced-single-select',
      label: 'Cake Size',
      required: true,
      displayOrder: 10,
      defaultValue: bespokeCakeSizeOptions[0].value,
      options: bespokeCakeSizeOptions,
    },
    {
      id: 'sponge-flavour',
      kind: 'single-select',
      label: 'Sponge Flavour',
      required: true,
      displayOrder: 20,
      options: spongeFlavourCatalogue.map(({ id, label }) => ({
        value: id,
        label,
      })),
    },
    {
      id: 'filling',
      kind: 'single-select',
      label: 'Filling',
      required: true,
      displayOrder: 30,
      options: fillingCatalogue.map(({ id, label }) => ({ value: id, label })),
    },
    {
      id: 'frosting',
      kind: 'single-select',
      label: 'Frosting',
      required: true,
      displayOrder: 40,
      options: frostingCatalogue.map(({ id, label }) => ({ value: id, label })),
    },
    ...designBriefPreorderWorkflow.optionGroups,
  ],
  addOns: [
    {
      addOnId: 'gift-message',
      displayOrder: 10,
      compatibilityRuleIds: [],
      customerInput: addOnCustomerInputs['gift-message'],
    },
    {
      addOnId: 'personalised-acrylic-topper',
      displayOrder: 20,
      compatibilityRuleIds: [],
      customerInput: addOnCustomerInputs['personalised-acrylic-topper'],
    },
    { addOnId: 'edible-image', displayOrder: 30, compatibilityRuleIds: [] },
    { addOnId: 'chocolate-drip', displayOrder: 40, compatibilityRuleIds: [] },
    { addOnId: 'sugar-flowers', displayOrder: 50, compatibilityRuleIds: [] },
    { addOnId: 'fresh-flowers', displayOrder: 60, compatibilityRuleIds: [] },
    { addOnId: 'macarons', displayOrder: 70, compatibilityRuleIds: [] },
    { addOnId: 'edible-gold-leaf', displayOrder: 80, compatibilityRuleIds: [] },
  ],
  ruleIds: [
    'dietary-request-requires-review',
    'vegan-sponge-auto-selects-vegan-buttercream',
    'vegan-sponge-excludes-incompatible-fillings',
    'vegan-sponge-excludes-standard-buttercream',
    'gluten-friendly-sponge-excludes-incompatible-fillings',
    'vegan-sponge-requires-review',
    'gluten-friendly-sponge-requires-review',
    'more-than-two-tiers-redirects-to-enquiry',
    'more-than-sixty-servings-redirects-to-enquiry',
    'wedding-scale-redirects-to-enquiry',
    'large-corporate-order-redirects-to-enquiry',
    'venue-delivery-or-setup-redirects-to-enquiry',
    'complex-structural-design-redirects-to-enquiry',
  ],
  enquiryThresholds: [
    { kind: 'maximum-tiers', value: 2, serviceOfferingId: 'events-catering' },
    {
      kind: 'maximum-servings',
      value: 60,
      serviceOfferingId: 'events-catering',
    },
    {
      kind: 'request-flag',
      value: 'wedding-scale',
      serviceOfferingId: 'events-catering',
    },
    {
      kind: 'request-flag',
      value: 'large-corporate-order',
      serviceOfferingId: 'events-catering',
    },
    {
      kind: 'request-flag',
      value: 'venue-delivery-or-setup',
      serviceOfferingId: 'events-catering',
    },
    {
      kind: 'request-flag',
      value: 'complex-structural-design',
      serviceOfferingId: 'events-catering',
    },
  ],
} as const satisfies ProductOfferingDefinition<
  'bespoke-cakes',
  WorkflowId,
  OptionGroup,
  ProductOfferingAddOnConfiguration<AddOnId, BusinessRuleId>,
  BusinessRuleId
>;
