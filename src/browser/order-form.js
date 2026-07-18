import {
  buildClipboardFallbackText,
  buildMailtoHref,
  buildPreorderEnquiryBody,
  buildPreorderEnquirySubject,
} from './email-content.js';
import { clearCart, readCart, removeCartItem } from './cart-state.js';

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

const offeringImages = {
  'floral-cupcake-bouquets': '/images/flowerCupcakesBouquet2.webp',
  'edible-blooms': '/images/cupcake.webp',
  'bespoke-cakes': '/images/cakes/mushroomLogCake.webp',
};

let orderPageController;

function renderOrderPage() {
  const items = readCart();

  updateOrderVisibility(items);
  renderOrderItems(items);
  updateEstimatedTotal(items);
}

function updateOrderVisibility(items) {
  const hasItems = items.length > 0;
  const orderItems = document.getElementById('orderItems');
  const orderLayout = document.getElementById('orderLayout');
  const emptyState = document.getElementById('orderEmptyState');
  const aside = document.getElementById('orderAside');
  const relatedProducts = document.getElementById('orderRelatedProducts');
  const clearCartButton = document.getElementById('orderClearCart');

  if (orderLayout) orderLayout.dataset.empty = String(!hasItems);
  if (orderItems) orderItems.hidden = !hasItems;
  if (emptyState) emptyState.hidden = hasItems;
  if (aside) aside.hidden = !hasItems;
  if (relatedProducts) relatedProducts.hidden = !hasItems;
  if (clearCartButton) clearCartButton.hidden = !hasItems;
  if (!hasItems) closeEmailForm();
}

function renderOrderItems(items) {
  const section = document.getElementById('orderItems');
  if (!section) return;

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const article = createElement(
      'article',
      'cart-review-item grid min-w-0 gap-3.5 rounded-[1.5rem] bg-white/85 p-3 shadow-sm sm:grid-cols-[minmax(7.5rem,11.5rem)_1fr]',
    );
    article.append(
      renderImage(
        item,
        'aspect-[4/5] w-full rounded-[1.25rem] bg-pink-50 object-contain p-2',
      ),
    );

    const content = createElement('div', 'grid gap-3 py-0.5');
    content.append(
      renderItemHeading(item),
      renderDetailList(item, 'grid gap-x-4 gap-y-2.5 md:grid-cols-2'),
    );

    const notices = renderNotices(item);
    if (notices) content.append(notices);

    content.append(renderItemFooter(item));
    article.append(content);
    fragment.append(article);
  });

  section.replaceChildren(fragment);
}

function renderImage(item, className) {
  const image = document.createElement('img');
  image.src = offeringImages[item.offeringId] ?? '/favicon.png';
  image.alt = item.product;
  image.width = 240;
  image.height = 300;
  image.className = className;
  image.loading = 'lazy';
  image.decoding = 'async';
  return image;
}

function renderItemHeading(item) {
  const heading = createElement(
    'div',
    'flex flex-wrap items-start justify-between gap-x-4 gap-y-1',
  );
  heading.append(
    createElement('h2', 'font-calistoga text-3xl text-slate-950', item.product),
    createElement(
      'p',
      'shrink-0 text-sm font-bold text-slate-950',
      formatAud(getItemAmount(item)),
    ),
  );
  return heading;
}

function renderDetailList(item, className = '') {
  const list = createElement('dl', className);
  const rows = getDetailRows(item);

  rows.forEach(({ key, label, value }) => {
    const isLongContent = isLongPersonalisationContent({ key, label, value });
    const row = createElement(
      'div',
      isLongContent ? 'grid gap-1 pt-1 md:col-span-2' : 'grid min-w-0 gap-1',
    );
    row.append(
      createElement(
        'dt',
        isLongContent
          ? 'text-xs font-bold uppercase tracking-[0.12em] text-slate-500/80'
          : 'text-xs font-bold uppercase tracking-[0.12em] text-slate-500',
        label,
      ),
      createElement(
        'dd',
        isLongContent
          ? 'whitespace-pre-line break-words text-sm leading-relaxed text-slate-800'
          : 'break-words text-sm leading-relaxed text-slate-800',
        value,
      ),
    );
    list.append(row);
  });

  return list;
}

function getDetailRows(item) {
  const rows = Object.entries(item.options ?? {})
    .filter(([key, value]) => key !== 'addOns' && hasDisplayValue(value))
    .map(([key, value]) => {
      const label = item.labels?.options?.[key]?.label ?? formatLabel(key);
      const displayValue = item.labels?.options?.[key]?.value ?? value;

      return {
        key,
        label,
        value: Array.isArray(displayValue)
          ? displayValue.join(', ')
          : String(displayValue),
      };
    });

  const addOns = getAddOns(item);
  if (addOns.length) {
    rows.push({ key: 'addOns', label: 'Add-ons', value: addOns.join(', ') });
  }

  if (item.containsAllergens?.length) {
    rows.push({
      key: 'containsAllergens',
      label: 'Contains',
      value: item.containsAllergens.join(', '),
    });
  }

  return sortDetailRows(rows);
}

