import type { CatalogueItem } from '@/domain/catalogue';

export const occasionCatalogue = [
  { id: 'birthday', label: 'Birthday', availability: 'active' },
  { id: 'baby-shower', label: 'Baby Shower', availability: 'active' },
  { id: 'gender-reveal', label: 'Gender Reveal', availability: 'active' },
  { id: 'anniversary', label: 'Anniversary', availability: 'active' },
  { id: 'engagement', label: 'Engagement', availability: 'active' },
  { id: 'graduation', label: 'Graduation', availability: 'active' },
  {
    id: 'corporate-celebration',
    label: 'Corporate Celebration',
    availability: 'active',
  },
  { id: 'mothers-day', label: "Mother's Day", availability: 'active' },
  { id: 'thank-you', label: 'Thank You', availability: 'active' },
  { id: 'romantic-gift', label: 'Romantic Gift', availability: 'active' },
  { id: 'congratulations', label: 'Congratulations', availability: 'active' },
  { id: 'just-because', label: 'Just Because', availability: 'active' },
  { id: 'other', label: 'Other', availability: 'active' },
] as const satisfies readonly CatalogueItem[];

export type OccasionId = (typeof occasionCatalogue)[number]['id'];
