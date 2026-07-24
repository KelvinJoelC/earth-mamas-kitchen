import { occasionCatalogue } from '@/configuration/catalogues/occasions';
import type { WorkflowDefinition } from '@/domain/workflows';

export const designBriefPreorderWorkflow = {
  id: 'design-brief-preorder',
  type: 'design-brief-preorder',
  name: 'Design brief preorder',
  description:
    'Collects a structured cake configuration and a written design brief.',
  optionGroups: [
    {
      id: 'occasion',
      kind: 'single-select',
      label: 'Occasion',
      required: true,
      displayOrder: 40,
      options: occasionCatalogue.map(({ id, label }) => ({
        value: id,
        label,
      })),
    },
    {
      id: 'design-description',
      kind: 'text',
      label: 'Design Description',
      required: true,
      displayOrder: 50,
      multiline: true,
      maxLength: 600,
      trim: true,
    },
    {
      id: 'cake-message',
      kind: 'text',
      label: 'Cake Message',
      required: false,
      displayOrder: 60,
      multiline: false,
      maxLength: 50,
      trim: true,
    },
    {
      id: 'elements-to-avoid',
      kind: 'text',
      label: 'Elements to Avoid',
      required: false,
      displayOrder: 70,
      multiline: true,
      maxLength: 250,
      trim: true,
    },
    {
      id: 'dietary-requirements',
      kind: 'text',
      label: 'Dietary Requirements',
      required: false,
      displayOrder: 80,
      multiline: true,
      maxLength: 300,
      trim: true,
    },
  ],
} as const satisfies WorkflowDefinition;
