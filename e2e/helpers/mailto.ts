import { expect, type Page } from '@playwright/test';

export interface ParsedMailto {
  url: string;
  recipient: string;
  subject: string;
  body: string;
}

export function parseMailto(url: string): ParsedMailto {
  expect(url.startsWith('mailto:')).toBe(true);

  const withoutScheme = url.slice('mailto:'.length);
  const [recipient, query = ''] = withoutScheme.split('?');
  const params = new URLSearchParams(query);

  return {
    url,
    recipient: decodeURIComponent(recipient),
    subject: params.get('subject') ?? '',
    body: params.get('body') ?? '',
  };
}

export async function captureMailto(
  page: Page,
  action: () => Promise<void>,
): Promise<ParsedMailto> {
  const mailtoRequest = page
    .waitForEvent('request', {
      predicate: (request) => request.url().startsWith('mailto:'),
      timeout: 5_000,
    })
    .catch(() => undefined);

  await action();

  const request = await mailtoRequest;
  expect(request, 'Expected a mailto: navigation request.').toBeTruthy();

  return parseMailto(request!.url());
}
