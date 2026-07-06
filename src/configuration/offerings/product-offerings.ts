import { bespokeCakes } from '@/configuration/offerings/products/bespoke-cakes';
import { edibleBlooms } from '@/configuration/offerings/products/edible-blooms';
import { floralCupcakeBouquets } from '@/configuration/offerings/products/floral-cupcake-bouquets';

export const productOfferings = [
  floralCupcakeBouquets,
  edibleBlooms,
  bespokeCakes,
] as const;

export type ProductOfferingId = (typeof productOfferings)[number]['id'];
