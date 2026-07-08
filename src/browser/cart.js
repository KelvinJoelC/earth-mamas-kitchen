import { readCart, removeCartItem } from './cart-state.js';

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

export function updateCartResumen() {
  const cartRoot = document.getElementById('cartRoot');
  const cartDeleteButton = document.getElementById('clearBtn');
  const cartCountSummary = document.getElementById('cartCountSummary');
  const orderSubmission = document.getElementById('orderSubmission');

  if (!cartRoot) return;

  const cartItems = readCart();
  cartRoot.innerHTML = '';

  updateCartPageState({
    cartDeleteButton,
    cartCountSummary,
    orderSubmission,
    count: cartItems.length,
  });

  if (!cartItems.length) {
    cartRoot.appendChild(renderEmptyState());
    return;
  }

  cartItems.forEach((item, index) => {
    cartRoot.appendChild(renderCartItem(item, index));
  });
}

export function renderCartItem(item, index = 0) {
  const card = document.createElement('article');
  card.className = 'order-card';
  card.dataset.id = item.id;

  const header = document.createElement('div');
  header.className = 'order-header';

  const headingGroup = document.createElement('div');

  const eyebrow = document.createElement('p');
  eyebrow.className = 'order-card-eyebrow';
  eyebrow.textContent = `Configuration ${index + 1}`;

  const title = document.createElement('h3');
  title.className = 'title';
  title.textContent = item.product;

  headingGroup.append(eyebrow, title);

  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', `Remove ${item.product} from cart`);
  btn.textContent = 'Remove';

  btn.addEventListener('click', () => {
    removeCartItem(item.id);
  });

  header.append(headingGroup, btn);
  card.append(header);

  const optionsList = document.createElement('dl');
  optionsList.className = 'options';

  Object.entries(item.options ?? {}).forEach(([key, value]) => {
    if (!hasDisplayValue(value) || key === 'addOns') return;

    const label = item.labels?.options?.[key]?.label ?? formatLabel(key);
    const displayValue = item.labels?.options?.[key]?.value ?? value;
    addOption(optionsList, label, displayValue);
  });

  if (hasDisplayValue(item.options?.addOns)) {
    addAddOns(optionsList, item.options.addOns, item.labels?.addOns ?? []);
  }

  if (item.estimatedPrice?.amount) {
    addOption(
      optionsList,
      'Estimated price',
      currencyFormatter.format(item.estimatedPrice.amount / 100),
    );
  }

  if (item.containsAllergens?.length) {
    addOption(optionsList, 'Contains', item.containsAllergens);
  }

  card.append(optionsList);

  const notices = renderNotices(item);
  if (notices) card.append(notices);

  return card;
}

function updateCartPageState({
  cartDeleteButton,
  cartCountSummary,
  orderSubmission,
  count,
}) {
  const hasItems = count > 0;

  if (cartDeleteButton) cartDeleteButton.hidden = !hasItems;
  if (orderSubmission) orderSubmission.hidden = !hasItems;

  if (!cartCountSummary) return;

  cartCountSummary.textContent = hasItems
    ? `${count} saved preorder configuration${count === 1 ? '' : 's'}`
    : 'No saved preorder configurations yet.';
}

function renderEmptyState() {
  const card = document.createElement('div');
  card.className = 'order-card-empty';

  const title = document.createElement('h2');
  title.textContent = 'Your cart is empty';

  const message = document.createElement('p');
  message.textContent =
    'Start from the homepage catalogue to configure a product before sending a preorder request.';

  const link = document.createElement('a');
  link.className = 'ui-button ui-button--primary';
  link.href = '/';
  link.textContent = 'Browse products';

  card.append(title, message, link);
  return card;
}

function renderNotices(item) {
  const messages = [];

  if (item.requiresReview) {
    messages.push('Final quotation requires bakery review.');
  }

  if (item.containsAllergens?.length) {
    messages.push(
      'All products are prepared in a shared kitchen and cannot be guaranteed free from allergens.',
    );
  }

  if (item.referenceImageInstructions) {
    messages.push(item.referenceImageInstructions);
  }

  if (!messages.length) return null;

  const notices = document.createElement('aside');
  notices.className = 'order-card-notices';
  notices.setAttribute('aria-label', 'Important preorder notices');

  messages.forEach((message) => {
    const itemNotice = document.createElement('p');
    itemNotice.textContent = message;
    notices.appendChild(itemNotice);
  });

  return notices;
}

function addAddOns(list, value, addOnLabels) {
  const selectedAddOns = Object.values(value)
    .map((optionValue) => {
      const addOnLabel = addOnLabels.find(
        ({ addOnId }) => addOnId === optionValue,
      );

      if (!addOnLabel) return optionValue;

      return addOnLabel.customerInput
        ? `${addOnLabel.label} (${addOnLabel.customerInput})`
        : addOnLabel.label;
    })
    .filter(Boolean);

  addOption(list, 'Add-ons', selectedAddOns);
}

function addOption(list, label, value) {
  if (!hasDisplayValue(value)) return;

  const wrapper = document.createElement('div');

  const term = document.createElement('dt');
  term.textContent = label;

  const description = document.createElement('dd');
  description.textContent = Array.isArray(value) ? value.join(', ') : value;

  wrapper.append(term, description);
  list.appendChild(wrapper);
}

function hasDisplayValue(value) {
  return Boolean(value) && (!Array.isArray(value) || value.length > 0);
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
