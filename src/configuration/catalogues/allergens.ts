import type { AllergenDefinition, AllergenPolicy } from '@/domain/allergens';

export const allergenCatalogue = [
  { id: 'wheat', label: 'Wheat', availability: 'active', category: 'cereal' },
  { id: 'gluten', label: 'Gluten', availability: 'active', category: 'cereal' },
  { id: 'milk', label: 'Milk', availability: 'active', category: 'dairy' },
  { id: 'egg', label: 'Egg', availability: 'active', category: 'egg' },
  { id: 'soy', label: 'Soy', availability: 'active', category: 'legume' },
  {
    id: 'almond',
    label: 'Almond',
    availability: 'active',
    category: 'tree-nut',
  },
  {
    id: 'hazelnut',
    label: 'Hazelnut',
    availability: 'active',
    category: 'tree-nut',
  },
  { id: 'peanut', label: 'Peanut', availability: 'active', category: 'legume' },
  { id: 'sesame', label: 'Sesame', availability: 'active', category: 'seed' },
  {
    id: 'sulphites',
    label: 'Sulphites',
    availability: 'active',
    category: 'preservative',
  },
] as const satisfies readonly AllergenDefinition[];

export type AllergenId = (typeof allergenCatalogue)[number]['id'];

export const allergenPolicy = {
  crossContaminationWarning:
    'Products are prepared in a shared kitchen where gluten, milk, eggs, soy, peanuts, tree nuts, sesame and other allergens may be present. Dietary requests are reviewed individually, but products cannot be guaranteed to be free from allergens or cross-contamination.',
  assumptionNote:
    'Allergen data is a case-study assumption and must be validated against actual recipes, preparation methods and supplier information before commercial use.',
} as const satisfies AllergenPolicy;
