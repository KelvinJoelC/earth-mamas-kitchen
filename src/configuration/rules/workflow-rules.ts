import type { BusinessRule } from '@/domain/rules';

export const workflowRules = [
  {
    id: 'custom-colours-requires-description',
    kind: 'requires',
    description: 'Custom Colours requires a written colour description.',
    scope: { kind: 'workflow', workflowId: 'guided-preorder' },
    when: {
      kind: 'selection-equals',
      groupId: 'colour-palette',
      value: 'custom-colours',
    },
    targetGroupId: 'custom-colours-description',
  },
] as const satisfies readonly BusinessRule[];
