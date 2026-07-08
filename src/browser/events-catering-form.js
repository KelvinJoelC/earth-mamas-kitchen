const BAKERY_EMAIL = 'earthmamaskitchen@gmail.com';
const MESSAGE_MAX_LENGTH = 1000;

export function initEventsCateringForm() {
  const form = document.getElementById('eventsCateringForm');
  if (!form || form.dataset.eventsCateringInitialized === 'true') return;

  form.dataset.eventsCateringInitialized = 'true';
  applyPreferredDateLimit(form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const result = buildEventsCateringEmail(form);
    if (!result.ok) {
      showEventsStatus(result.message, 'error');
      return;
    }

    hideManualCopyFallback();
    openEventsMailto(result.subject, result.body);
    showEventsStatus(
      'Your Events & Catering email draft has been prepared. Please review it in your email client and send it manually. The bakery will only see it after you send the email.',
      'success',
    );
  });

  const copyButton = document.getElementById('copyEventsCateringMessage');
  if (copyButton?.dataset.copyInitialized === 'true') return;

  if (copyButton) {
    copyButton.dataset.copyInitialized = 'true';
    copyButton.addEventListener('click', async () => {
      const result = buildEventsCateringEmail(form);
      if (!result.ok) {
        showEventsStatus(result.message, 'error');
        return;
      }

      const copied = await copyEventsEmail(result.subject, result.body);
      showEventsStatus(
        copied
          ? 'Events & Catering enquiry copied. Please paste it into your email client, review it, and send it manually.'
          : 'Copy was not available in this browser. The complete Events & Catering enquiry is shown below so you can copy it manually.',
        copied ? 'success' : 'error',
      );
    });
  }
}

function applyPreferredDateLimit(form) {
  const preferredDate = form.elements.namedItem('preferredEventDate');
  if (!(preferredDate instanceof HTMLInputElement)) return;

  preferredDate.min = new Date().toISOString().slice(0, 10);
}

function buildEventsCateringEmail(form) {
  clearEventsErrors(form);

  const formData = new FormData(form);
  const enquiry = {
    name: normalizeText(formData.get('name')),
    email: normalizeText(formData.get('email')),
    phone: normalizeText(formData.get('phone')),
    eventType: normalizeText(formData.get('eventType')),
    preferredEventDate: normalizeText(formData.get('preferredEventDate')),
    message: normalizeMessage(formData.get('message')),
  };
  const errors = validateEventsEnquiry(enquiry, form);

  if (Object.keys(errors).length > 0) {
    showEventsErrors(form, errors);
    return {
      ok: false,
      message:
        'Please correct the highlighted fields before preparing your email.',
    };
  }

  return {
    ok: true,
    subject: "Events & Catering Enquiry - Earth Mama's Kitchen",
    body: buildEventsBody(enquiry),
  };
}

function validateEventsEnquiry(enquiry, form) {
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

  if (!enquiry.phone) {
    errors.phone = 'Please enter your phone number.';
  }

  if (!enquiry.eventType) {
    errors.eventType = 'Please select an event type.';
  }

  if (!enquiry.message) {
    errors.message = 'Please enter your event enquiry message.';
  } else if (enquiry.message.length > MESSAGE_MAX_LENGTH) {
    errors.message = `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`;
  }

  return errors;
}

function buildEventsBody(enquiry) {
  return [
    'EVENTS & CATERING ENQUIRY',
    '========================',
    '',
    "Hello Earth Mama's Kitchen,",
    '',
    'I would like to enquire about Events & Catering.',
    '',
    'ENQUIRY DETAILS',
    '---------------',
    'Enquiry type: Events & Catering',
    `Customer name: ${enquiry.name}`,
    `Customer email: ${enquiry.email}`,
    `Customer phone: ${enquiry.phone}`,
    `Event type: ${enquiry.eventType}`,
    enquiry.preferredEventDate
      ? `Preferred event date: ${enquiry.preferredEventDate}`
      : 'Preferred event date: Not provided',
    '',
    'MESSAGE',
    '-------',
    enquiry.message,
    '',
    'IMPORTANT',
    '---------',
    'This is an initial enquiry only.',
    'It does not confirm availability, pricing, payment or booking.',
    'The bakery will review the enquiry and contact me personally to discuss the event and prepare a tailored quotation.',
    '',
    'MANUAL SEND ACKNOWLEDGEMENT',
    '---------------------------',
    'I understand this email was prepared by the website and must be sent manually from my own email client.',
    '',
    'Kind regards,',
    enquiry.name,
  ].join('\n');
}

function openEventsMailto(subject, body) {
  const href = `mailto:${BAKERY_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = href;
}

async function copyEventsEmail(subject, body) {
  const text = `To: ${BAKERY_EMAIL}\nSubject: ${subject}\n\n${body}`;
  hideManualCopyFallback();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.error('events catering clipboard write error', error);
  }

  showManualCopyFallback(text);
  return false;
}

function showManualCopyFallback(text) {
  const textarea = document.getElementById('eventsCateringFallback');
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  textarea.value = text;
  textarea.hidden = false;
  textarea.select();
}

function hideManualCopyFallback() {
  const textarea = document.getElementById('eventsCateringFallback');
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  textarea.value = '';
  textarea.hidden = true;
}

function clearEventsErrors(form) {
  ['name', 'email', 'phone', 'eventType', 'message'].forEach((fieldName) => {
    const field = form.elements.namedItem(fieldName);
    const error = document.getElementById(errorIdFor(fieldName));

    if (field instanceof HTMLElement) {
      field.removeAttribute('aria-invalid');
    }

    if (error) {
      error.textContent = '';
    }
  });
}

function showEventsErrors(form, errors) {
  Object.entries(errors).forEach(([fieldName, message]) => {
    const field = form.elements.namedItem(fieldName);
    const error = document.getElementById(errorIdFor(fieldName));

    if (field instanceof HTMLElement) {
      field.setAttribute('aria-invalid', 'true');
    }

    if (error) {
      error.textContent = message;
    }
  });
}

function errorIdFor(fieldName) {
  const errorIds = {
    name: 'event-name-error',
    email: 'event-email-error',
    phone: 'event-phone-error',
    eventType: 'event-type-error',
    message: 'event-message-error',
  };

  return errorIds[fieldName];
}

function showEventsStatus(message, type) {
  const status = document.getElementById('eventsCateringStatus');
  if (!status) return;

  status.textContent = message;
  status.dataset.status = type;
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizeMessage(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function initEventsSection() {
  if (!document.querySelector('#eventsCateringForm')) return;
  initEventsCateringForm();
}

if (!window.__eventsCateringPageInitialized) {
  window.__eventsCateringPageInitialized = true;
  document.addEventListener('astro:page-load', initEventsSection);
}

initEventsSection();
