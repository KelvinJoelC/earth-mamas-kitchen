import {
  productOfferingPaths,
  serviceOfferingPaths,
} from '@/configuration/offerings/offering-paths';
import { productOfferings } from '@/configuration/offerings/product-offerings';
import { serviceOfferings } from '@/configuration/offerings/service-offerings';

export interface SeoRoute {
  readonly path: `/${string}`;
  readonly changefreq: 'monthly';
  readonly priority: string;
}

export const staticIndexableRoutes = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
] as const satisfies readonly SeoRoute[];

export const productOfferingSeoRoutes = productOfferings.map((offering) => ({
  path: productOfferingPaths[offering.id],
  changefreq: 'monthly',
  priority: '0.8',
})) satisfies readonly SeoRoute[];

export const serviceOfferingSeoRoutes = serviceOfferings.map((offering) => ({
  path: serviceOfferingPaths[offering.id],
  changefreq: 'monthly',
  priority: '0.8',
})) satisfies readonly SeoRoute[];

export const sitemapRoutes = [
  ...staticIndexableRoutes,
  ...productOfferingSeoRoutes,
  ...serviceOfferingSeoRoutes,
] as const satisfies readonly SeoRoute[];

export const nonIndexablePublicRoutes = ['/order'] as const;
