import {
  formatCollectionDate,
  formatCollectionTime,
} from '../domain/collection.ts';

export const BAKERY_EMAIL = 'earthmamaskitchen@gmail.com';

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

export function buildPreorderEnquirySubject() {
  return "Order enquiry - Earth Mama's Kitchen";
}

export function buildEventsEnquirySubject() {
  return "Events & Catering Enquiry - Earth Mama's Kitchen";
}

export function buildGeneralEnquirySubject() {
  return "General Enquiry - Earth Mama's Kitchen";
}

export function buildMailtoHref(subject, body, recipient = BAKERY_EMAIL) {
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildClipboardFallbackText(
  subject,
  body,
  recipient = BAKERY_EMAIL,
) {
  return `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
}

export function buildPreorderEnquiryBody(items, contactDetails) {
  const lines = [
    "Hi Earth Mama's Kitchen,",
    '',
    "I'd like to enquire about the following order.",
    '',
    'Contact details',
    '',
    `Name: ${contactDetails.name}`,
    `Phone: ${contactDetails.phone}`,
    '',
    'Collection preference',
    '',
    `Requested date: ${
      contactDetails.collectionDate
        ? formatCollectionDate(contactDetails.collectionDate)
        : 'Not provided'
    }`,
    `Requested time: ${
      contactDetails.collectionTime
        ? `${formatCollectionTime(contactDetails.collectionTime)} AEST`
        : 'Not provided'
    }`,
    '',
    'Order',
    '',
  ];

  items.forEach((item, index) => {
    const highlights = getHighlights(item);

    lines.push(`${index + 1}. ${item.product}`);
    if (highlights.size) lines.push(`Size: ${highlights.size}`);
    highlights.flavours.forEach((value) => lines.push(value));
    highlights.coloursOrStyle.forEach((value) => lines.push(value));
    if (highlights.addOns.length)
      lines.push(`Extras: ${highlights.addOns.join(', ')}`);
    highlights.notes.forEach((value) => lines.push(value));
    if (item.estimatedPrice?.amount) {
      lines.push(`Estimated price: ${formatAud(item.estimatedPrice.amount)}`);
    }
    if (item.containsAllergens?.length) {
      lines.push(`Contains: ${item.containsAllergens.join(', ')}`);
    }
    if (item.requiresReview) {
      lines.push('Review notice: Final quotation requires bakery review.');
    }
    if (item.referenceImageInstructions) {
      lines.push(
        `Reference image reminder: ${item.referenceImageInstructions}`,
      );
    }
    lines.push('');
  });

  lines.push(`Estimated order total: ${formatAud(getEstimatedTotal(items))}`);
  lines.push('');
  lines.push(
    'Could you please confirm availability, final pricing and collection details?',
  );
  lines.push('');
  lines.push('Thank you.');

  return lines.join('\n');
}

export function buildEventsEnquiryBody(enquiry) {
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

export function buildGeneralEnquiryBody(enquiry) {
  return [
    'GENERAL ENQUIRY',
    '===============',
    '',
    "Hello Earth Mama's Kitchen,",
    '',
    'I would like to send the following general enquiry.',
    '',
    'ENQUIRY DETAILS',
    '---------------',
    'Enquiry type: General enquiry',
    `Customer name: ${enquiry.name}`,
    `Customer email: ${enquiry.email}`,
    enquiry.phone
      ? `Customer phone: ${enquiry.phone}`
      : 'Customer phone: Not provided',
    '',
    'MESSAGE',
    '-------',
    enquiry.message,
    '',
    'MANUAL SEND ACKNOWLEDGEMENT',
    '---------------------------',
    'I understand this email was prepared by the website and must be sent manually from my own email client.',
    '',
    'Kind regards,',
    enquiry.name,
  ].join('\n');
}

function getHighlights(item) {
  const entries = getOptionEntries(item);
  const addOns = getAddOns(item);

  return {
    size: getOptionValue(item, [/size/i, /box/i, /cake/i, /bouquet/i]),
    flavours: entries
      .filter(({ label, key }) =>
        /flavou?r|sponge|filling|frosting/i.test(`${label} ${key}`),
      )
      .map(({ label, value }) => `${label}: ${value}`),
    coloursOrStyle: entries
      .filter(({ label, key }) =>
        /colo(u)?r|palette|style|occasion|decoration/i.test(`${label} ${key}`),
      )
      .map(({ label, value }) => `${label}: ${value}`),
    notes: entries
      .filter(({ label, key }) =>
        /note|description|message|avoid|brief|request/i.test(`${label} ${key}`),
      )
      .map(({ label, value }) => `${label}: ${value}`),
    date: getOptionValue(item, [/date/i, /collection/i, /event/i]),
    addOns,
  };
}

function getOptionEntries(item) {
  return Object.entries(item.options ?? {})
    .filter(
      ([key, value]) =>
        key !== 'addOns' && key !== 'collection-date' && hasDisplayValue(value),
    )
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
}

function getOptionValue(item, patterns) {
  return (
    getOptionEntries(item).find(({ label, key }) =>
      patterns.some((pattern) => pattern.test(label) || pattern.test(key)),
    )?.value ?? ''
  );
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
