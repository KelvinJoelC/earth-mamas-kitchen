import { updateCartResumen } from './cart.js';
import { clearCart, readCart } from './cart-state.js';

const BAKERY_EMAIL = 'earthmamaskitchen@gmail.com';
const AU_LOCAL_MOBILE_PATTERN = /^04\d{8}$/;

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

export function initConfirmOrderForm() {
  const form = document.getElementById('contactForm');
  if (!form || form.dataset.cartFormInitialized === 'true') return;

  form.dataset.cartFormInitialized = 'true';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const result = buildPreorderEmailFromForm(form);
    if (!result.ok) {
      showPreorderEmailStatus(result.message, 'error');
      focusPreorderIssue(form, result.message);
      return;
    }

    openPreorderMailto(result.subject, result.body);
    showPreorderEmailStatus(
      'Email draft prepared. Your email client has been opened. Please review the message, attach any reference images if required, then press Send. The bakery has not yet received your preorder.',
      'success',
    );
  });

  const copyButton = document.getElementById('copyPreorderEmail');
  if (copyButton?.dataset.copyInitialized === 'true') return;

  if (copyButton) {
    copyButton.dataset.copyInitialized = 'true';
    copyButton.addEventListener('click', async () => {
      const result = buildPreorderEmailFromForm(form);
      if (!result.ok) {
        showPreorderEmailStatus(result.message, 'error');
        focusPreorderIssue(form, result.message);
        return;
      }

      const copied = await copyPreorderEmail(result.subject, result.body);
      showPreorderEmailStatus(
        copied
          ? 'Preorder email copied. Please paste it into your email client, attach any reference images if required, and send it manually.'
          : 'Copy was not available in this browser. The complete preorder email is shown below so you can copy it manually.',
        copied ? 'success' : 'error',
      );
    });
  }
}

function buildPreorderEmailFromForm(form) {
  const formData = new FormData(form);
  const customer = {
    name: normalizeText(formData.get('name')),
    phone: normalizeText(formData.get('phone')),
    collectionPreference: normalizeText(formData.get('collectionPreference')),
  };
  const cart = readCart();
  const validationError = validatePreorderRequest(customer, cart);

  if (validationError) {
    return { ok: false, message: validationError };
  }

  return {
    ok: true,
    subject: `Preorder request - ${customer.name}`,
    body: buildPreorderEmailBody(customer, cart),
  };
}

function validatePreorderRequest(customer, cart) {
  if (!customer.name) {
    return 'Please enter your full name.';
  }

  if (!customer.name.includes(' ')) {
    return 'Please enter your full name, including first and last name.';
  }

  if (!AU_LOCAL_MOBILE_PATTERN.test(customer.phone)) {
    return 'Please enter a local Australian mobile number in the format 0412345678.';
  }

  if (!customer.collectionPreference) {
    return 'Please select a collection preference.';
  }

  if (!cart.length) {
    return 'Please add at least one preorder configuration before preparing the email.';
  }

  return '';
}

function buildPreorderEmailBody(customer, cart) {
  return [
    'PREORDER REQUEST',
    '================',
    '',
    "Hello Earth Mama's Kitchen,",
    '',
    'I would like to submit the following preorder request for review.',
    '',
    'CUSTOMER DETAILS',
    '----------------',
    `Full name: ${customer.name}`,
    `Mobile: ${customer.phone}`,
    `Collection preference: ${customer.collectionPreference}`,
    '',
    'IMPORTANT',
    '---------',
    'This is a preorder request only.',
    'Submitting this email does not confirm availability, pricing, payment, collection time or booking.',
    'The final quotation and confirmation will be provided after the bakery reviews the request.',
    '',
    'PRODUCT CONFIGURATIONS',
    '----------------------',
    ...cart.flatMap((item, index) => formatCartItem(item, index)),
    '',
    'ESTIMATED PRICE NOTICE',
    '----------------------',
    'Estimated prices are based on the current selected options and predefined add-ons.',
    'They do not include subjective design complexity, artistic interpretation, special requests or manual review adjustments.',
    'The final quotation will be confirmed by the bakery after review.',
    '',
    'ALLERGEN NOTICE',
    '---------------',
    'Products are prepared in a shared kitchen environment and cannot be guaranteed to be free from allergens or cross-contamination.',
    '',
    'REFERENCE IMAGES',
    '----------------',
    hasReferenceImageReminder(cart)
      ? 'I understand that reference images are not uploaded through the website. I will attach any reference images manually to this email before sending.'
      : 'No reference images are attached through the website. If the bakery needs visual references, I understand they can be provided manually by email.',
    '',
    'NEXT STEP',
    '---------',
    'Please review this preorder request and contact me to confirm availability, final pricing, payment details and collection arrangements.',
    '',
    'Kind regards,',
    customer.name,
  ].join('\n');
}

