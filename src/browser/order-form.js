import { updateCartResumen } from './cart.js';
import { clearCart, readCart } from './cart-state.js';

export function initConfirmOrderForm() {
  const form = document.getElementById('contactForm');
  if (!form || form.dataset.cartFormInitialized === 'true') return;

  form.dataset.cartFormInitialized = 'true';
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (readCart().length === 0) {
      alert('Please add at least one preorder configuration before sending.');
      return;
    }

    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');

    const emailText = jsonToEmailText();

    const subject = encodeURIComponent(`${name} - New Order`);
    const body = encodeURIComponent(
      `G'day, My name is ${name}.\nMy phone number is ${phone}.\n I would like to order a cake... \n\n${emailText}`,
    );

    window.location.href = `mailto:earthmamaskitchen@gmail.com?subject=${subject}&body=${body}`;
  });
}

function jsonToEmailText() {
  let text = 'ORDER DETAILS\n------------------------\n\n';

  const data = readCart();
  Object.values(data).forEach((item) => {
    text += `${item.product}\n`;
    if (item.offeringId) text += `Offering ID: ${item.offeringId}\n`;
    if (item.workflowId) text += `Workflow: ${item.workflowId}\n`;

    text += 'Selections:\n';
    Object.entries(item.options ?? {}).forEach(([optionKey, optionValue]) => {
      if (!optionValue || optionValue.length === 0) return;

      if (optionKey === 'addOns') {
        const addOnLabels = item.labels?.addOns ?? [];
        const selectedAddOns = Object.values(optionValue)
          .map((addOnId) => {
            const addOn = addOnLabels.find(
              (label) => label.addOnId === addOnId,
            );
            return addOn?.customerInput
              ? `${addOn.label} (${addOn.customerInput})`
              : (addOn?.label ?? addOnId);
          })
          .join(', ');

        if (selectedAddOns) text += `  - Add-ons: ${selectedAddOns}\n`;
        return;
      }

      const label = item.labels?.options?.[optionKey]?.label ?? optionKey;
      const value = item.labels?.options?.[optionKey]?.value ?? optionValue;
      text += `  - ${label}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
    });

    if (item.estimatedPrice?.amount) {
      text += `Estimated Price: ${new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }).format(item.estimatedPrice.amount / 100)}\n`;
    }

    if (item.containsAllergens?.length) {
      text += `Contains: ${item.containsAllergens.join(', ')}\n`;
    }

    if (item.requiresReview) {
      text += 'Review: Final quotation requires bakery review.\n';
    }

    if (item.referenceImageInstructions) {
      text += `${item.referenceImageInstructions}\n`;
    }

    text += `\n------------------------\n`;
  });
  return text;
}

if (!window.__orderCartClearInitialized) {
  window.__orderCartClearInitialized = true;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#clearBtn');
    if (!btn) return;

    const shouldClear = confirm(
      'Clear all saved preorder configurations from your cart?',
    );

    if (!shouldClear) return;
    clearCart();
  });
}

function initCartPage() {
  if (!document.querySelector('#cart-resumen')) return;
  updateCartResumen();
  initConfirmOrderForm();
}

if (!window.__orderCartPageInitialized) {
  window.__orderCartPageInitialized = true;
  document.addEventListener('astro:page-load', initCartPage);
}

if (!window.__orderCartUpdateInitialized) {
  window.__orderCartUpdateInitialized = true;
  window.addEventListener('cart:update', () => updateCartResumen());
}
