export interface ProductOptionSize {
  sizeInch?: number;
  shape?: string | 'Heart' | 'Round' | 'Square' | 'Rectangle';
  servings?: number;
  label?: string; 
  pieces?: number;
}

export interface ProductPackage {
  name: string;
  serves: number;
  includes: string;
  approxPrice: number;
}

export interface ProductOptions {
  cupcakeType?: string[];
  buttercreamStyle?: string[];
  quantities?: number[];
  colorPalettes?: string[];
  fillings?: string[];
  presentation?: string[];
  messageCard?: boolean;
  addOns?: string[];
  sponge?: string[];
  frostings?: string[];
  finishes?: string[];
  themes?: string[];
  inscriptions?: boolean;
  servingGuideIncluded?: boolean;
  arrangementType?: string[];
  container?: string[];
  noteOnTransport?: string;
  formats?: string[];
  minimumOrder?: Record<string, number>;
  allergens?: string[];
  flavorSets?: string[][];
  branding?: string[];
  service?: string[];
  packages?: ProductPackage[];
  sizes?: ProductOptionSize[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  img: string;
  priceFrom?: number;
  tags?: string[];
  leadTimeDays?: number;
  dietary?: string[];
  options: ProductOptions;
  notes?: string;
  storage?: string;
  logistics?: string;
  props: {
    bg: string;
    h: string; 
    padding: string; 
  };
  route?: string;
  cta?: string;
}

export type ProductList = Product[];

export type OptionKey =
  | 'sizes' | 'sponge' | 'fillings' | 'frostings' | 'finishes' | 'themes'
  | 'cupcakeType' | 'buttercreamStyle' | 'flavors' | 'colorPalettes'
  | 'quantities' | 'arrangementType' | 'presentation' | 'container'
  | 'addOns' | 'minimumOrder' | 'flavorSets' | 'branding' | 'service'
  | 'packages' | 'messageCard' | 'inscriptions' | 'servingGuideIncluded' | 'noteOnTransport' | 'allergens';

export const OPTION_LABELS: Record<OptionKey, string> = {
  sizes: 'Sizes & servings',
  sponge: 'Sponge',
  fillings: 'Fillings',
  frostings: 'Frostings',
  finishes: 'Finishes',
  themes: 'Themes',
  cupcakeType: 'Cupcake types',
  buttercreamStyle: 'Buttercream flowers',
  flavors: 'Flavors',
  colorPalettes: 'Color palettes',
  quantities: 'Bouquet sizes',
  arrangementType: 'Arrangement type',
  presentation: 'Presentation',
  container: 'Container',
  addOns: 'Add-ons',
  minimumOrder: 'Minimum order',
  flavorSets: 'Flavor sets',
  branding: 'Branding options',
  service: 'Service',
  packages: 'Event packages',
  messageCard: 'Message card included',
  inscriptions: 'Custom inscription',
  servingGuideIncluded: 'Serving guide included',
  noteOnTransport: 'Transport note',
  allergens: 'Allergens',
};

