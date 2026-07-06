import type { BusinessRule } from '@/domain/rules';

export const globalRules = [
  {
    id: 'dietary-request-requires-review',
    kind: 'requires-review',
    description: 'Any free-text dietary request requires bakery review.',
    scope: { kind: 'global' },
    when: { kind: 'field-has-value', field: 'dietary-requirements' },
    reason:
      'Ingredient availability and shared-kitchen risks must be assessed.',
  },
] as const satisfies readonly BusinessRule[];
