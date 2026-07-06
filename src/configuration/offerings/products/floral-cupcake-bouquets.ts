import { cupcakeFlavourCatalogue } from '@/configuration/catalogues/cupcake-flavours';
import type { AddOnId } from '@/configuration/catalogues/add-ons';
import { addOnCustomerInputs } from '@/configuration/offerings/add-on-inputs';
import type { BusinessRuleId } from '@/configuration/rules/rules';
import { guidedPreorderWorkflow } from '@/configuration/workflows/guided-preorder';
import type { WorkflowId } from '@/configuration/workflows/workflows';
import type { ProductOfferingAddOnConfiguration } from '@/domain/add-ons';
import type { ProductOfferingDefinition } from '@/domain/offerings';
import { audCents } from '@/domain/money';
import type { OptionGroup } from '@/domain/option-groups';

export const floralCupcakeBouquets = {
  id: 'floral-cupcake-bouquets',
  slug: 'floral-cupcake-bouquets',
  name: 'Floral Cupcake Bouquets',
  summary:
    'Premium cupcake gifts arranged and wrapped to resemble floral bouquets.',
  workflowId: 'guided-preorder',
  leadTime: { unit: 'calendar-days', minimum: 3 },
  optionGroups: [
    {
      id: 'bouquet-size',
      kind: 'priced-single-select',
      label: 'Bouquet Size',
      required: true,
      displayOrder: 10,
      options: [
        {
          value: 'small-bouquet',
          label: 'Small Bouquet',
          description: '7 cupcakes',
          price: audCents(6500),
          attributes: { cupcakeCount: 7 },
        },
        {
          value: 'medium-bouquet',
          label: 'Medium Bouquet',
          description: '12 cupcakes',
          price: audCents(9500),
          attributes: { cupcakeCount: 12 },
        },
        {
          value: 'large-bouquet',
          label: 'Large Bouquet',
          description: '19 cupcakes',
          price: audCents(14500),
          attributes: { cupcakeCount: 19 },
        },
      ],
    },
    {
      id: 'cupcake-flavours',
      kind: 'multi-select',
      label: 'Cupcake Flavours',
      required: true,
      displayOrder: 20,
      minimumSelections: 1,
      maximumSelections: 3,
      options: cupcakeFlavourCatalogue.map(({ id, label }) => ({
        value: id,
        label,
      })),
    },
    ...guidedPreorderWorkflow.optionGroups,
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
    {
      addOnId: 'personalised-ribbon',
      displayOrder: 30,
      compatibilityRuleIds: [],
      customerInput: addOnCustomerInputs['personalised-ribbon'],
    },
    { addOnId: 'fairy-lights', displayOrder: 40, compatibilityRuleIds: [] },
    {
      addOnId: 'premium-bouquet-wrapping',
      displayOrder: 50,
      compatibilityRuleIds: [],
    },
    { addOnId: 'premium-gift-bag', displayOrder: 60, compatibilityRuleIds: [] },
  ],
  ruleIds: [
    'dietary-request-requires-review',
    'custom-colours-requires-description',
    'small-bouquet-limits-one-flavour',
    'medium-bouquet-limits-two-flavours',
    'large-bouquet-limits-three-flavours',
  ],
  enquiryThresholds: [],
} as const satisfies ProductOfferingDefinition<
  'floral-cupcake-bouquets',
  WorkflowId,
  OptionGroup,
  ProductOfferingAddOnConfiguration<AddOnId, BusinessRuleId>,
  BusinessRuleId
>;
