import { colourPaletteCatalogue } from '@/configuration/catalogues/colour-palettes';
import type { WorkflowDefinition } from '@/domain/workflows';

export const guidedPreorderWorkflow = {
  id: 'guided-preorder',
  type: 'guided-preorder',
  name: 'Guided preorder',
  description:
    'Collects structured choices for a configurable cupcake offering.',
  optionGroups: [
    {
      id: 'colour-palette',
      kind: 'single-select',
      label: 'Colour Palette',
      required: true,
      displayOrder: 30,
      options: colourPaletteCatalogue
        .filter(({ availability }) => availability === 'active')
        .map(({ id, label }) => ({ value: id, label })),
    },
    {
      id: 'custom-colours-description',
      kind: 'text',
      label: 'Custom Colours',
      description:
        'Describe your custom colours. This field is required when "Custom Colours" is selected.',
      required: false,
      displayOrder: 40,
      multiline: false,
      maxLength: 150,
      trim: true,
    },
    {
      id: 'design-notes',
      kind: 'text',
      label: 'Design Notes',
      required: false,
      displayOrder: 70,
      multiline: true,
      maxLength: 300,
      trim: true,
    },
    {
      id: 'dietary-requirements',
      kind: 'text',
      label: 'Dietary Requirements',
      description:
        'Requests are reviewed individually and cannot be guaranteed.',
      required: false,
      displayOrder: 80,
      multiline: true,
      maxLength: 300,
      trim: true,
    },
  ],
} as const satisfies WorkflowDefinition;
