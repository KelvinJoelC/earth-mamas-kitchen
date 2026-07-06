import type { CatalogueItem } from '@/domain/catalogue';

export const colourPaletteCatalogue = [
  { id: 'soft-pastels', label: 'Soft Pastels', availability: 'active' },
  { id: 'pink-and-white', label: 'Pink & White', availability: 'active' },
  { id: 'blue-tones', label: 'Blue Tones', availability: 'active' },
  { id: 'neutral', label: 'Neutral', availability: 'active' },
  {
    id: 'bright-and-colourful',
    label: 'Bright & Colourful',
    availability: 'active',
  },
  {
    id: 'custom-colours',
    label: 'Custom Colours',
    description: 'Describe a preferred colour combination.',
    availability: 'active',
  },
  { id: 'autumn-colours', label: 'Autumn Colours', availability: 'inactive' },
  {
    id: 'christmas-colours',
    label: 'Christmas Colours',
    availability: 'inactive',
  },
] as const satisfies readonly CatalogueItem[];

export type ColourPaletteId = (typeof colourPaletteCatalogue)[number]['id'];
