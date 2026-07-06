import type { AddOnCustomerInput } from '@/domain/add-ons';
import type { AddOnId } from '@/configuration/catalogues/add-ons';

export const addOnCustomerInputs = {
  'gift-message': {
    kind: 'multi-line-text',
    label: 'Gift Message',
    required: true,
    maxLength: 250,
    trim: true,
    allowEmoji: true,
  },
  'personalised-acrylic-topper': {
    kind: 'single-line-text',
    label: 'Topper Text',
    required: true,
    maxLength: 50,
    trim: true,
    allowEmoji: false,
  },
  'personalised-ribbon': {
    kind: 'single-line-text',
    label: 'Ribbon Text',
    required: true,
    maxLength: 30,
    trim: true,
    allowEmoji: false,
  },
  'custom-cupcake-toppers': {
    kind: 'single-line-text',
    label: 'Topper Personalisation',
    required: true,
    maxLength: 100,
    trim: true,
    allowEmoji: false,
  },
} as const satisfies Partial<Record<AddOnId, AddOnCustomerInput>>;
