import type { ProductList } from "../models/product.model";

export const EXPLORE: ProductList = [
  {
    id: 'Bouquet',
    slug: 'floral-cupcake-bouquets',
    title: 'Floral Cupcake Bouquets',
    description:
      'Flowers you can eat. Edible Blooms. The perfect gift for a special occasion',
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
    notes: 'Ideal para regalos; transporte en vertical. Mejor consumir el mismo día.',
    props: {
      bg: 'linear-gradient(135deg, white 0%, #a0cb5c 20%, #6ca771 50%, #a89bc0 80%, white 100%)',
      h: '350',
      padding: '20px'
    },
    route: '/products/floral-cupcake-bouquets',
    cta: 'Customize bouquet'
  },
  {
    id: 'Cake',
    slug: 'bespoke-cakes',
    title: 'Bespoke cakes',
    description:
      'Earth Mama cakes are born from nature and touched by magic. Inspired by earthy textures, blooming florals, and a sense of quiet enchantment',
    img: '/images/cakes/mushroomLogCake',
    priceFrom: 55,
    tags: ['birthday', 'wedding', 'celebration'],
    leadTimeDays: 4,
    dietary: ['vegetarian'],
    
    options: {
      sizes: [
        { sizeInch: 6, shape: 'Round', servings: 15 },//15 20
        { sizeInch: 8, shape: 'Round', servings: 40 },// 40-50
        { label: '2-tier 6\"+8\"', servings: 55 },
      ],
      sponge: ['Vanilla', 'Chocolate', 'Chai spiced carrot','Hummingbird', 'Chocolate vegan', 'Orange Almond (GF)'],
      fillings: [
        'Raspberry jam',
        'Biscoff',
        'Nutella'
      ],
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
      padding: '0px'

    },
    route: '/products/bespoke-cakes',
    cta: 'Build your cake'
  },
  {
    id: 'EdibleBloom',
    slug: 'edible-blooms',
    title: 'Edible blooms',
    description:
      'Handcrafted edible blooms inspired by nature and enchantment.',
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
      padding: '0px'
    },
    route: '/products/edible-blooms',
    cta: 'Choose arrangement'
  },
  {
    id: 'orderEvent',
    slug: 'special-occasions',
    title: 'Wedding Cakes',
    description:
      'Impress your clients and colleagues with sweet creations designed for professional events. Elegance and flavor in every detail.',
    img: '/images/events',
    priceFrom: 3,
    tags: ['events', 'corporate', 'catering'],
    leadTimeDays: 7,
    dietary: ['vegetarian', 'vegan (by request)', 'gluten-free (by request)'],
    options: {
      formats: [
        'Mini cupcakes',
        'Standard cupcakes',
        'Cake slices',
        'Dessert table',
        'Macaron towers',
        'Corporate-branded cookies'
      ],
      allergens: ['gluten', 'eggs', 'milk', 'nuts', 'soy'],
      branding: ['Edible logo prints', 'Pantone-matched buttercream', 'Ribbon/logo tags'],
      service: ['Pickup', 'Delivery', 'On-site setup (dessert table)'],
      packages: [
        { name: 'Coffee break', serves: 20, includes: '40 mini cupcakes + 20 cookies', approxPrice: 120 },
        { name: 'Launch party', serves: 50, includes: '100 mini cupcakes + macaron tower', approxPrice: 360 }
      ],
      addOns: ['Display stands rental', 'Signage cards', 'Cutlery & napkins']
    },
    logistics: 'Para setup en sitio, acceso 60–90 min antes del evento.',
    props: {
      bg: 'linear-gradient(135deg, white 0%, #bfc8e6 25%, #c7d0dd 50%, #b3bfd8 75%, white 100%)',
      h: '350',
      padding: '20px'
    },
    route: '/products/special-occasions',
    cta: 'Get a quote'
  }
];
