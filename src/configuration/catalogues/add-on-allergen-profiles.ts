import type { AllergenProfile } from '@/domain/allergens';
import type { AllergenId } from '@/configuration/catalogues/allergens';
import type { AddOnId } from '@/configuration/catalogues/add-ons';

type EdibleAddOnId = Extract<
  AddOnId,
  | 'premium-cupcake-decorations'
  | 'edible-image'
  | 'chocolate-drip'
  | 'sugar-flowers'
  | 'macarons'
  | 'edible-gold-leaf'
>;

export const addOnAllergenProfiles = {
  'premium-cupcake-decorations': {
    contains: ['soy'],
    basis: 'case-study-assumption',
  },
  'edible-image': { contains: ['soy'], basis: 'case-study-assumption' },
  'chocolate-drip': {
    contains: ['milk', 'soy'],
    basis: 'case-study-assumption',
  },
  'sugar-flowers': { contains: ['egg'], basis: 'case-study-assumption' },
  macarons: { contains: ['egg', 'almond'], basis: 'case-study-assumption' },
  'edible-gold-leaf': { contains: [], basis: 'case-study-assumption' },
} as const satisfies Readonly<
  Record<EdibleAddOnId, AllergenProfile<AllergenId>>
>;
