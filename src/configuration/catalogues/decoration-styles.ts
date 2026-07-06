import type { CatalogueItem } from '@/domain/catalogue';

export const decorationStyleCatalogue = [
  {
    id: 'simple-buttercream',
    label: 'Simple Buttercream',
    availability: 'active',
  },
  {
    id: 'floral-buttercream',
    label: 'Floral Buttercream',
    availability: 'active',
  },
  { id: 'sprinkles', label: 'Sprinkles', availability: 'active' },
  { id: 'elegant', label: 'Elegant', availability: 'active' },
  {
    id: 'mixed-decorations',
    label: 'Mixed Decorations',
    availability: 'active',
  },
] as const satisfies readonly CatalogueItem[];

export type DecorationStyleId = (typeof decorationStyleCatalogue)[number]['id'];
