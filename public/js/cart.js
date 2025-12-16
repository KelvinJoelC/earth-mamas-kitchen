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

  const idx = cart.items.findIndex(i => i.id === item.id);
  if (idx === -1) cart.items.push(item);
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
  return cart.items.length;
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
    cartRoot.innerHTML = '';
    if (!cartJson.length) {
        cartRoot.innerHTML = '<p>Carrito vacío</p>';
    } 
    else {      
      cartJson.forEach(item => {
        cartRoot.appendChild(renderCartItems(item));
      });
    }
  }
}

export  function renderCartItems(item) {
  const card = document.createElement('div');
  card.className = 'order-card group';
  card.dataset.id = item.id;

  /* HEADER */
  const header = document.createElement('div');
  header.className = 'order-header';

  const title = document.createElement('h3');
  title.className = 'title';
  title.textContent = item.product;

  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.setAttribute('aria-label', 'Delete order');
  btn.textContent = '✕';

  btn.addEventListener('click', () => {
    handleDelete(item.id);
  });

  header.append(title, btn);

  /* OPTIONS */
  const optionsList = document.createElement('ul');
  optionsList.className = 'options';

  addOption(optionsList, 'Type', item.options.cupcakeType);
  addOption(optionsList, 'Buttercream', item.options.buttercreamStyle);
  addOption(optionsList, 'Qty', item.options.quantities);
  addOption(optionsList, 'Colors', item.options.colorPalettes);
  addOption(optionsList, 'Filling', item.options.fillings);
  addOption(optionsList, 'Presentation', item.options.presentation);

  card.append(header, optionsList);

  return card;
}

/* Helpers */
function addOption(list, label, value) {
  if (!value || value.length === 0) return;

  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = `${label}:`;

  li.append(span, ` ${value}`);
  list.appendChild(li);
}

function handleDelete(id) {
  console.log('Delete', id);
  // aquí:
  // removeFromCart(id);
  // updateCartResumen();
}
  







