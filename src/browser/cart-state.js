export const CART_KEY = 'myapp_cart';
export const CART_VERSION = 1;
export const CART_MAX_ITEMS = 3;
export const CART_EXPIRY_DAYS = 7;

const CART_CHANNEL_NAME = 'myapp_cart';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

let broadcastChannel;
let broadcastController;
let syncInitialized = false;

/**
 * @typedef {Object} PriceComponent
 * @property {string} type
 * @property {string} referenceId
 * @property {string} label
 * @property {number} amount
 */

/**
 * @typedef {Object} EstimatedPrice
 * @property {'estimate'} kind
 * @property {'AUD'} currency
 * @property {number} amount
 * @property {PriceComponent[]} components
 * @property {true} finalQuotationRequired
 */

/**
 * @typedef {Object} CartOptionLabel
 * @property {string} label
 * @property {string|string[]} value
 */

/**
 * @typedef {Object} CartAddOnLabel
 * @property {string} addOnId
 * @property {string} label
 * @property {string=} customerInput
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} product
 * @property {string=} offeringId
 * @property {string=} workflowId
 * @property {number=} leadTimeDays
 * @property {Record<string, string|string[]>} options
 * @property {{ options?: Record<string, CartOptionLabel>, addOns?: CartAddOnLabel[] }=} labels
 * @property {{ addOnId: string, customerInput?: string }[]=} addOnInputs
 * @property {EstimatedPrice=} estimatedPrice
 * @property {string[]=} containsAllergens
 * @property {boolean=} requiresReview
 * @property {string=} referenceImageInstructions
 * @property {string=} createdAt
 */

/**
 * @typedef {Object} CartState
 * @property {1} version
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} expiresAt
 * @property {CartItem[]} items
 */

/**
 * Duplicate configurations are allowed in v1.
 * Each successful preorder submission creates an independent cart item.
 * Customers remove duplicates manually; cart editing is intentionally not exposed.
 *
 * @typedef {Object} CartOperationResult
 * @property {boolean} ok
 * @property {CartItem[]} cart
 * @property {'cart-limit-reached'|'storage-unavailable'|'invalid-item'|'item-not-found'=} reason
 */

function nowIso() {
  return new Date().toISOString();
}

function expiryIso(from = new Date()) {
  return new Date(from.getTime() + CART_EXPIRY_DAYS * DAY_IN_MS).toISOString();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isStringArray(value) {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function isValidOptions(options) {
  return (
    isPlainObject(options) &&
    Object.values(options).every(
      (value) => typeof value === 'string' || isStringArray(value),
    )
  );
}

/**
 * @param {unknown} item
 * @returns {item is CartItem}
 */
function isCartItem(item) {
  return (
    isPlainObject(item) &&
    typeof item.id === 'string' &&
    typeof item.product === 'string' &&
    isValidOptions(item.options)
  );
}

/**
 * @param {unknown} items
 * @returns {CartItem[]}
 */
function normalizeItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .filter(isCartItem)
    .slice(0, CART_MAX_ITEMS)
    .map((item) => ({
      ...item,
      createdAt: item.createdAt ?? nowIso(),
      containsAllergens: Array.isArray(item.containsAllergens)
        ? item.containsAllergens.filter(
            (allergen) => typeof allergen === 'string',
          )
        : [],
      requiresReview: Boolean(item.requiresReview),
    }));
}

/**
 * @param {CartItem[]} items
 * @param {Date} [date]
 * @returns {CartState}
 */
function createCartState(items = [], date = new Date()) {
  const timestamp = date.toISOString();

  return {
    version: CART_VERSION,
    createdAt: timestamp,
    updatedAt: timestamp,
    expiresAt: expiryIso(date),
    items: normalizeItems(items),
  };
}

/**
 * @param {unknown} parsed
 * @returns {{ state: CartState, expired: boolean, malformed: boolean }}
 */
function normalizeStoredState(parsed) {
  if (Array.isArray(parsed)) {
    return {
      state: createCartState(parsed),
      expired: false,
      malformed: false,
    };
  }

  if (!isPlainObject(parsed)) {
    return {
      state: createCartState(),
      expired: false,
      malformed: true,
    };
  }

  const items = normalizeItems(parsed.items);
  const state = {
    version: CART_VERSION,
    createdAt:
      typeof parsed.createdAt === 'string' ? parsed.createdAt : nowIso(),
    updatedAt:
      typeof parsed.updatedAt === 'string' ? parsed.updatedAt : nowIso(),
    expiresAt:
      typeof parsed.expiresAt === 'string' ? parsed.expiresAt : expiryIso(),
    items,
  };

  return {
    state,
    expired: Date.parse(state.expiresAt) <= Date.now(),
    malformed: false,
  };
}

function removeStoredCart() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (err) {
    console.error('cart remove error', err);
  }
}

