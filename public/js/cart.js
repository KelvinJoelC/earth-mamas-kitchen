export const CART_KEY = 'myapp_cart';


function readStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('cart read error', err);
    return [];
  }
}

function writeStorage(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart:update', { detail: cart }));
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

  const idx = cart.findIndex(i => i.id === item.id);
  if (idx === -1) cart.push(item);
  writeStorage(cart);
  return cart;
}

export function removeItem(id) {
  const cart = readStorage();
  const newCart = cart.filter(i => i.id !== id);
  writeStorage(newCart);
  updateCartResumen();
  return newCart;
}

export function clearCart() {
  const cart = [];
  writeStorage(cart);
  return cart;
}

export function itemCount() {
  const cart = readStorage();
  return cart.length;
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
  const cartDeleteButon = document.getElementById('clearBtn');

  if(cartRoot){
    const cartJson = getCart();
    cartRoot.innerHTML = '';
    if (!cartJson.length) {
        cartDeleteButon.style.display = 'none';
        const card = document.createElement('div');
        card.className = 'order-card-empty';
        card.innerHTML = '<span>Your cart is empty.</span>'
        cartRoot.appendChild(card);
    } 
    else {      
      cartDeleteButon.style.display = 'block';
      cartJson.forEach(item => {
        cartRoot.appendChild(renderCartItem(item));
      });
    }
  }
}

export  function renderCartItem(item) {
  const card = document.createElement('div');
  card.className = 'order-card group';
  card.dataset.id = item.id;

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
    removeItem(item.id);
  });

  header.append(title, btn);

  const optionsList = document.createElement('ul');
  optionsList.className = 'options';

  Object.entries(item.options).forEach(([key, value]) => {
    if (value) {
      if (key != 'addOns') {
           addOption(optionsList, key, value);
      }
      else if(value.length > 0) {
        const div = document.createElement('div');
        const addOnsList = document.createElement('ul');
        addOnsList.className = 'add-ons';
        Object.entries(value).forEach(([optionKey, optionValue]) => {
            const span = document.createElement('span');
            const li = document.createElement('li');
            li.append(span, `- ${optionValue}`);
            addOnsList.appendChild(li);
            }  
        );
        const span = document.createElement('span');
          span.textContent = `${key}:`;
        div.appendChild(span, addOnsList);
        div.appendChild(addOnsList);
        optionsList.appendChild(div); 

      }
    }
  });

  card.append(header, optionsList);

  return card;
}

function addOption(list, label, value) {
  if (!value || value.length === 0) return;

  const li = document.createElement('li');

  const spanLabel = document.createElement('span');
  const spanValue = document.createElement('span');
  const br = document.createElement('br');
  spanLabel.textContent = `${label}:`;
  spanValue.textContent = ` ${value}`;

  li.append(spanLabel, spanValue);
  list.appendChild(li);
}
  







