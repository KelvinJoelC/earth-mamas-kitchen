import { readCart, removeCartItem } from './cart-state.js';

export function updateCartResumen() {
  const cartRoot = document.getElementById('cartRoot');
  const cartDeleteButton = document.getElementById('clearBtn');

  if (!cartRoot) return;

  const cartItems = readCart();
  cartRoot.innerHTML = '';

  if (!cartItems.length) {
    if (cartDeleteButton) cartDeleteButton.style.display = 'none';

    const card = document.createElement('div');
    card.className = 'order-card-empty';
    card.innerHTML = '<span>Your cart is empty.</span>';
    cartRoot.appendChild(card);
    return;
  }

  if (cartDeleteButton) cartDeleteButton.style.display = 'block';

  cartItems.forEach((item) => {
    cartRoot.appendChild(renderCartItem(item));
  });
}

export function renderCartItem(item) {
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
  btn.textContent = '×';

  btn.addEventListener('click', () => {
    removeCartItem(item.id);
  });

  header.append(title, btn);

  const optionsList = document.createElement('ul');
  optionsList.className = 'options';

  Object.entries(item.options).forEach(([key, value]) => {
    if (value) {
      if (key !== 'addOns') {
        const label = item.labels?.options?.[key]?.label ?? key;
        const displayValue = item.labels?.options?.[key]?.value ?? value;
        addOption(optionsList, label, displayValue);
      } else if (value.length > 0) {
        addAddOns(optionsList, value, item.labels?.addOns ?? []);
      }
    }
  });

  if (item.estimatedPrice?.amount) {
    addOption(
      optionsList,
      'Estimated price',
      new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }).format(item.estimatedPrice.amount / 100),
    );
  }

  if (item.containsAllergens?.length) {
    addOption(optionsList, 'Contains', item.containsAllergens);
  }

  if (item.requiresReview) {
    addOption(optionsList, 'Review', 'Final quotation requires bakery review');
  }

  if (item.referenceImageInstructions) {
    addOption(optionsList, 'Reference images', item.referenceImageInstructions);
  }

  card.append(header, optionsList);

  return card;
}

function addAddOns(list, value, addOnLabels) {
  const wrapper = document.createElement('div');
  const label = document.createElement('span');
  const addOnsList = document.createElement('ul');

  label.textContent = 'Add-ons:';
  addOnsList.className = 'add-ons';

  Object.values(value).forEach((optionValue) => {
    const addOnLabel =
      addOnLabels.find(({ addOnId }) => addOnId === optionValue)?.label ??
      optionValue;
    const li = document.createElement('li');
    li.append(`- ${addOnLabel}`);
    addOnsList.appendChild(li);
  });

  wrapper.append(label, addOnsList);
  list.appendChild(wrapper);
}

function addOption(list, label, value) {
  if (!value || value.length === 0) return;

  const li = document.createElement('li');

  const spanLabel = document.createElement('span');
  const spanValue = document.createElement('span');
  spanLabel.textContent = `${label}:`;
  spanValue.textContent = ` ${Array.isArray(value) ? value.join(', ') : value}`;

  li.append(spanLabel, spanValue);
  list.appendChild(li);
}
