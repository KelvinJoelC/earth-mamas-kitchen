import { readCart, removeCartItem } from './cart-state.js';

const BAKERY_EMAIL = 'earthmamaskitchen@gmail.com';
const INSTAGRAM_URL = 'https://www.instagram.com/earthmamaskitchen';

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

const offeringImages = {
  'floral-cupcake-bouquets': '/images/flowerCupcakesBouquet2.webp',
  'edible-blooms': '/images/cupcake.webp',
  'bespoke-cakes': '/images/cakes/mushroomLogCake.webp',
};

function renderOrderPage() {
  const root = document.getElementById('orderRoot');
  if (!root) return;

  const items = readCart();
  root.replaceChildren(
    items.length ? renderPopulatedOrder(items) : renderEmptyOrder(),
  );
}

function renderPopulatedOrder(items) {
  const page = createElement(
    'section',
    'bg-gradient-to-b from-white via-pink-50 to-white text-slate-950',
  );
  const columns = createElement(
    'div',
    'mx-auto grid w-[min(100%-2rem,76rem)] gap-8 overflow-visible pb-10 pt-24 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:items-start',
  );
  const main = createElement('main', 'grid min-w-0 gap-5 overflow-visible');
  main.append(renderOrderHero(), renderOrderItems(items));

  const relatedProducts = renderRelatedProducts();
  if (relatedProducts) {
    main.append(relatedProducts);
    queueMicrotask(() => {
      document.dispatchEvent(new Event('cart:related-products-rendered'));
    });
  }

  const aside = createElement(
    'aside',
    'grid h-fit min-w-0 self-start overflow-visible lg:sticky lg:top-24',
  );
  aside.append(renderOrderEnquiryPanel(items));

  columns.append(main, aside);
  page.append(columns);
  return page;
}

function renderEmptyOrder() {
  const page = createElement(
    'section',
    'bg-gradient-to-b from-white via-pink-50 to-white text-slate-950',
  );
  const main = createElement(
    'main',
    'mx-auto grid w-[min(100%-2rem,76rem)] gap-6 pb-10 pt-24',
  );
  const empty = createElement(
    'section',
    'mx-auto grid min-h-80 w-full place-items-center gap-5 border-y border-pink-200 py-16 text-center',
  );
  empty.setAttribute('aria-labelledby', 'empty-order-title');

  const title = createElement(
    'h1',
    'font-calistoga text-4xl text-slate-950',
    'Your order is waiting for a creation',
  );
  title.id = 'empty-order-title';

  empty.append(
    title,
    createElement(
      'p',
      'max-w-xl text-slate-600',
      'Start with the catalogue, customise a product, then return here to prepare your enquiry.',
    ),
    createLink(
      'ui-button ui-button--primary rounded-full px-6',
      '/',
      'Explore creations',
    ),
  );

  main.append(empty);
  page.append(main);
  return page;
}

function renderOrderHero() {
  const hero = createElement(
    'header',
    'grid gap-2 border-b border-pink-200 pb-5 text-left',
  );
  hero.append(
    createElement('p', 'configuration-kicker', 'Order review'),
    createElement(
      'h1',
      'font-calistoga text-4xl leading-tight md:text-5xl',
      'Curated order review',
    ),
    createElement(
      'p',
      'max-w-2xl text-base leading-relaxed text-slate-700',
      'Review your selected creations before sending your enquiry to Earth Mama’s Kitchen.',
    ),
  );
  return hero;
}

