import { expect, test } from '@playwright/test';

import {
  getClipboardWrites,
  mockClipboardFailure,
  mockClipboardSuccess,
} from './helpers/clipboard';
import { fillContactForm, fillEventsForm } from './helpers/enquiry-forms';
import { makeCartItem, seedCart } from './helpers/cart-storage';
import { captureMailto } from './helpers/mailto';

test('preorder enquiry validates details, prepares a mailto, and supports clipboard copy', async ({
  page,
}) => {
  await mockClipboardSuccess(page);
  await seedCart(page, [
    makeCartItem('preorder-mailto-1', {
      product: 'Bespoke Cakes',
      offeringId: 'bespoke-cakes',
      workflowId: 'design-brief-preorder',
      referenceImageInstructions:
        'Please attach reference images manually when your email client opens.',
      requiresReview: true,
    }),
  ]);
  await page.goto('/order');

  await page.getByRole('button', { name: /Email/ }).click();
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();
  await page.getByLabel('Your name').fill('Mia Carter');
  await page.getByLabel('Phone number').fill('abc');
  await page.getByRole('button', { name: 'Copy message' }).click();
  await expect(
    page.getByText('Please enter a valid Australian mobile number'),
  ).toBeVisible();
  await page.getByLabel('Phone number').fill('0412345678');

  await page.getByRole('button', { name: 'Copy message' }).click();
  const collectionDate = await page
    .getByLabel('Preferred collection date')
    .inputValue();
  const writes = await getClipboardWrites(page);
  expect(writes.at(-1)).toContain(
    "Subject: Order enquiry - Earth Mama's Kitchen",
  );
  expect(writes.at(-1)).toContain(`Requested date:`);
  expect(writes.at(-1)).toContain(`Requested time:`);
  expect(writes.at(-1)).toContain('Please attach reference images manually');
  await expect(page.getByText('Order enquiry copied.')).toBeVisible();

  const mailto = await captureMailto(page, () =>
    page.getByRole('button', { name: 'Send enquiry' }).click(),
  );
  expect(mailto.subject).toBe("Order enquiry - Earth Mama's Kitchen");
  expect(mailto.body).toContain('Mia Carter');
  expect(mailto.body).toContain('0412345678');
  expect(mailto.body).toContain(collectionDate.slice(0, 4));
  expect(mailto.body).toContain('Requested time:');
  expect(mailto.body).toContain('Bespoke Cakes');
  expect(mailto.body).toContain('Reference image reminder');
  expect(mailto.body).toContain('Could you please confirm availability');
  expect(mailto.body).not.toMatch(
    /order submitted|order received|booking confirmed/i,
  );
});

test('Events & Catering enquiry validates, prepares mailto, and exposes manual copy fallback', async ({
  page,
}) => {
  await mockClipboardFailure(page);
  await page.goto('/events-catering');

  await page.getByRole('button', { name: 'Prepare Email' }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();

  await fillEventsForm(page);
  const mailto = await captureMailto(page, () =>
    page.getByRole('button', { name: 'Prepare Email' }).click(),
  );
  expect(mailto.subject).toBe(
    "Events & Catering Enquiry - Earth Mama's Kitchen",
  );
  expect(mailto.body).toContain('Enquiry type: Events & Catering');
  expect(mailto.body).toContain('Birthday');
  expect(mailto.body).toContain('must be sent manually');
  expect(mailto.body).not.toMatch(
    /booking confirmed|request received|enquiry delivered/i,
  );

  await fillEventsForm(page);
  await page.getByRole('button', { name: 'Copy message' }).click();
  await expect(
    page.getByLabel('Prepared Events and Catering enquiry email'),
  ).toBeVisible();
  await expect(
    page.getByLabel('Prepared Events and Catering enquiry email'),
  ).toHaveValue(/Events & Catering Enquiry - Earth Mama's Kitchen/);
});

test('general contact prepares a distinct general-enquiry email without false delivery language', async ({
  page,
}) => {
  await mockClipboardSuccess(page);
  await page.goto('/about');

  await page.getByRole('button', { name: 'Prepare Email' }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();

  await fillContactForm(page);
  const mailto = await captureMailto(page, () =>
    page.getByRole('button', { name: 'Prepare Email' }).click(),
  );
  expect(mailto.subject).toBe("General Enquiry - Earth Mama's Kitchen");
  expect(mailto.body).toContain('Enquiry type: General enquiry');
  expect(mailto.body).toContain('Can I ask a general question?');
  expect(mailto.body).toContain('must be sent manually');
  expect(mailto.body).not.toMatch(
    /message sent|enquiry received|request delivered/i,
  );

  await fillContactForm(page);
  await page.getByRole('button', { name: 'Copy message' }).click();
  const writes = await getClipboardWrites(page);
  expect(writes.at(-1)).toContain(
    "Subject: General Enquiry - Earth Mama's Kitchen",
  );
});