/**
 * @returns {CartState}
 */
function readCartState() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return createCartState();

    const { state, expired, malformed } = normalizeStoredState(JSON.parse(raw));

    if (expired || malformed) {
      removeStoredCart();
      return createCartState();
    }

    return state;
  } catch (err) {
    console.error('cart read error', err);
    removeStoredCart();
    return createCartState();
  }
}

/**
 * @param {CartState} state
 * @returns {boolean}
 */
function writeCartState(state) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('cart write error', err);
    return false;
  }
}

/**
 * @param {CartState} state
 * @param {'local'|'broadcast'} source
 */
function notifyCartChange(state, source) {
  window.dispatchEvent(
    new CustomEvent('cart:update', {
      detail: { cart: state.items, state, source },
    }),
  );
}

/**
 * @param {CartState} state
 */
function broadcastCartState(state) {
  broadcastChannel?.postMessage({ type: 'cart:update', state });
}

/**
 * @returns {CartItem[]}
 */
export function readCart() {
  return readCartState().items;
}

export function getCartCount() {
  return readCart().length;
}

/**
 * @param {CartItem} item
 * @returns {CartOperationResult}
 */
export function addCartItem(item) {
  if (!isCartItem(item)) {
    return { ok: false, reason: 'invalid-item', cart: readCart() };
  }

  const currentState = readCartState();
  if (currentState.items.length >= CART_MAX_ITEMS) {
    return {
      ok: false,
      reason: 'cart-limit-reached',
      cart: currentState.items,
    };
  }

  const date = new Date();
  const nextState = {
    ...currentState,
    updatedAt: date.toISOString(),
    expiresAt: expiryIso(date),
    items: [
      ...currentState.items,
      {
        ...item,
        createdAt: item.createdAt ?? date.toISOString(),
      },
    ],
  };

  if (!writeCartState(nextState)) {
    return {
      ok: false,
      reason: 'storage-unavailable',
      cart: currentState.items,
    };
  }

  notifyCartChange(nextState, 'local');
  broadcastCartState(nextState);

  return { ok: true, cart: nextState.items };
}

/**
 * @param {string} id
 * @returns {CartOperationResult}
 */
export function removeCartItem(id) {
  const currentState = readCartState();
  const nextItems = currentState.items.filter((item) => item.id !== id);

  if (nextItems.length === currentState.items.length) {
    return { ok: false, reason: 'item-not-found', cart: currentState.items };
  }

  const date = new Date();
  const nextState = {
    ...currentState,
    updatedAt: date.toISOString(),
    expiresAt: expiryIso(date),
    items: nextItems,
  };

  if (!writeCartState(nextState)) {
    return {
      ok: false,
      reason: 'storage-unavailable',
      cart: currentState.items,
    };
  }

  notifyCartChange(nextState, 'local');
  broadcastCartState(nextState);

  return { ok: true, cart: nextState.items };
}

/**
 * @returns {CartOperationResult}
 */
export function clearCart() {
  const date = new Date();
  const nextState = createCartState([], date);

  if (!writeCartState(nextState)) {
    return {
      ok: false,
      reason: 'storage-unavailable',
      cart: readCart(),
    };
  }

  notifyCartChange(nextState, 'local');
  broadcastCartState(nextState);

  return { ok: true, cart: [] };
}

export function initCartSync() {
  if (syncInitialized || !('BroadcastChannel' in window)) return;

  broadcastChannel = new BroadcastChannel(CART_CHANNEL_NAME);
  broadcastController = new AbortController();
  syncInitialized = true;

  broadcastChannel.addEventListener(
    'message',
    (event) => {
      if (event.data?.type !== 'cart:update') return;

      const { state, expired, malformed } = normalizeStoredState(
        event.data.state,
      );
      if (expired || malformed) return;

      if (writeCartState(state)) {
        notifyCartChange(state, 'broadcast');
      }
    },
    { signal: broadcastController.signal },
  );
}

export function disposeCartSync() {
  broadcastController?.abort();
  broadcastController = undefined;
  broadcastChannel?.close();
  broadcastChannel = undefined;
  syncInitialized = false;
}
