import { expect, test } from '@playwright/test';

import { getEarliestCollectionDate } from '../src/domain/collection';

import {
  makeCartItem,
  seedCart,
  seedCorruptCart,
  seedExpiredCart,
} from './helpers/cart-storage';
import {
  addFloralBouquetToCart,
  clearCart,
  fillFloralBouquet,
  offeringRoutes,
} from './helpers/product-forms';

test('cart shows empty, persisted, remove, clear, corrupt, and expired states safely', async ({
  page,
}) => {
  await seedCart(page, [makeCartItem('persisted-1')]);
  await page.goto('/order');

  await expect(
    page
      .locator('#orderItems')
      .getByRole('heading', { name: 'Floral Cupcake Bouquets' }),
  ).toBeVisible();
  await expect(page.locator('#orderEstimatedTotal')).toHaveText('$65.00');

  await page.reload();
  await expect(
    page
      .locator('#orderItems')
      .getByRole('heading', { name: 'Floral Cupcake Bouquets' }),
  ).toBeVisible();

  await page
    .getByRole('button', { name: /Remove Floral Cupcake Bouquets/ })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Your order is waiting for a creation' }),
  ).toBeVisible();

  await page.context().clearCookies();
});

test('checkout uses one weekday date and time based on the longest lead time', async ({
  page,
}) => {
  await seedCart(page, [
    makeCartItem('floral-1', { leadTimeDays: 3 }),
    makeCartItem('cake-1', {
      product: 'Bespoke Cakes',
      offeringId: 'bespoke-cakes',
      workflowId: 'design-brief-preorder',
      leadTimeDays: 5,
    }),
  ]);
  await page.goto('/order');
  await page.getByRole('button', { name: /Email/ }).click();

  const expectedEarliestDate = getEarliestCollectionDate(5);
  await expect(page.getByLabel('Preferred collection date')).toHaveAttribute(
    'min',
    expectedEarliestDate,
  );
  await expect(page.getByLabel('Preferred collection date')).toHaveValue(
    expectedEarliestDate,
  );
  await expect(
    page.getByLabel('Preferred collection time').locator('option'),
  ).toHaveCount(15);

  const weekendDate = await page
    .getByLabel('Preferred collection date')
    .evaluate((element) => {
      const input = element as HTMLInputElement;
      const date = new Date(`${input.min}T12:00:00`);
      while (date.getDay() !== 6) date.setDate(date.getDate() + 1);
      return date.toISOString().slice(0, 10);
    });

  await page.getByLabel('Preferred collection date').fill(weekendDate);
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(
    page.getByText('Please choose a weekday on or after'),
  ).toBeVisible();
});

test('expired cart data and corrupt localStorage recover to an empty order page', async ({
  browser,
}) => {
  const expiredContext = await browser.newContext();
  const expiredPage = await expiredContext.newPage();
  await seedExpiredCart(expiredPage, [makeCartItem('expired-1')]);
  await expiredPage.goto('/order');
  await expect(
    expiredPage.getByRole('heading', {
      name: 'Your order is waiting for a creation',
    }),
  ).toBeVisible();
  await expiredContext.close();

  const corruptContext = await browser.newContext();
  const corruptPage = await corruptContext.newPage();
  await seedCorruptCart(corruptPage);
  await corruptPage.goto('/order');
  await expect(
    corruptPage.getByRole('heading', {
      name: 'Your order is waiting for a creation',
    }),
  ).toBeVisible();
  await corruptContext.close();
});

test('customers can add duplicate configurations up to three and are blocked from a fourth', async ({
  page,
}) => {
  await clearCart(page);

  await addFloralBouquetToCart(page);
  await addFloralBouquetToCart(page);
  await addFloralBouquetToCart(page);

  await page.goto('/order');
  await expect(
    page
      .locator('#orderItems')
      .getByRole('heading', { name: 'Floral Cupcake Bouquets' }),
  ).toHaveCount(3);
  await expect(page.getByText('$195.00')).toBeVisible();

  await page.goto(offeringRoutes.floral);
  await fillFloralBouquet(page);
  page.once('dialog', async (alert) => {
    expect(alert.message()).toContain(
      'You can save up to three preorder configurations',
    );
    await alert.accept();
  });
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page).toHaveURL(/floral-cupcake-bouquets$/);

  await page.goto('/order');
  await expect(
    page
      .locator('#orderItems')
      .getByRole('heading', { name: 'Floral Cupcake Bouquets' }),
  ).toHaveCount(3);
});

test('clear cart requires confirmation and updates the visible order state', async ({
  page,
}) => {
  await seedCart(page, [makeCartItem('clear-1'), makeCartItem('clear-2')]);
  await page.goto('/order');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain(
      'Clear all saved preorder configurations?',
    );
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Clear cart' }).click();
  await expect(
    page.getByRole('heading', { name: 'Your order is waiting for a creation' }),
  ).toBeVisible();
  await expect(page.getByText('$0.00')).not.toBeVisible();
});
