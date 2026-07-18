import type { Page } from '@playwright/test';

declare global {
  interface Window {
    __clipboardWrites?: string[];
  }
}

export async function mockClipboardSuccess(page: Page) {
  await page.addInitScript(() => {
    window.__clipboardWrites = [];

    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          window.__clipboardWrites?.push(text);
        },
      },
    });
  });
}

export async function mockClipboardFailure(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Simulated clipboard failure');
        },
      },
    });
  });
}

export async function getClipboardWrites(page: Page) {
  return page.evaluate(() => window.__clipboardWrites ?? []);
}
