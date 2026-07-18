import {
  buildClipboardFallbackText,
  buildGeneralEnquiryBody,
  buildGeneralEnquirySubject,
  buildMailtoHref,
} from './email-content.js';

const MESSAGE_MAX_LENGTH = 1000;

let contactFormController;

export function initGeneralContactForm() {
  const form = document.getElementById('generalContactForm');
  if (!(form instanceof HTMLFormElement)) return;

  cleanupGeneralContactForm();

  contactFormController = new AbortController();
  const { signal } = contactFormController;

  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();

      const result = buildGeneralEnquiryEmail(form);
      if (!result.ok) {
        showContactStatus(result.message, 'error');
        return;
      }

      hideManualCopyFallback();
      openGeneralEnquiryMailto(result.subject, result.body);
      showContactStatus(
        'Your email draft has been prepared. Please review it in your email client and send it manually. The bakery will only see it after you send the email.',
        'success',
      );
    },
    { signal },
  );

  const copyButton = document.getElementById('copyGeneralContactMessage');

  if (copyButton instanceof HTMLButtonElement) {
    copyButton.addEventListener(
      'click',
      async () => {
        const result = buildGeneralEnquiryEmail(form);
        if (!result.ok) {
          showContactStatus(result.message, 'error');
          return;
        }

        const copied = await copyGeneralEnquiryEmail(
          result.subject,
          result.body,
        );

        showContactStatus(
          copied
            ? 'General enquiry email copied. Please paste it into your email client, review it, and send it manually.'
            : 'Copy was not available in this browser. The complete general enquiry email is shown below so you can copy it manually.',
          copied ? 'success' : 'error',
        );
      },
      { signal },
    );
  }
}

export function cleanupGeneralContactForm() {
  contactFormController?.abort();
  contactFormController = undefined;
}

function buildGeneralEnquiryEmail(form) {
  clearContactErrors(form);

  const formData = new FormData(form);
  const enquiry = {
    name: normalizeText(formData.get('name')),
    email: normalizeText(formData.get('email')),
    phone: normalizeText(formData.get('phone')),
    message: normalizeMessage(formData.get('message')),
  };
  const errors = validateGeneralEnquiry(enquiry, form);

  if (Object.keys(errors).length > 0) {
    showContactErrors(form, errors);
    return {
      ok: false,
      message:
        'Please correct the highlighted fields before preparing your email.',
    };
  }

  return {
    ok: true,
    subject: buildGeneralEnquirySubject(),
    body: buildGeneralEnquiryBody(enquiry),
  };
}

function validateGeneralEnquiry(enquiry, form) {
  const errors = {};
  const emailInput = form.elements.namedItem('email');

  if (!enquiry.name) {
    errors.name = 'Please enter your name.';
  }

  if (!enquiry.email) {
    errors.email = 'Please enter your email address.';
  } else if (
    emailInput instanceof HTMLInputElement &&
    !emailInput.validity.valid
  ) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!enquiry.message) {
    errors.message = 'Please enter your message.';
  } else if (enquiry.message.length > MESSAGE_MAX_LENGTH) {
    errors.message = `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`;
  }

  return errors;
}

function openGeneralEnquiryMailto(subject, body) {
  window.location.href = buildMailtoHref(subject, body);
}

async function copyGeneralEnquiryEmail(subject, body) {
  const text = buildClipboardFallbackText(subject, body);
  hideManualCopyFallback();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.error('contact clipboard write error', error);
  }

  showManualCopyFallback(text);
  return false;
}

function showManualCopyFallback(text) {
  const textarea = document.getElementById('generalContactFallback');
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  textarea.value = text;
  textarea.hidden = false;
  textarea.select();
}

function hideManualCopyFallback() {
  const textarea = document.getElementById('generalContactFallback');
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  textarea.value = '';
  textarea.hidden = true;
}

function clearContactErrors(form) {
  ['name', 'email', 'message'].forEach((fieldName) => {
    const field = form.elements.namedItem(fieldName);
    const error = document.getElementById(`contact-${fieldName}-error`);

    if (field instanceof HTMLElement) {
      field.removeAttribute('aria-invalid');
    }

    if (error) {
      error.textContent = '';
    }
  });
}

function showContactErrors(form, errors) {
  let firstInvalidField = null;

  Object.entries(errors).forEach(([fieldName, message]) => {
    const field = form.elements.namedItem(fieldName);
    const error = document.getElementById(`contact-${fieldName}-error`);

    if (field instanceof HTMLElement) {
      field.setAttribute('aria-invalid', 'true');
      firstInvalidField ??= field;
    }

    if (error) {
      error.textContent = message;
    }
  });

  firstInvalidField?.focus();
}

function showContactStatus(message, type) {
  const status = document.getElementById('generalContactStatus');
  if (!status) return;

  status.textContent = message;
  status.dataset.status = type;

  if (type === 'success') {
    status.setAttribute('tabindex', '-1');
    status.focus();
  }
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizeMessage(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function initContactSection() {
  if (!document.querySelector('#generalContactForm')) return;
  initGeneralContactForm();
}

function registerContactLifecycle() {
  document.addEventListener('astro:page-load', initContactSection);
  document.addEventListener('astro:before-swap', cleanupGeneralContactForm);
}

registerContactLifecycle();
queueMicrotask(initContactSection);
