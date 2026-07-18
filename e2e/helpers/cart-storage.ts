import type { Page } from '@playwright/test';

export const CART_KEY = 'myapp_cart';
const CART_VERSION = 1;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface TestCartItem {
  id: string;
  product: string;
  offeringId: string;
  workflowId: string;
  options: Record<string, string | string[]>;
  labels: {
    options: Record<string, { label: string; value: string | string[] }>;
    addOns?: { addOnId: string; label: string; customerInput?: string }[];
  };
  addOnInputs?: { addOnId: string; customerInput?: string }[];
  estimatedPrice: {
    kind: 'estimate';
    currency: 'AUD';
    amount: number;
    components: {
      type: string;
      referenceId: string;
      label: string;
      amount: number;
    }[];
    finalQuotationRequired: true;
  };
  containsAllergens?: string[];
  requiresReview?: boolean;
  referenceImageInstructions?: string;
  createdAt?: string;
}

export function buildCartState(items: TestCartItem[], now = new Date()) {
  const timestamp = now.toISOString();

  return {
    version: CART_VERSION,
    createdAt: timestamp,
    updatedAt: timestamp,
    expiresAt: new Date(now.getTime() + 7 * DAY_IN_MS).toISOString(),
    items,
  };
}

export function makeCartItem(
  id: string,
  overrides: Partial<TestCartItem> = {},
): TestCartItem {
  return {
    id,
    product: 'Floral Cupcake Bouquets',
    offeringId: 'floral-cupcake-bouquets',
    workflowId: 'guided-preorder',
    options: {
      'bouquet-size': 'small-bouquet',
      'cupcake-flavours': ['vanilla'],
      'colour-palette': 'soft-pastels',
      'collection-date': '2026-08-01',
      addOns: [],
    },
    labels: {
      options: {
        'bouquet-size': { label: 'Bouquet Size', value: 'Small Bouquet' },
        'cupcake-flavours': { label: 'Cupcake Flavours', value: ['Vanilla'] },
        'colour-palette': { label: 'Colour Palette', value: 'Soft Pastels' },
        'collection-date': {
          label: 'Preferred Collection Date',
          value: '2026-08-01',
        },
      },
      addOns: [],
    },
    estimatedPrice: {
      kind: 'estimate',
      currency: 'AUD',
      amount: 6500,
      components: [
        {
          type: 'base-option',
          referenceId: 'small-bouquet',
          label: 'Small Bouquet',
          amount: 6500,
        },
      ],
      finalQuotationRequired: true,
    },
    containsAllergens: ['Gluten', 'Milk', 'Egg'],
    requiresReview: false,
    ...overrides,
  };
}

export async function seedCart(page: Page, items: TestCartItem[]) {
  await page.addInitScript(
    ({ key, state }) => {
      window.localStorage.setItem(key, JSON.stringify(state));
    },
    { key: CART_KEY, state: buildCartState(items) },
  );
}

export async function seedExpiredCart(page: Page, items: TestCartItem[]) {
  const now = new Date('2026-07-18T00:00:00.000Z');
  const state = {
    ...buildCartState(items, now),
    expiresAt: new Date(now.getTime() - DAY_IN_MS).toISOString(),
  };

  await page.addInitScript(
    ({ key, expiredState }) => {
      window.localStorage.setItem(key, JSON.stringify(expiredState));
    },
    { key: CART_KEY, expiredState: state },
  );
}

export async function seedCorruptCart(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, '{not valid json');
  }, CART_KEY);
}
