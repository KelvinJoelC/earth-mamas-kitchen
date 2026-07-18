import { expect, test } from '@playwright/test';

import {
  clearCart,
  completeBespokeCake,
  offeringRoutes,
  selectRequiredGuidedOptions,
} from './helpers/product-forms';

test.beforeEach(async ({ page }) => {
  await clearCart(page);
});

test('homepage catalogue links open each canonical Product Offering configurator', async ({
  page,
}) => {
  await page.goto('/');

  const offerings = [
    ['Floral Cupcake Bouquets', offeringRoutes.floral],
    ['Edible Blooms', offeringRoutes.edible],
    ['Bespoke Cakes', offeringRoutes.bespoke],
  ] as const;

  for (const [name, route] of offerings) {
    await page.goto('/');
    await page.locator(`a[href="${route}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible();
    await expect(page.locator('#preOrderForm')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  }
});

test('Floral Cupcake Bouquets dynamically revalidates flavour limits and saves a valid cart item', async ({
  page,
}) => {
  await page.goto(offeringRoutes.floral);

  await expect(page.getByLabel('Bouquet Size')).toHaveValue('small-bouquet');
  await expect(page.getByText('Select up to 1.')).toBeVisible();

  await page.getByLabel('Bouquet Size').selectOption('large-bouquet');
  await expect(page.getByText('Select up to 3.')).toBeVisible();
  await page.getByLabel('Vanilla', { exact: true }).check();
  await page.getByLabel('Chocolate', { exact: true }).check();
  await page.getByLabel('Red Velvet', { exact: true }).check();

  await page.getByLabel('Bouquet Size').selectOption('small-bouquet');
  await expect(page.getByLabel('Vanilla', { exact: true })).toBeChecked();
  await expect(page.getByLabel('Chocolate', { exact: true })).not.toBeChecked();
  await expect(
    page.getByLabel('Red Velvet', { exact: true }),
  ).not.toBeChecked();
  await expect(page.getByLabel('Chocolate', { exact: true })).toBeDisabled();

  await page.getByLabel('Colour Palette').selectOption('custom-colours');
  await expect(page.getByLabel('Custom Colours')).toBeVisible();
  await page.getByLabel('Custom Colours').fill('Pink, lavender and cream');

  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page).toHaveURL(/\/order$/);
  await expect(
    page
      .locator('#orderItems')
      .getByRole('heading', { name: 'Floral Cupcake Bouquets' }),
  ).toBeVisible();
  await expect(page.getByText('Small Bouquet')).toBeVisible();
  await expect(page.getByText('Pink, lavender and cream')).toBeVisible();
});

test('Edible Blooms uses configured defaults, guided required fields, and review notes', async ({
  page,
}) => {
  await page.goto(offeringRoutes.edible);

  await expect(page.getByLabel('Box Size')).toHaveValue('small-box');
  await expect(page.getByText('Select up to 1.')).toBeVisible();

  await page.getByLabel('Box Size').selectOption('standard-box');
  await expect(page.getByText('Select up to 2.')).toBeVisible();
  await selectRequiredGuidedOptions(page);
  await page.getByLabel('Chocolate', { exact: true }).check();
  await page.getByLabel('Decoration Style').selectOption('floral-buttercream');

  await page.getByRole('button', { name: 'Dietary Requirements' }).click();
  await page
    .getByLabel('Dietary Requirements')
    .fill('Please review a dairy-free preference if possible.');

  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page).toHaveURL(/\/order$/);
  await expect(
    page.locator('#orderItems').getByRole('heading', { name: 'Edible Blooms' }),
  ).toBeVisible();
  await expect(page.getByText('Standard Box')).toBeVisible();
  await expect(
    page.getByText('Final quotation requires bakery review.'),
  ).toBeVisible();
});

test('Bespoke Cakes validates the design brief and applies vegan compatibility rules', async ({
  page,
}) => {
  await page.goto(offeringRoutes.bespoke);

  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByLabel('Sponge Flavour')).toBeFocused();

  await completeBespokeCake(page);
  await expect(
    page.getByLabel('Filling').locator('option[value="biscoff"]'),
  ).toBeDisabled();
  await expect(
    page.getByLabel('Frosting').locator('option[value="buttercream"]'),
  ).toBeDisabled();
  await expect(
    page.getByText('Select your flavours to view the allergen information.'),
  ).not.toBeVisible();
  await expect(page.locator('#containsAllergens')).toContainText(
    /Gluten|Milk|Egg|Soy/,
  );

  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page).toHaveURL(/\/order$/);
  await expect(
    page.locator('#orderItems').getByRole('heading', { name: 'Bespoke Cakes' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Please attach reference images manually when your email client opens.',
    ),
  ).toBeVisible();
});
