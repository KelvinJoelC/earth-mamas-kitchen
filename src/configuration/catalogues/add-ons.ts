import type { AddOnDefinition } from '@/domain/add-ons';
import { audCents } from '@/domain/money';

export const addOnCatalogue = [
  {
    id: 'gift-message',
    name: 'Gift Message',
    description:
      'A personalised printed card or handwritten note supplied with the order.',
    defaultPrice: audCents(0),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'personalised-acrylic-topper',
    name: 'Personalised Acrylic Topper',
    description:
      'A custom acrylic topper with a name, age, or short celebration message.',
    defaultPrice: audCents(1200),
    availability: 'active',
    requiresReview: true,
  },
  {
    id: 'personalised-ribbon',
    name: 'Personalised Ribbon',
    description:
      'A ribbon personalised with a short name or celebratory message.',
    defaultPrice: audCents(500),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'fairy-lights',
    name: 'Fairy Lights',
    description:
      'Battery-operated decorative lights used to enhance presentation.',
    defaultPrice: audCents(800),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'premium-bouquet-wrapping',
    name: 'Premium Bouquet Wrapping',
    description:
      'Upgraded bouquet wrapping using premium materials and finishes.',
    defaultPrice: audCents(1000),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'premium-gift-bag',
    name: 'Premium Gift Bag',
    description:
      'A reusable gift bag that improves presentation and transport.',
    defaultPrice: audCents(800),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'premium-cupcake-packaging',
    name: 'Premium Cupcake Packaging',
    description: 'An upgraded presentation box for Edible Blooms.',
    defaultPrice: audCents(600),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'custom-cupcake-toppers',
    name: 'Custom Cupcake Toppers',
    description:
      'One coordinated set of personalised toppers for the selected order.',
    defaultPrice: audCents(1500),
    availability: 'active',
    requiresReview: true,
  },
  {
    id: 'premium-cupcake-decorations',
    name: 'Premium Cupcake Decorations',
    description:
      'Premium sprinkles, edible pearls, metallic details, or similar finishes.',
    defaultPrice: audCents(1000),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'edible-image',
    name: 'Edible Image',
    description:
      'A printed edible decoration based on customer-supplied artwork.',
    defaultPrice: audCents(1500),
    availability: 'active',
    requiresReview: true,
  },
  {
    id: 'chocolate-drip',
    name: 'Chocolate Drip',
    description: 'A standard decorative chocolate drip finish.',
    defaultPrice: audCents(800),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'sugar-flowers',
    name: 'Sugar Flowers',
    description: 'A handcrafted set of decorative sugar flowers.',
    defaultPrice: audCents(2500),
    availability: 'active',
    requiresReview: true,
  },
  {
    id: 'fresh-flowers',
    name: 'Fresh Flowers',
    description:
      'Seasonal fresh flowers selected for decorative cake presentation.',
    defaultPrice: audCents(2000),
    availability: 'active',
    requiresReview: true,
  },
  {
    id: 'macarons',
    name: 'Macarons',
    description: 'A predefined quantity of macarons used as cake decoration.',
    defaultPrice: audCents(1800),
    availability: 'active',
    requiresReview: false,
  },
  {
    id: 'edible-gold-leaf',
    name: 'Edible Gold Leaf',
    description:
      'Edible gold leaf applied within a predefined decorative scope.',
    defaultPrice: audCents(1500),
    availability: 'active',
    requiresReview: false,
  },
] as const satisfies readonly AddOnDefinition[];

export type AddOnId = (typeof addOnCatalogue)[number]['id'];
