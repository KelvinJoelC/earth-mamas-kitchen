import { expect, test } from '@playwright/test';

import { mockClipboardSuccess } from './helpers/clipboard';
import { fillEventsForm } from './helpers/enquiry-forms';
import { captureMailto } from './helpers/mailto';
import { addEdibleBloomsToCart, clearCart } from './helpers/product-forms';

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test.beforeEach(async ({ page }) => {
  await clearCart(page);
});

test('mobile Product Offering flow remains usable through cart review', async ({
  page,
}) => {
  await addEdibleBloomsToCart(page);

  await expect(
    page.locator('#orderItems').getByRole('heading', { name: 'Edible Blooms' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Remove Edible Blooms/ }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /Email/ })).toBeVisible();
});

test('mobile Events & Catering enquiry prepares mailto without external services', async ({
  page,
}) => {
  await mockClipboardSuccess(page);
  await page.goto('/events-catering');
  await fillEventsForm(page);

  const mailto = await captureMailto(page, () =>
    page.getByRole('button', { name: 'Prepare Email' }).click(),
  );

  expect(mailto.subject).toBe(
    "Events & Catering Enquiry - Earth Mama's Kitchen",
  );
  expect(mailto.body).toContain('I would like to discuss cupcakes');
});
