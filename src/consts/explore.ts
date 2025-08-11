import type { ProductList } from "../models/product.model";

export const EXPLORE: ProductList = [
  {
    id: 'Bouquet',
    slug: 'floral-cupcake-bouquets',
    title: 'Floral Cupcake Bouquets',
    description:
      'A different kind of bouquet: flower-shaped cupcakes, as beautiful as they are delicious. Perfect for gifting or celebrating with charm.',
    img: '/images/flowerCupcakesBouquet2',
    priceFrom: 35,
    tags: ['gift', 'flowers', 'cupcakes'],
    leadTimeDays: 2,
    dietary: ['vegetarian'],
    options: {
      cupcakeType: ['Vanilla butter sponge', 'Chocolate sponge', 'Lemon', 'Red velvet'],
      buttercreamStyle: ['Roses', 'Peonies', 'Dahlias', 'Mixed garden'],
      quantities: [7, 12, 19, 24],
      colorPalettes: ['Pastel mix', 'Blush & ivory', 'Lilac & sage', 'Bold brights', 'Custom'],
      fillings: ['No filling', 'Raspberry jam', 'Chocolate ganache', 'Lemon curd'],
      presentation: ['Bouquet wrap', 'Hatbox', 'Basket'],
      messageCard: true,
      addOns: [
        'Mini topper “Happy Birthday”',
        'Printed ribbon',
        'Macaron accents (6 pcs)',
        'Sparkle dust finish'
      ],
      allergens: ['gluten', 'eggs', 'milk'],
    },
    notes: 'Ideal para regalos; transporte en vertical. Mejor consumir el mismo día.',
    props: {
      bg: 'linear-gradient(135deg, white 0%, #a0cb5c 20%, #6ca771 50%, #a89bc0 80%, white 100%)'
    },
    route: '/products/floral-cupcake-bouquets',
    cta: 'Customize bouquet'
  },
  {
    id: 'Cake',
    slug: 'bespoke-cakes',
    title: 'Bespoke cakes',
    description:
      'Delicate handmade creations for your most special moments. Unique designs that blend flavor and style.',
    img: '/images/cakes/mushroomLogCake',
    priceFrom: 55,
    tags: ['birthday', 'wedding', 'celebration'],
    leadTimeDays: 4,
    dietary: ['vegetarian'],
    
    options: {
      sizes: [
        { sizeInch: 6, shape: 'Round', servings: 10 },
        { sizeInch: 8, shape: 'Round', servings: 20 },
        { sizeInch: 10, shape: 'Round', servings: 30 },
        { label: '2-tier 6\"+8\"', servings: 35 },
        { label: '3-tier 6\"+8\"+10\"', servings: 60 }
      ],
      sponge: ['Vanilla', 'Chocolate', 'Lemon', 'Carrot walnut', 'Red velvet', 'Pistachio'],
      fillings: [
        'Vanilla bean buttercream',
        'Dark chocolate ganache',
        'Raspberry compote',
        'Salted caramel',
        'Lemon curd',
        'Cream cheese (for carrot/red velvet)'
      ],
      frostings: ['Swiss meringue buttercream', 'Ganache', 'Cream cheese (select sponges)'],
      finishes: [
        'Smooth buttercream',
        'Textured buttercream',
        'Semi-naked',
        'Fondant accents',
        'Painted buttercream',
        'Fresh florals'
      ],
      themes: ['Floral', 'Minimalist', 'Rustic', 'Whimsical', 'Brand colors', 'Custom illustration'],
      inscriptions: true,
      addOns: [
        'Sugar flowers',
        'Macarons (12)',
        'Chocolate drip',
        'Edible gold leaf',
        'Custom acrylic topper',
        'Edible image print'
      ],
      allergens: ['gluten', 'eggs', 'milk', 'soy', 'nuts (on request)'],
    },
    storage: 'Mantener refrigerado si >25°C. Sacar 1 h antes de servir.',
    props: {
      bg: 'linear-gradient(135deg, #fcb0b3, #ffdeaa, #c1d3fe)'
    },
    route: '/products/bespoke-cakes',
    cta: 'Build your cake'
  },
  {
    id: 'EdibleBloom',
    slug: 'edible-blooms',
    title: 'Edible blooms',
    description:
      'Blooms you can eat and enjoy. Sweet bouquets crafted with fine pastry techniques to delight all the senses.',
    img: '/images/cupcake',
    priceFrom: 42,
    tags: ['arrangement', 'gift', 'centerpiece'],
    leadTimeDays: 3,
    dietary: ['vegetarian'],
    options: {
      arrangementType: [
        'Cupcake-only',
        'Mixed treats (cupcakes + macarons)',
        'Cupcakes + cake pops',
        'Cupcakes + cookies'
      ],
      sizes: [
        { label: 'S', pieces: 9 },
        { label: 'M', pieces: 16 },
        { label: 'L', pieces: 25 }
      ],
      allergens: ['gluten', 'eggs', 'milk', 'soy'],
      colorPalettes: ['Pastel garden', 'Sunset tones', 'Green & white', 'Custom'],
      flavorSets: [['Vanilla', 'Chocolate', 'Lemon', 'Strawberry milk', 'Cookies & cream']],
      container: ['Box', 'Basket', 'Hatbox', 'Reusable vase'],
      addOns: ['Message card', 'Ribbon branding', 'Edible shimmer', 'Mini topper'],
      noteOnTransport: 'Se entrega montado; frágil al calor.'
    },
    props: {
      bg: 'linear-gradient(135deg, white 0%, #dba2b1 30%, #d88b6f 70%, white 100%)'
    },
    route: '/products/edible-blooms',
    cta: 'Choose arrangement'
  },
  {
    id: 'orderEvent',
    slug: 'special-occasions',
    title: 'Special occassions',
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
      minimumOrder: {
        miniCupcakes: 24,
        standardCupcakes: 12,
        brandedCookies: 20
      },
      flavorSets: [
        ['Vanilla', 'Chocolate', 'Red velvet'],
        ['Lemon', 'Raspberry', 'Pistachio'],
        ['Custom to brand colors']
      ],
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
      bg: 'linear-gradient(135deg, white 0%, #bfc8e6 25%, #c7d0dd 50%, #b3bfd8 75%, white 100%)'
    },
    route: '/products/special-occasions',
    cta: 'Get a quote'
  }
];
