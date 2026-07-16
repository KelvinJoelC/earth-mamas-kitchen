import type { ProductOfferingDefinition } from '@/domain/offerings';

export interface PageMetadataImage {
  readonly src: `/${string}`;
  readonly alt: string;
}

export interface PageMetadata {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath: `/${string}`;
  readonly image?: PageMetadataImage;
  readonly type?: 'website';
  readonly noindex?: boolean;
}

export const siteMetadata = {
  name: "Earth Mama's Kitchen",
  defaultImage: {
    src: '/images/flowerCupcakesBouquet2.webp',
    alt: "Earth Mama's Kitchen floral cupcake bouquet",
  },
} as const;

export const homeMetadata = {
  title: 'Handcrafted Cakes & Edible Gifts in Cairns',
  description:
    "Explore Earth Mama's Kitchen product offerings for handcrafted cakes, floral cupcake bouquets and edible gifts in Cairns.",
  canonicalPath: '/',
  image: siteMetadata.defaultImage,
} as const satisfies PageMetadata;

export const aboutMetadata = {
  title: 'About',
  description:
    "Learn about the story, awards and contact pathways for Earth Mama's Kitchen in Cairns.",
  canonicalPath: '/about',
  image: siteMetadata.defaultImage,
} as const satisfies PageMetadata;

export const orderMetadata = {
  title: 'Order Review',
  description:
    "Review saved Earth Mama's Kitchen preorder configurations and prepare a manual enquiry email.",
  canonicalPath: '/order',
  image: siteMetadata.defaultImage,
  noindex: true,
} as const satisfies PageMetadata;

export function getProductOfferingMetadata(
  offering: ProductOfferingDefinition,
  presentation: { readonly img: string; readonly title: string },
): PageMetadata {
  return {
    title: offering.name,
    description: offering.summary,
    canonicalPath: `/our-creations/${offering.slug}`,
    image: {
      src: `${presentation.img}.webp` as `/${string}`,
      alt: presentation.title,
    },
  };
}

export function getServiceOfferingMetadata(service: {
  readonly name: string;
  readonly slug: string;
  readonly summary: string;
}): PageMetadata {
  return {
    title: service.name,
    description:
      'Personalised Events & Catering enquiries for large or complex celebration requirements, with availability and quotation confirmed after consultation.',
    canonicalPath: `/${service.slug}`,
    image: {
      src: '/images/events.webp',
      alt: "Earth Mama's Kitchen events and catering presentation",
    },
  };
}
