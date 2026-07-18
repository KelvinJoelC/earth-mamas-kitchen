import type { Page } from '@playwright/test';

export async function fillEventsForm(page: Page) {
  await page
    .getByRole('textbox', { name: /^Name required$/ })
    .fill('Mia Carter');
  await page
    .getByRole('textbox', { name: /^Email required$/ })
    .fill('mia@example.com');
  await page
    .getByRole('textbox', { name: /^Phone Number required$/ })
    .fill('0412345678');
  await page
    .getByRole('combobox', { name: /^Event Type required$/ })
    .selectOption('Birthday');
  await page
    .getByRole('textbox', { name: /^Message required$/ })
    .fill('I would like to discuss cupcakes for a small family event.');
}

export async function fillContactForm(page: Page) {
  await page.getByLabel('Name *').fill('Mia Carter');
  await page.getByLabel('Email *').fill('mia@example.com');
  await page.getByLabel('Phone').fill('0412345678');
  await page.getByLabel('Message *').fill('Can I ask a general question?');
}
