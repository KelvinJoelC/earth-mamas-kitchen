import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  addCartItem,
  CART_EXPIRY_DAYS,
  CART_KEY,
  CART_MAX_ITEMS,
  clearCart,
  getCartCount,
  readCart,
  removeCartItem,
} from '../src/browser/cart-state.js';

const baseDate = new Date('2026-01-01T10:00:00.000Z');

function createStorage() {
  const records = new Map();

  return {
    getItem: vi.fn((key) => records.get(key) ?? null),
    setItem: vi.fn((key, value) => records.set(key, value)),
    removeItem: vi.fn((key) => records.delete(key)),
    clear: vi.fn(() => records.clear()),
  };
}

function createCartItem(id) {
  return {
    id,
    product: 'Floral Cupcake Bouquets',
    offeringId: 'floral-cupcake-bouquets',
    workflowId: 'guided-preorder',
    options: {
      'bouquet-size': 'small-bouquet',
      'cupcake-flavours': ['vanilla'],
    },
    estimatedPrice: {
      kind: 'estimate',
      currency: 'AUD',
      amount: 6500,
      components: [],
      finalQuotationRequired: true,
    },
  };
}

function writeRawCart(value) {
  globalThis.localStorage.setItem(CART_KEY, JSON.stringify(value));
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(baseDate);
  vi.stubGlobal('localStorage', createStorage());
  vi.stubGlobal(
    'CustomEvent',
    class CustomEvent extends Event {
      constructor(type, init = {}) {
        super(type);
        this.detail = init.detail;
      }
    },
  );
  vi.stubGlobal('window', {
    dispatchEvent: vi.fn(),
  });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('cart state and persistence', () => {
  it('adds independent cart items and emits one predictable update', () => {
    const result = addCartItem(createCartItem('item-1'));

    expect(result.ok).toBe(true);
    expect(readCart()).toHaveLength(1);
    expect(getCartCount()).toBe(1);
    expect(window.dispatchEvent).toHaveBeenCalledTimes(1);
    expect(window.dispatchEvent.mock.calls[0][0].type).toBe('cart:update');
  });

  it('allows duplicate configurations as independent v1 cart items', () => {
    const first = createCartItem('item-1');
    const duplicate = createCartItem('item-2');

    expect(addCartItem(first).ok).toBe(true);
    expect(addCartItem(duplicate).ok).toBe(true);

    expect(readCart().map((item) => item.id)).toEqual(['item-1', 'item-2']);
  });

  it('removes individual items without clearing the rest of the cart', () => {
    addCartItem(createCartItem('item-1'));
    addCartItem(createCartItem('item-2'));

    const result = removeCartItem('item-1');

    expect(result.ok).toBe(true);
    expect(readCart().map((item) => item.id)).toEqual(['item-2']);
  });

  it('clears the cart through the explicit clear operation', () => {
    addCartItem(createCartItem('item-1'));

    const result = clearCart();

    expect(result.ok).toBe(true);
    expect(readCart()).toEqual([]);
  });

  it('enforces the three-item cart limit', () => {
    Array.from({ length: CART_MAX_ITEMS }, (_, index) =>
      addCartItem(createCartItem(`item-${index + 1}`)),
    );

    const result = addCartItem(createCartItem('item-4'));

    expect(result).toMatchObject({
      ok: false,
      reason: 'cart-limit-reached',
    });
    expect(readCart()).toHaveLength(CART_MAX_ITEMS);
  });

  it('rejects invalid items without mutating storage or notifying listeners', () => {
    const result = addCartItem({ id: 'missing-product' });

    expect(result).toMatchObject({ ok: false, reason: 'invalid-item' });
    expect(readCart()).toEqual([]);
    expect(window.dispatchEvent).not.toHaveBeenCalled();
  });

  it('removes malformed persisted data and returns an empty cart', () => {
    globalThis.localStorage.setItem(CART_KEY, '{not-json');

    expect(readCart()).toEqual([]);
    expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith(CART_KEY);
  });

  it('expires persisted cart data after seven calendar days', () => {
    writeRawCart({
      version: 1,
      createdAt: baseDate.toISOString(),
      updatedAt: baseDate.toISOString(),
      expiresAt: new Date(
        baseDate.getTime() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString(),
      items: [createCartItem('item-1')],
    });

    vi.setSystemTime(
      new Date(baseDate.getTime() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    );

    expect(readCart()).toEqual([]);
    expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith(CART_KEY);
  });

  it('reports storage failures without dispatching a successful cart update', () => {
    globalThis.localStorage.setItem.mockImplementation(() => {
      throw new Error('storage disabled');
    });

    const result = addCartItem(createCartItem('item-1'));

    expect(result).toMatchObject({
      ok: false,
      reason: 'storage-unavailable',
    });
    expect(window.dispatchEvent).not.toHaveBeenCalled();
  });
});
