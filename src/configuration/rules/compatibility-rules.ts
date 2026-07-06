import type { BusinessRule } from '@/domain/rules';

export const compatibilityRules = [
  {
    id: 'vegan-sponge-auto-selects-vegan-buttercream',
    kind: 'auto-selects',
    description: 'Chocolate Vegan automatically selects Vegan Buttercream.',
    scope: { kind: 'compatibility', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'selection-equals',
      groupId: 'sponge-flavour',
      value: 'chocolate-vegan',
    },
    targetGroupId: 'frosting',
    value: 'vegan-buttercream',
  },
  {
    id: 'vegan-sponge-excludes-incompatible-fillings',
    kind: 'excludes',
    description: 'Chocolate Vegan only supports Raspberry Jam in v1.',
    scope: { kind: 'compatibility', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'selection-equals',
      groupId: 'sponge-flavour',
      value: 'chocolate-vegan',
    },
    targetGroupId: 'filling',
    values: ['biscoff', 'nutella'],
  },
  {
    id: 'vegan-sponge-excludes-standard-buttercream',
    kind: 'excludes',
    description: 'Chocolate Vegan cannot be paired with standard Buttercream.',
    scope: { kind: 'compatibility', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'selection-equals',
      groupId: 'sponge-flavour',
      value: 'chocolate-vegan',
    },
    targetGroupId: 'frosting',
    values: ['buttercream'],
  },
  {
    id: 'gluten-friendly-sponge-excludes-incompatible-fillings',
    kind: 'excludes',
    description:
      'Orange Almond (Gluten Friendly) only supports Raspberry Jam in v1.',
    scope: { kind: 'compatibility', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'selection-equals',
      groupId: 'sponge-flavour',
      value: 'orange-almond-gluten-friendly',
    },
    targetGroupId: 'filling',
    values: ['biscoff', 'nutella'],
  },
  {
    id: 'vegan-sponge-requires-review',
    kind: 'requires-review',
    description: 'Chocolate Vegan is a dietary adaptation requiring review.',
    scope: { kind: 'compatibility', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'selection-equals',
      groupId: 'sponge-flavour',
      value: 'chocolate-vegan',
    },
    reason: 'Dietary adaptations cannot be guaranteed in the shared kitchen.',
  },
  {
    id: 'gluten-friendly-sponge-requires-review',
    kind: 'requires-review',
    description: 'Orange Almond (Gluten Friendly) requires review.',
    scope: { kind: 'compatibility', offeringId: 'bespoke-cakes' },
    when: {
      kind: 'selection-equals',
      groupId: 'sponge-flavour',
      value: 'orange-almond-gluten-friendly',
    },
    reason:
      'Gluten Friendly is not guaranteed gluten-free in the shared kitchen.',
  },
] as const satisfies readonly BusinessRule[];