function sortDetailRows(rows) {
  const shortRows = [];
  const longRows = [];

  rows.forEach((row) => {
    if (isLongPersonalisationContent(row)) {
      longRows.push(row);
      return;
    }

    shortRows.push(row);
  });

  return [...shortRows, ...longRows];
}

function renderNotices(item) {
  const messages = [];
  if (item.requiresReview)
    messages.push('Final quotation requires bakery review.');
  if (item.referenceImageInstructions)
    messages.push(item.referenceImageInstructions);
  if (item.containsAllergens?.length) {
    messages.push(
      'Prepared in a shared kitchen; allergen-free products cannot be guaranteed.',
    );
  }

  if (!messages.length) return null;

  const aside = createElement(
    'aside',
    'grid gap-2 border-l-4 border-pink-300 pl-4 text-sm leading-relaxed text-slate-600',
  );
  aside.setAttribute('aria-label', 'Important order notes');
  messages.forEach((message) => aside.append(createElement('p', '', message)));
  return aside;
}

function renderItemFooter(item) {
  const footer = createElement(
    'div',
    'flex flex-wrap items-center justify-between gap-2.5 border-t border-pink-100 pt-2.5',
  );
  const remove = createElement(
    'button',
    'cart-remove-action ui-button rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50',
    'Remove',
  );
  remove.type = 'button';
  remove.setAttribute('aria-label', `Remove ${item.product} from this order`);
  remove.addEventListener('click', () => removeCartItem(item.id));
  footer.append(remove);
  return footer;
}

function updateEstimatedTotal(items) {
  const amount = document.getElementById('orderEstimatedTotal');
  if (amount) amount.textContent = formatAud(getEstimatedTotal(items));
}

function initEmailForm() {
  const toggle = document.getElementById('orderEmailToggle');
  const toggleIcon = document.getElementById('orderEmailToggleIcon');
  const form = document.getElementById('order-email-form');
  const nameInput = document.getElementById('order-customer-name');
  const phoneInput = document.getElementById('order-customer-phone');
  const nameError = document.getElementById('order-customer-name-error');
  const phoneError = document.getElementById('order-customer-phone-error');
  const copyButton = document.getElementById('copyOrderEnquiryMessage');

  if (
    !(toggle instanceof HTMLButtonElement) ||
    !(form instanceof HTMLFormElement) ||
    !(nameInput instanceof HTMLInputElement) ||
    !(phoneInput instanceof HTMLInputElement) ||
    !(nameError instanceof HTMLElement) ||
    !(phoneError instanceof HTMLElement)
  ) {
    return;
  }

  if (toggle.dataset.initialized !== 'true') {
    toggle.dataset.initialized = 'true';
    toggle.addEventListener('click', () => {
      const isOpen = !form.hidden;
      form.hidden = isOpen;
      toggle.setAttribute('aria-expanded', String(!isOpen));
      if (toggleIcon) toggleIcon.textContent = isOpen ? '+' : '−';
      if (!isOpen) nameInput.focus();
    });
  }

  if (form.dataset.initialized === 'true') return;

  form.dataset.initialized = 'true';
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const submit = form.querySelector('button[type="submit"]');
    if (submit instanceof HTMLButtonElement) submit.disabled = true;

    const hasName = validateEmailField(nameInput, nameError);
    const hasPhone = validateEmailField(phoneInput, phoneError);

    if (!hasName || !hasPhone) {
      if (submit instanceof HTMLButtonElement) submit.disabled = false;
      if (!hasName) nameInput.focus();
      else phoneInput.focus();
      return;
    }

    const items = readCart();
    if (!items.length) {
      announce(
        'Please add at least one preorder configuration before sending an enquiry.',
      );
      if (submit instanceof HTMLButtonElement) submit.disabled = false;
      return;
    }

    const contactMessage = buildPreorderEnquiryBody(items, {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
    });
    hideManualCopyFallback();
    window.location.href = buildMailtoHref(
      buildPreorderEnquirySubject(),
      contactMessage,
    );
    announce(
      'Your email draft has been prepared. Please review and send it manually.',
    );

    if (submit instanceof HTMLButtonElement) submit.disabled = false;
  });

  if (
    copyButton instanceof HTMLButtonElement &&
    copyButton.dataset.initialized !== 'true'
  ) {
    copyButton.dataset.initialized = 'true';
    copyButton.addEventListener('click', async () => {
      const hasName = validateEmailField(nameInput, nameError);
      const hasPhone = validateEmailField(phoneInput, phoneError);

      if (!hasName || !hasPhone) {
        if (!hasName) nameInput.focus();
        else phoneInput.focus();
        return;
      }

      const items = readCart();
      if (!items.length) {
        announce(
          'Please add at least one preorder configuration before copying an enquiry.',
        );
        return;
      }

      const contactMessage = buildPreorderEnquiryBody(items, {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
      });
      const copied = await copyOrderEnquiryEmail(
        buildPreorderEnquirySubject(),
        contactMessage,
      );

      announce(
        copied
          ? 'Order enquiry copied. Please paste it into your email client, review it, and send it manually.'
          : 'Copy was not available in this browser. The complete order enquiry is shown below so you can copy it manually.',
      );
    });
  }
}

