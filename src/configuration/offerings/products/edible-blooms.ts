import type { AddOnId } from '@/configuration/catalogues/add-ons';
import { cupcakeFlavourCatalogue } from '@/configuration/catalogues/cupcake-flavours';
import { decorationStyleCatalogue } from '@/configuration/catalogues/decoration-styles';
import { occasionCatalogue } from '@/configuration/catalogues/occasions';
import { addOnCustomerInputs } from '@/configuration/offerings/add-on-inputs';
import type { BusinessRuleId } from '@/configuration/rules/rules';
import { guidedPreorderWorkflow } from '@/configuration/workflows/guided-preorder';
import type { WorkflowId } from '@/configuration/workflows/workflows';
import type { ProductOfferingAddOnConfiguration } from '@/domain/add-ons';
import { audCents } from '@/domain/money';
import type { OptionGroup } from '@/domain/option-groups';
import type { ProductOfferingDefinition } from '@/domain/offerings';

const edibleBloomBoxSizeOptions = [
  {
    value: 'small-box',
    label: 'Small Box',
    description: '6 cupcakes',
    price: audCents(3500),
    attributes: { cupcakeCount: 6 },
  },
  {
    value: 'standard-box',
    label: 'Standard Box',
    description: '12 cupcakes',
    price: audCents(6500),
    attributes: { cupcakeCount: 12 },
  },
  {
    value: 'party-box',
    label: 'Party Box',
    description: '24 cupcakes',
    price: audCents(12000),
    attributes: { cupcakeCount: 24 },
  },
  {
    value: 'celebration-box',
    label: 'Celebration Box',
    description: '48 cupcakes',
    price: audCents(22000),
    attributes: { cupcakeCount: 48 },
  },
] as const;

export const edibleBlooms = {
  id: 'edible-blooms',
  slug: 'edible-blooms',
  name: 'Edible Blooms',
  summary: 'Premium decorated cupcake collections intended for sharing.',
  workflowId: 'guided-preorder',
  leadTime: { unit: 'calendar-days', minimum: 2 },
  optionGroups: [
    {
      id: 'box-size',
      kind: 'priced-single-select',
      label: 'Box Size',
      required: true,
      displayOrder: 10,
      defaultValue: edibleBloomBoxSizeOptions[0].value,
      options: edibleBloomBoxSizeOptions,
    },
    {
      id: 'cupcake-flavours',
      kind: 'multi-select',
      label: 'Cupcake Flavours',
      required: true,
      displayOrder: 20,
      minimumSelections: 1,
      maximumSelections: 4,
      options: cupcakeFlavourCatalogue.map(({ id, label }) => ({
        value: id,
        label,
      })),
    },
    ...guidedPreorderWorkflow.optionGroups,
    {
      id: 'decoration-style',
      kind: 'single-select',
      label: 'Decoration Style',
      required: true,
      displayOrder: 50,
      options: decorationStyleCatalogue.map(({ id, label }) => ({
        value: id,
        label,
      })),
    },
    {
      id: 'occasion',
      kind: 'single-select',
      label: 'Occasion',
      required: false,
      displayOrder: 60,
      options: occasionCatalogue.map(({ id, label }) => ({ value: id, label })),
    },
  ],
  addOns: [
    {
      addOnId: 'gift-message',
      displayOrder: 10,
      compatibilityRuleIds: [],
      customerInput: addOnCustomerInputs['gift-message'],
    },
    {
      addOnId: 'premium-cupcake-packaging',
      displayOrder: 20,
      compatibilityRuleIds: [],
    },
    {
      addOnId: 'custom-cupcake-toppers',
      displayOrder: 30,
      compatibilityRuleIds: [],
      customerInput: addOnCustomerInputs['custom-cupcake-toppers'],
    },
    {
      addOnId: 'premium-cupcake-decorations',
      displayOrder: 40,
      compatibilityRuleIds: [],
    },
  ],
  ruleIds: [
    'dietary-request-requires-review',
    'custom-colours-requires-description',
    'small-box-limits-one-flavour',
    'standard-box-limits-two-flavours',
    'party-box-limits-three-flavours',
    'celebration-box-limits-four-flavours',
    'more-than-forty-eight-cupcakes-redirects-to-enquiry',
  ],
  enquiryThresholds: [
    {
      kind: 'maximum-cupcakes',
      value: 48,
      serviceOfferingId: 'events-catering',
    },
  ],
} as const satisfies ProductOfferingDefinition<
  'edible-blooms',
  WorkflowId,
  OptionGroup,
  ProductOfferingAddOnConfiguration<AddOnId, BusinessRuleId>,
  BusinessRuleId
>;
