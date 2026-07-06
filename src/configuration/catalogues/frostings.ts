import type { EdibleCatalogueItem } from '@/domain/allergens';
import type { AllergenId } from '@/configuration/catalogues/allergens';

export const frostingCatalogue = [
  {
    id: 'buttercream',
    label: 'Buttercream',
    availability: 'active',
    allergens: { contains: ['milk'], basis: 'case-study-assumption' },
  },
  {
    id: 'vegan-buttercream',
    label: 'Vegan Buttercream',
    availability: 'active',
    allergens: { contains: ['soy'], basis: 'case-study-assumption' },
  },
] as const satisfies readonly EdibleCatalogueItem<string, AllergenId>[];

export type FrostingId = (typeof frostingCatalogue)[number]['id'];
