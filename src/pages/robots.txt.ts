import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Missing Astro site configuration for robots generation.');
  }

  const sitemapUrl = new URL('/sitemap.xml', site).toString();

  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      '# /order is controlled with page-level noindex, follow metadata.',
      '# It is not blocked here so crawlers can read that directive.',
      `Sitemap: ${sitemapUrl}`,
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
};
