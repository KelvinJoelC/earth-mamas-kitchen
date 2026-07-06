import type { EdibleCatalogueItem } from '@/domain/allergens';
import type { AllergenId } from '@/configuration/catalogues/allergens';

const commonCupcakeAllergens = ['wheat', 'gluten', 'milk', 'egg'] as const;

export const cupcakeFlavourCatalogue = [
  {
    id: 'vanilla',
    label: 'Vanilla',
    availability: 'active',
    allergens: {
      contains: commonCupcakeAllergens,
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'chocolate',
    label: 'Chocolate',
    availability: 'active',
    allergens: {
      contains: [...commonCupcakeAllergens, 'soy'],
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'red-velvet',
    label: 'Red Velvet',
    availability: 'active',
    allergens: {
      contains: commonCupcakeAllergens,
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'lemon',
    label: 'Lemon',
    availability: 'active',
    allergens: {
      contains: commonCupcakeAllergens,
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'cookies-and-cream',
    label: 'Cookies & Cream',
    availability: 'active',
    allergens: {
      contains: [...commonCupcakeAllergens, 'soy'],
      basis: 'case-study-assumption',
    },
  },
  {
    id: 'salted-caramel',
    label: 'Salted Caramel',
    availability: 'active',
    allergens: {
      contains: commonCupcakeAllergens,
      basis: 'case-study-assumption',
    },
  },
] as const satisfies readonly EdibleCatalogueItem<string, AllergenId>[];

export type CupcakeFlavourId = (typeof cupcakeFlavourCatalogue)[number]['id'];
