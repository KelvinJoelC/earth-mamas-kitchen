import { bespokeCakes } from '@/configuration/offerings/products/bespoke-cakes';
import { edibleBlooms } from '@/configuration/offerings/products/edible-blooms';
import { floralCupcakeBouquets } from '@/configuration/offerings/products/floral-cupcake-bouquets';
import type { ProductOfferingId } from '@/configuration/offerings/product-offerings';
import type { ServiceOfferingId } from '@/configuration/offerings/service-offerings';
import { eventsCatering } from '@/configuration/offerings/services/events-catering';

type ProductOfferingPath = `/our-creations/${string}`;
type ServiceOfferingPath = `/${string}`;

export const productOfferingPaths = {
  [floralCupcakeBouquets.id]: `/our-creations/${floralCupcakeBouquets.slug}`,
  [edibleBlooms.id]: `/our-creations/${edibleBlooms.slug}`,
  [bespokeCakes.id]: `/our-creations/${bespokeCakes.slug}`,
} as const satisfies Readonly<Record<ProductOfferingId, ProductOfferingPath>>;

export const serviceOfferingPaths = {
  [eventsCatering.id]: `/${eventsCatering.slug}`,
} as const satisfies Readonly<Record<ServiceOfferingId, ServiceOfferingPath>>;
