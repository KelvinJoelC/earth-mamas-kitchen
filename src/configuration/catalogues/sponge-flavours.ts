import type { EdibleCatalogueItem } from '@/domain/allergens';
import type { AllergenId } from '@/configuration/catalogues/allergens';

export const spongeFlavourCatalogue = [
  {
    id: 'vanilla',
    label: 'Vanilla',
    availability: 'active',
    allergens: {
      contains: ['wheat', 'gluten', 'milk', 'egg'],
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'chocolate',
    label: 'Chocolate',
    availability: 'active',
    allergens: {
      contains: ['wheat', 'gluten', 'milk', 'egg', 'soy'],
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'chai-spiced-carrot',
    label: 'Chai Spiced Carrot',
    availability: 'active',
    allergens: {
      contains: ['wheat', 'gluten', 'milk', 'egg'],
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'hummingbird',
    label: 'Hummingbird',
    availability: 'active',
    allergens: {
      contains: ['wheat', 'gluten', 'milk', 'egg'],
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'chocolate-vegan',
    label: 'Chocolate Vegan',
    availability: 'active',
    allergens: {
      contains: ['wheat', 'gluten', 'soy'],
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'orange-almond-gluten-friendly',
    label: 'Orange Almond (Gluten Friendly)',
    availability: 'active',
    allergens: {
      contains: ['milk', 'egg', 'almond'],
      basis: 'case-study-assumption',
    },
  },
] as const satisfies readonly EdibleCatalogueItem<string, AllergenId>[];

export type SpongeFlavourId = (typeof spongeFlavourCatalogue)[number]['id'];