function renderOrderItems(items) {
  const section = createElement('section', 'grid gap-4');
  section.setAttribute('aria-label', 'Saved preorder configurations');

  items.forEach((item) => {
    const article = createElement(
      'article',
      'cart-review-item grid gap-3.5 rounded-[1.5rem] bg-white/85 p-3 shadow-sm sm:grid-cols-[minmax(7.5rem,11.5rem)_1fr]',
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
    section.append(article);
  });

  return section;
}

function renderImage(item, className) {
  const image = document.createElement('img');
  image.src = offeringImages[item.offeringId] ?? '/favicon.png';
  image.alt = item.product;
  image.className = className;
  image.loading = 'lazy';
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

function renderOrderEnquiryPanel(items) {
  const section = createElement(
    'section',
    'grid gap-4 border-y border-slate-300 py-4',
  );
  section.setAttribute('aria-labelledby', 'order-enquiry-title');

  const intro = createElement('div', 'grid gap-2.5');
  const title = createElement(
    'h2',
    'font-calistoga text-3xl text-slate-950',
    'Send your order enquiry',
  );
  title.id = 'order-enquiry-title';

  intro.append(
    title,
    createElement(
      'p',
      'max-w-xl text-[0.9375rem] leading-relaxed text-slate-600',
      'Choose the channel that feels easiest. These actions prepare your enquiry; they do not confirm availability, payment or booking.',
    ),
    renderTotalBlock(items),
  );

  const status = createElement('p', 'sr-only');
  status.id = 'orderEnquiryStatus';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  section.append(intro, renderInlineEmailActions(items), status);
  return section;
}

function renderTotalBlock(items) {
  const block = createElement('div', 'grid gap-1.5');
  const amount = createElement(
    'p',
    'text-4xl font-black leading-none text-slate-950',
    formatAud(getEstimatedTotal(items)),
  );
  amount.setAttribute('aria-live', 'polite');
  block.append(
    createElement(
      'p',
      'text-xs font-bold uppercase tracking-[0.14em] text-pink-800',
      'Estimated total',
    ),
    amount,
    createElement(
      'p',
      'max-w-2xl text-[0.8125rem] leading-relaxed text-slate-600',
      "No payment is required today. We'll confirm availability, final pricing and collection details before your order is booked.",
    ),
  );
  return block;
}

function renderInlineEmailActions(items) {
  const actions = createElement(
    'div',
    'grid content-start border-t border-slate-300',
  );
  const formId = 'order-email-form';
  const nameField = renderInlineContactField({
    id: 'order-customer-name',
    label: 'Your name',
    name: 'name',
    type: 'text',
    autocomplete: 'name',
    placeholder: 'Name of the person placing the enquiry',
    error: 'Please enter your name.',
  });
  const phoneField = renderInlineContactField({
    id: 'order-customer-phone',
    label: 'Phone number',
    name: 'phone',
    type: 'tel',
    autocomplete: 'tel',
    placeholder: 'Your preferred contact number',
    error: 'Please enter a phone number.',
  });

  const emailGroup = createElement(
    'div',
    'cart-inline-email-group border-b border-slate-300',
  );
  const toggle = createElement(
    'button',
    'cart-contact-action flex min-h-12 w-full items-center justify-between gap-3 border-b border-slate-300 px-0 py-2.5 text-slate-900 transition hover:text-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700 data-[primary=true]:font-bold',
  );
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', formId);
  toggle.append(
    renderContactActionContent(
      'Email',
      'Best for detailed orders and event enquiries.',
    ),
    createElement('span', 'text-lg', '+'),
  );

  const form = createElement('form', 'grid gap-2.5 pb-3');
  form.id = formId;
  form.hidden = true;
  form.noValidate = true;

  const submit = createElement(
    'button',
    'cart-send-action ui-button w-full border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:border-pink-400 hover:text-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700 disabled:cursor-not-allowed disabled:opacity-60',
    'Send enquiry',
  );
  submit.type = 'submit';

  form.append(nameField.wrapper, phoneField.wrapper, submit);
  toggle.addEventListener('click', () => {
    const isOpen = !form.hidden;
    form.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.querySelector('span:last-child').textContent = isOpen ? '+' : '−';
    if (!isOpen) nameField.input.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submit.disabled = true;

    const hasName = validateInlineEmailField(nameField);
    const hasPhone = validateInlineEmailField(phoneField);

    if (!hasName || !hasPhone) {
      submit.disabled = false;
      if (!hasName) nameField.input.focus();
      else phoneField.input.focus();
      return;
    }

    const contactMessage = buildContactMessage(items, {
      name: nameField.input.value.trim(),
      phone: phoneField.input.value.trim(),
    });
    const subject = encodeURIComponent("Order enquiry - Earth Mama's Kitchen");
    const encodedMessage = encodeURIComponent(contactMessage);
    window.location.href = `mailto:${BAKERY_EMAIL}?subject=${subject}&body=${encodedMessage}`;
    announce(
      'Your email draft has been prepared. Please review and send it manually.',
    );
    submit.disabled = false;
  });

  emailGroup.append(toggle, form);

  const instagram = createLink(
    'cart-contact-action flex min-h-12 w-full items-center justify-between gap-3 border-b border-slate-300 px-0 py-2.5 text-slate-900 transition hover:text-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700 data-[primary=true]:font-bold',
    INSTAGRAM_URL,
    '',
  );
  instagram.target = '_blank';
  instagram.rel = 'noopener noreferrer';
  instagram.append(
    renderContactActionContent(
      'Instagram',
      'Share visual inspiration with us.',
    ),
    createElement('span', 'text-lg', '→'),
  );

  actions.append(emailGroup, instagram);
  return actions;
}

function renderInlineContactField({
  id,
  label,
  name,
  type,
  autocomplete,
  placeholder,
  error,
}) {
  const wrapper = createElement('div', 'grid gap-1.5');
  const errorId = `${id}-error`;
  const labelElement = createElement(
    'label',
    'text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-slate-500',
    label,
  );
  labelElement.htmlFor = id;

  const input = document.createElement('input');
  input.id = id;
  input.name = name;
  input.type = type;
  input.required = true;
  input.autocomplete = autocomplete;
  input.placeholder = placeholder;
  input.setAttribute('aria-describedby', errorId);
  input.className =
    'min-h-10 w-full border-b border-slate-300 bg-transparent px-0 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-500 focus:border-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700';

  const errorElement = createElement(
    'p',
    'hidden text-xs leading-snug text-red-700',
    error,
  );
  errorElement.id = errorId;

  wrapper.append(labelElement, input, errorElement);
  return { wrapper, input, errorElement };
}

function validateInlineEmailField(field) {
  const isValid = field.input.value.trim().length > 0;
  field.input.setAttribute('aria-invalid', String(!isValid));
  field.errorElement.hidden = isValid;
  field.errorElement.classList.toggle('hidden', isValid);
  return isValid;
}

function renderContactActionContent(title, description) {
  const content = createElement('span', 'grid gap-0.5 text-left');
  content.append(
    createElement('span', 'text-sm font-bold', title),
    createElement(
      'span',
      'text-[0.6875rem] font-normal leading-snug text-slate-600',
      description,
    ),
  );
  return content;
}

function buildContactMessage(items, contactDetails) {
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
    if (highlights.date) lines.push(`Requested date: ${highlights.date}`);
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

function renderRelatedProducts() {
  const template = document.getElementById('orderRelatedProductsTemplate');

  if (
    !(template instanceof HTMLTemplateElement) ||
    !template.content.childElementCount
  ) {
    return null;
  }

  return template.content.cloneNode(true);
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

function createLink(className, href, text) {
  const link = createElement('a', className, text);
  link.href = href;
  return link;
}

function announce(message) {
  const status = document.getElementById('orderEnquiryStatus');
  if (status) status.textContent = message;
}

function initOrderPage() {
  renderOrderPage();
}

if (!window.__orderPageInitialized) {
  window.__orderPageInitialized = true;
  document.addEventListener('astro:page-load', initOrderPage);
  window.addEventListener('cart:update', renderOrderPage);
}

queueMicrotask(initOrderPage);
