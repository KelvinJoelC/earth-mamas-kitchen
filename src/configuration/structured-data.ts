import { siteMetadata } from '@/configuration/metadata';

const developerProfiles = [
  'https://github.com/KelvinJoelC/earth-mamas-kitchen',
  'https://www.linkedin.com/in/kcarrenoespin',
] as const;

type JsonPrimitive = string | number | boolean | null;
type JsonValue =
  JsonPrimitive | readonly JsonValue[] | { readonly [key: string]: JsonValue };

export type StructuredDataGraph = {
  readonly '@context': 'https://schema.org';
  readonly '@graph': readonly JsonValue[];
};

export function getGlobalStructuredData(site: URL): StructuredDataGraph {
  const siteUrl = site.toString();
  const websiteId = new URL('/#website', site).toString();
  const creativeWorkId = new URL('/#portfolio-case-study', site).toString();
  const developerId = new URL('/#developer', site).toString();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': developerId,
        name: 'Kelvin Carreno',
        url: 'https://www.linkedin.com/in/kcarrenoespin',
        sameAs: developerProfiles,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteMetadata.name,
        url: siteUrl,
        inLanguage: 'en',
        description:
          "A professional frontend portfolio case study for Earth Mama's Kitchen, based on a realistic artisan bakery experience in Cairns.",
        creator: { '@id': developerId },
        about: { '@id': creativeWorkId },
      },
      {
        '@type': 'CreativeWork',
        '@id': creativeWorkId,
        name: "Earth Mama's Kitchen Portfolio Case Study",
        url: siteUrl,
        inLanguage: 'en',
        genre: 'Frontend portfolio case study',
        isAccessibleForFree: true,
        description:
          'A portfolio case study demonstrating a configuration-driven Astro frontend for a realistic premium bakery catalogue, preorder and enquiry experience.',
        creator: { '@id': developerId },
        author: { '@id': developerId },
      },
    ],
  };
}
