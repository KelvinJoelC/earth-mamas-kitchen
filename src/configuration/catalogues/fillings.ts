import type { EdibleCatalogueItem } from '@/domain/allergens';
import type { AllergenId } from '@/configuration/catalogues/allergens';

export const fillingCatalogue = [
  {
    id: 'raspberry-jam',
    label: 'Raspberry Jam',
    availability: 'active',
    allergens: { contains: [], basis: 'case-study-assumption' },
  },
  {
    id: 'biscoff',
    label: 'Biscoff',
    availability: 'active',
    allergens: {
      contains: ['wheat', 'gluten', 'soy'],
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'nutella',
    label: 'Nutella',
    availability: 'active',
    allergens: {
      contains: ['milk', 'soy', 'hazelnut'],
      basis: 'case-study-assumption',
    },
  },
] as const satisfies readonly EdibleCatalogueItem<string, AllergenId>[];

export type FillingId = (typeof fillingCatalogue)[number]['id'];