function formatCartItem(item, index) {
  const lines = [
    `${index + 1}. ${item.product}`,
    item.offeringId ? `   Offering ID: ${item.offeringId}` : '',
    item.workflowId ? `   Workflow: ${item.workflowId}` : '',
    '   Selected options:',
    ...formatSelectedOptions(item),
  ].filter(Boolean);

  if (item.estimatedPrice?.amount) {
    lines.push(
      `   Estimated price: ${currencyFormatter.format(
        item.estimatedPrice.amount / 100,
      )}`,
    );
  }

  if (item.containsAllergens?.length) {
    lines.push(`   Contains: ${item.containsAllergens.join(', ')}`);
  }

  if (item.requiresReview) {
    lines.push('   Review notice: Final quotation requires bakery review.');
  }

  if (item.referenceImageInstructions) {
    lines.push(
      `   Reference image reminder: ${item.referenceImageInstructions}`,
    );
  }

  lines.push('');
  return lines;
}

function formatSelectedOptions(item) {
  const optionLines = [];

  Object.entries(item.options ?? {}).forEach(([optionKey, optionValue]) => {
    if (!hasDisplayValue(optionValue)) return;

    if (optionKey === 'addOns') {
      const selectedAddOns = formatSelectedAddOns(
        optionValue,
        item.labels?.addOns ?? [],
      );

      if (selectedAddOns) optionLines.push(`   - Add-ons: ${selectedAddOns}`);
      return;
    }

    const label =
      item.labels?.options?.[optionKey]?.label ?? formatLabel(optionKey);
    const value = item.labels?.options?.[optionKey]?.value ?? optionValue;
    optionLines.push(`   - ${label}: ${formatValue(value)}`);
  });

  return optionLines.length ? optionLines : ['   - No options recorded.'];
}

function formatSelectedAddOns(optionValue, addOnLabels) {
  return Object.values(optionValue)
    .map((addOnId) => {
      const addOn = addOnLabels.find((label) => label.addOnId === addOnId);

      if (!addOn) return addOnId;

      return addOn.customerInput
        ? `${addOn.label} (${addOn.customerInput})`
        : addOn.label;
    })
    .filter(Boolean)
    .join(', ');
}

function openPreorderMailto(subject, body) {
  const href = `mailto:${BAKERY_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = href;
}

async function copyPreorderEmail(subject, body) {
  const text = `To: ${BAKERY_EMAIL}\nSubject: ${subject}\n\n${body}`;
  hideManualCopyFallback();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.error('clipboard write error', err);
  }

  showManualCopyFallback(text);
  return false;
}

function showManualCopyFallback(text) {
  const textarea = document.getElementById('preorderEmailFallback');
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  textarea.value = text;
  textarea.hidden = false;
  textarea.select();
}

function hideManualCopyFallback() {
  const textarea = document.getElementById('preorderEmailFallback');
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  textarea.value = '';
  textarea.hidden = true;
}

function showPreorderEmailStatus(message, type) {
  const status = document.getElementById('preorderEmailStatus');
  if (!status) return;

  status.textContent = message;
  status.dataset.status = type;

  if (type === 'success') {
    status.setAttribute('tabindex', '-1');
    status.focus();
  }
}

function focusPreorderIssue(form, message) {
  const fieldName = getFieldNameForPreorderMessage(message);
  const field = fieldName ? form.elements.namedItem(fieldName) : null;

  if (field instanceof HTMLElement) {
    field.focus();
    return;
  }

  const status = document.getElementById('preorderEmailStatus');
  status?.setAttribute('tabindex', '-1');
  status?.focus();
}

function getFieldNameForPreorderMessage(message) {
  if (message.includes('full name')) return 'name';
  if (message.includes('mobile number')) return 'phone';
  if (message.includes('collection preference')) return 'collectionPreference';
  return '';
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function hasReferenceImageReminder(cart) {
  return cart.some((item) => Boolean(item.referenceImageInstructions));
}

function hasDisplayValue(value) {
  return Boolean(value) && (!Array.isArray(value) || value.length > 0);
}

function formatValue(value) {
  return Array.isArray(value) ? value.join(', ') : value;
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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
