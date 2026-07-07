import type { ProductList } from '@/models/product.model';
import { bespokeCakes } from '@/configuration/offerings/products/bespoke-cakes';
import { edibleBlooms } from '@/configuration/offerings/products/edible-blooms';
import { floralCupcakeBouquets } from '@/configuration/offerings/products/floral-cupcake-bouquets';

/**
 * Transitional page data. The authoritative offering catalogue is under
 * `src/configuration`; EMK-008 will migrate this presentation consumer.
 */
export const EXPLORE: ProductList = [
  {
    offeringId: floralCupcakeBouquets.id,
    id: 'Bouquet',
    slug: 'floral-cupcake-bouquets',
    title: 'Floral Cupcake Bouquets',
    description:
      'Gift-style cupcake bouquets arranged and wrapped like flowers.',
    img: '/images/flowerCupcakesBouquet2',
    priceFrom: 35,
    tags: ['gift', 'flowers', 'cupcakes'],
    leadTimeDays: 2,
    dietary: ['vegetarian'],
    options: {
      cupcakeType: ['Vanilla sponge', 'Chocolate sponge'],
      // Extra cost
      buttercreamStyle: ['Simple range', 'Deluxe range'],
      quantities: [7],
      // colorPalettes: ['Pastel mix', 'Blush & ivory', 'Lilac & sage', 'Bold brights', 'Custom'],
      // Color in notes
      // fillings: ['No filling', 'Raspberry jam', 'Chocolate ganache', 'Lemon curd'],
      presentation: ['Bouquet wrap'],
      // addOns: [
      //   'Mini topper “Happy Birthday”',
      //   'Printed ribbon',
      //   'Macaron accents (6 pcs)',
      //   'Sparkle dust finish'
      // ],
      // allergens: ['gluten', 'eggs', 'milk'], Add in notes
    },
    notes:
      'Ideal para regalos; transporte en vertical. Mejor consumir el mismo día.',
    props: {
      bg: 'linear-gradient(135deg, white 0%, #a0cb5c 20%, #6ca771 50%, #a89bc0 80%, white 100%)',
      h: '350',
      padding: '20px',
    },
    route: '/products/floral-cupcake-bouquets',
    cta: 'Start Preorder',
  },
  {
    offeringId: bespokeCakes.id,
    id: 'Cake',
    slug: 'bespoke-cakes',
    title: 'Bespoke Cakes',
    description:
      'Custom celebration cakes made to order from your design brief.',
    img: '/images/cakes/mushroomLogCake',
    priceFrom: 55,
    tags: ['birthday', 'wedding', 'celebration'],
    leadTimeDays: 4,
    dietary: ['vegetarian'],

    options: {
      sizes: [
        { sizeInch: 6, shape: 'Round', servings: 15 }, //15 20
        { sizeInch: 8, shape: 'Round', servings: 40 }, // 40-50
        { label: '2-tier 6"+8"', servings: 55 },
      ],
      sponge: [
        'Vanilla',
        'Chocolate',
        'Chai spiced carrot',
        'Hummingbird',
        'Chocolate vegan',
        'Orange Almond (GF)',
      ],
      fillings: ['Raspberry jam', 'Biscoff', 'Nutella'],
      frostings: ['buttercream', 'Vegan buttercream'],
      // finishes: [
      //   'Smooth buttercream',
      //   'Textured buttercream',
      //   'Semi-naked',
      //   'Fondant accents',
      //   'Painted buttercream',
      //   'Fresh florals'
      // ],
      // themes: ['Floral', 'Minimalist', 'Rustic', 'Whimsical', 'Brand colors', 'Custom illustration'],
      // Event, theme color
      //
      // addOns: [
      //   'Sugar flowers',
      //   'Macarons (12)',
      //   'Chocolate drip',
      //   'Edible gold leaf',
      //   'Custom acrylic topper',
      //   'Edible image print'
      // ],
      allergens: ['gluten', 'eggs', 'milk', 'soy', 'nuts (on request)'],
    },
    storage: 'Mantener refrigerado si >25°C. Sacar 1 h antes de servir.',
    props: {
      bg: 'linear-gradient(135deg, #fcb0b3, #ffdeaa, #c1d3fe)',
      h: '350',
      padding: '0px',
    },
    route: '/products/bespoke-cakes',
    cta: 'Start Preorder',
  },
  {
    offeringId: edibleBlooms.id,
    id: 'EdibleBloom',
    slug: 'edible-blooms',
    title: 'Edible Blooms',
    description:
      'Decorated cupcake collections for sharing at celebrations and events.',
    img: '/images/cupcake',
    priceFrom: 42,
    tags: ['arrangement', 'gift', 'centerpiece'],
    leadTimeDays: 3,
    dietary: ['vegetarian'],
    options: {
      // arrangementType: [
      //   'Cupcake-only',
      //   'Mixed treats (cupcakes + macarons)',
      //   'Cupcakes + cake pops',
      //   'Cupcakes + cookies'
      // ],
      // sizes: [   6xn
      //   { label: 'S', pieces: 9 },
      //   { label: 'M', pieces: 16 },
      //   { label: 'L', pieces: 25 }
      // ],
      // ,'Red velvet', 'Chai spiced carrot','Hummingbird'
      allergens: ['gluten', 'eggs', 'milk', 'soy'],
      // colorPalettes: ['Pastel garden', 'Sunset tones', 'Green & white', 'Custom'],
      container: ['Box', 'Basket', 'Hatbox', 'Reusable vase'],
      // addOns: ['Message card', 'Ribbon branding', 'Edible shimmer', 'Mini topper']
    },
    props: {
      bg: 'linear-gradient(135deg, white 0%, #dba2b1 30%, #d88b6f 70%, white 100%)',
      h: '350',
      padding: '0px',
    },
    route: '/products/edible-blooms',
    cta: 'Start Preorder',
  },
];