function initClearCartButton() {
  const clearCartButton = document.getElementById('orderClearCart');
  if (
    !(clearCartButton instanceof HTMLButtonElement) ||
    clearCartButton.dataset.initialized === 'true'
  ) {
    return;
  }

  clearCartButton.dataset.initialized = 'true';
  clearCartButton.addEventListener('click', () => {
    const confirmed = window.confirm(
      'Clear all saved preorder configurations?',
    );
    if (!confirmed) return;

    const result = clearCart();
    announce(
      result.ok
        ? 'Your cart has been cleared.'
        : 'We could not clear your cart. Please try again.',
    );
  });
}

function closeEmailForm() {
  const toggle = document.getElementById('orderEmailToggle');
  const toggleIcon = document.getElementById('orderEmailToggleIcon');
  const form = document.getElementById('order-email-form');

  if (
    !(toggle instanceof HTMLButtonElement) ||
    !(form instanceof HTMLFormElement)
  ) {
    return;
  }

  form.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  if (toggleIcon) toggleIcon.textContent = '+';
}

async function copyOrderEnquiryEmail(subject, body) {
  const text = buildClipboardFallbackText(subject, body);
  hideManualCopyFallback();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.error('order clipboard write error', error);
  }

  showManualCopyFallback(text);
  return false;
}

function showManualCopyFallback(text) {
  const textarea = document.getElementById('orderEnquiryFallback');
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  textarea.value = text;
  textarea.hidden = false;
  textarea.select();
}

function hideManualCopyFallback() {
  const textarea = document.getElementById('orderEnquiryFallback');
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  textarea.value = '';
  textarea.hidden = true;
}

function validateEmailField(input, errorElement) {
  const isValid = input.value.trim().length > 0;
  input.setAttribute('aria-invalid', String(!isValid));
  errorElement.hidden = isValid;
  errorElement.classList.toggle('hidden', isValid);
  return isValid;
}

function getAddOns(item) {
  const selectedAddOns = item.options?.addOns;
  if (!hasDisplayValue(selectedAddOns)) return [];

  return Object.values(selectedAddOns)
    .map((addOnId) => {
      const label = item.labels?.addOns?.find(
        (addOn) => addOn.addOnId === addOnId,
      );

      if (!label) return String(addOnId);
      return label.customerInput
        ? `${label.label} (${label.customerInput})`
        : label.label;
    })
    .filter(Boolean);
}

function isLongPersonalisationContent({ key, label, value }) {
  const combinedLabel = `${key} ${label}`;
  const longContentPattern =
    /note|message|description|instruction|allerg|additional|custom|brief|request|avoid|reference/i;

  return (
    longContentPattern.test(combinedLabel) ||
    value.length > 56 ||
    value.includes('\n')
  );
}

function getItemAmount(item) {
  return Number(item.estimatedPrice?.amount ?? 0);
}

function getEstimatedTotal(items) {
  return items.reduce((total, item) => total + getItemAmount(item), 0);
}

function formatAud(cents = 0) {
  return currencyFormatter.format(cents / 100);
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

function createElement(tag, className = '', text = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function announce(message) {
  const status = document.getElementById('orderEnquiryStatus');
  if (status) status.textContent = message;
}

function initOrderPage() {
  if (!document.getElementById('orderLayout')) {
    cleanupOrderPage();
    return;
  }

  cleanupOrderPage();
  orderPageController = new AbortController();

  initEmailForm();
  initClearCartButton();
  renderOrderPage();
  window.addEventListener('cart:update', renderOrderPage, {
    signal: orderPageController.signal,
  });
}

function cleanupOrderPage() {
  orderPageController?.abort();
  orderPageController = undefined;
}

document.addEventListener('astro:page-load', initOrderPage);
document.addEventListener('astro:before-swap', cleanupOrderPage);
queueMicrotask(initOrderPage);
