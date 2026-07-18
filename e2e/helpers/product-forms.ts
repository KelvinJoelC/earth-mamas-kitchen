import { expect, type Page } from '@playwright/test';

export const offeringRoutes = {
  floral: '/our-creations/floral-cupcake-bouquets',
  edible: '/our-creations/edible-blooms',
  bespoke: '/our-creations/bespoke-cakes',
} as const;

export async function clearCart(page: Page) {
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.removeItem('myapp_cart');
  });
}

export async function selectRequiredGuidedOptions(page: Page) {
  await page.getByLabel('Vanilla', { exact: true }).check();
  await page.getByLabel('Colour Palette').selectOption('soft-pastels');
}

export async function addFloralBouquetToCart(page: Page) {
  await page.goto(offeringRoutes.floral);
  await fillFloralBouquet(page);
  await submitValidPreorder(page);
}

export async function fillFloralBouquet(page: Page) {
  await selectRequiredGuidedOptions(page);
}

export async function submitValidPreorder(page: Page) {
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page).toHaveURL(/\/order$/);
}

export async function addEdibleBloomsToCart(page: Page) {
  await page.goto(offeringRoutes.edible);
  await selectRequiredGuidedOptions(page);
  await page.getByLabel('Decoration Style').selectOption('floral-buttercream');
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page).toHaveURL(/\/order$/);
}

export async function completeBespokeCake(page: Page) {
  await page.getByLabel('Sponge Flavour').selectOption('chocolate-vegan');
  await page.getByLabel('Filling').selectOption('raspberry-jam');
  await expect(page.getByLabel('Frosting')).toHaveValue('vegan-buttercream');
  await page.getByLabel('Occasion').selectOption('birthday');
  await page
    .getByLabel('Design Description')
    .fill('A soft floral cake with pastel colours and a simple finish.');
}
