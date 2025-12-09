// src/utils/cart.js
export const CART_KEY = 'kerubin_cart_v1';

function readStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch (e) {
    console.error('cart read error', e);
    return { items: [] };
  }
}

function writeStorage(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Emitir evento global que escuche el header
    window.dispatchEvent(new CustomEvent('cart:update', { detail: cart }));
    // (opcional) BroadcastChannel para multi-pestaña (ver initSync abajo)
    if (window.__CART_BC) window.__CART_BC.postMessage({ type: 'cart:update', cart });
  } catch (e) {
    console.error('cart write error', e);
  }
}

export function getCart() {
  return readStorage();
}

export function itemCount() {
  const cart = readStorage();
  return cart.items.reduce((s, i) => s + (i.qty || 1), 0);
}

export function addItem(item) {
  const cart = readStorage();
  const idx = cart.items.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    cart.items[idx].qty = (cart.items[idx].qty || 1) + (item.qty || 1);
  } else {
    cart.items.push({ ...item, qty: item.qty || 1 });
  }
  writeStorage(cart);
  return cart;
}

export function removeItem(id) {
  const cart = readStorage();
  cart.items = cart.items.filter(i => i.id !== id);
  writeStorage(cart);
  return cart;
}

export function clearCart() {
  const cart = { items: [] };
  writeStorage(cart);
  return cart;
}

// Optional: inicializa BroadcastChannel para sincronizar entre pestañas
export function initSync() {
  if ('BroadcastChannel' in window && !window.__CART_BC) {
    window.__CART_BC = new BroadcastChannel('kerubin_cart');
    window.__CART_BC.addEventListener('message', (ev) => {
      if (ev.data?.type === 'cart:update') {
        localStorage.setItem(CART_KEY, JSON.stringify(ev.data.cart));
        window.dispatchEvent(new CustomEvent('cart:update', { detail: ev.data.cart }));
      }
    });
  }
}
