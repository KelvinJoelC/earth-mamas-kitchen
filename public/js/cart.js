export const CART_KEY = 'myapp_cart';

function readStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch (err) {
    console.error('cart read error', err);
    return { items: [] };
  }
}

function writeStorage(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
      // Emitir evento global para que listeners sepan del cambio
      window.dispatchEvent(new CustomEvent('cart:update', { detail: cart }));
    // Si quieres compatibilidad multi-pestaña:
    if (window.bc) window.bc.postMessage({ type: 'cart:update', cart });
  } catch (err) {
    console.error('cart write error', err);
  }
}

export function getCart() {
  return readStorage();
}

export function addItem(item) {
  const cart = readStorage();
  // ejemplo simple: buscar por id y aumentar cantidad
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

export function itemCount() {
  const cart = readStorage();
  return cart.items.reduce((s, i) => s + (i.qty || 1), 0);
}

export function initSync() {
  if ('BroadcastChannel' in window) {
    window.bc = new BroadcastChannel('myapp_cart');
    window.bc.addEventListener('message', (ev) => {
      if (ev.data?.type === 'cart:update') {
        localStorage.setItem(CART_KEY, JSON.stringify(ev.data.cart));
        window.dispatchEvent(new CustomEvent('cart:update', { detail: ev.data.cart }));
      }
    });
  }
}

export function updateCartResumen() {
  const cartRoot = document.getElementById('cartRoot');
  if(cartRoot){
    const cartJson = getCart().items;
    
    if (!cartJson.length) {
        cartRoot.innerHTML = '<p>Carrito vacío</p>';
    } 
    else {
      const ul = document.createElement('ul');
      let total = 0;
      cartJson.forEach(i => {
        const li = document.createElement('li');
        li.textContent = `
        ${i.name} 
        Price: $${i.price.toFixed(2)}
        `;
        ul.appendChild(li);
      });
      cartRoot.innerHTML = '';
      cartRoot.appendChild(ul);
      const p = document.createElement('p');
      p.textContent = `Total: $${total.toFixed(2)}`;
      cartRoot.appendChild(p);
    }
  }
}







