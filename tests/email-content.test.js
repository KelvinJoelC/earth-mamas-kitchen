import { describe, expect, it } from 'vitest';

import {
  BAKERY_EMAIL,
  buildClipboardFallbackText,
  buildEventsEnquiryBody,
  buildEventsEnquirySubject,
  buildGeneralEnquiryBody,
  buildGeneralEnquirySubject,
  buildMailtoHref,
  buildPreorderEnquiryBody,
  buildPreorderEnquirySubject,
} from '../src/browser/email-content.js';

const cartItem = {
  id: 'item-1',
  product: 'Bespoke Cakes',
  offeringId: 'bespoke-cakes',
  workflowId: 'design-brief-preorder',
  leadTimeDays: 5,
  options: {
    'cake-size': '6-inch-round',
    'sponge-flavour': 'vanilla',
    filling: 'raspberry-jam',
    frosting: 'buttercream',
    'design-description': 'Pink garden cake with soft floral details.',
    addOns: ['gift-message', 'edible-image'],
  },
  labels: {
    options: {
      'cake-size': { label: 'Cake Size', value: '6" Round Cake' },
      'sponge-flavour': { label: 'Sponge Flavour', value: 'Vanilla' },
      filling: { label: 'Filling', value: 'Raspberry Jam' },
      frosting: { label: 'Frosting', value: 'Buttercream' },
      'design-description': {
        label: 'Design Description',
        value: 'Pink garden cake with soft floral details.',
      },
    },
    addOns: [
      { addOnId: 'gift-message', label: 'Gift Message' },
      {
        addOnId: 'edible-image',
        label: 'Edible Image',
        customerInput: 'Birthday photo',
      },
    ],
  },
  estimatedPrice: {
    kind: 'estimate',
    currency: 'AUD',
    amount: 12500,
    components: [],
    finalQuotationRequired: true,
  },
  containsAllergens: ['Gluten', 'Milk', 'Eggs'],
  requiresReview: true,
  referenceImageInstructions:
    'Please attach reference images when confirming your order by email.',
};

describe('email content generation', () => {
  it('builds readable preorder enquiry content from stable cart payloads', () => {
    const body = buildPreorderEnquiryBody([cartItem], {
      name: 'Alex Customer',
      phone: '0412345678',
      collectionDate: '2026-02-16',
      collectionTime: '09:30',
    });

    expect(buildPreorderEnquirySubject()).toBe(
      "Order enquiry - Earth Mama's Kitchen",
    );
    expect(body).toContain('Name: Alex Customer');
    expect(body).toContain('Phone: 0412345678');
    expect(body).toContain('Requested date: Monday 16 February 2026');
    expect(body).toContain('Requested time: 9:30 am AEST');
    expect(body).toContain('1. Bespoke Cakes');
    expect(body).toContain('Size: 6" Round Cake');
    expect(body).toContain('Sponge Flavour: Vanilla');
    expect(body).toContain(
      'Extras: Gift Message, Edible Image (Birthday photo)',
    );
    expect(body).toContain('Estimated price: $125.00');
    expect(body).toContain('Estimated order total: $125.00');
    expect(body).toContain('Contains: Gluten, Milk, Eggs');
    expect(body).toContain(
      'Reference image reminder: Please attach reference images when confirming your order by email.',
    );
  });

  it('builds Events & Catering email content without claiming booking confirmation', () => {
    const body = buildEventsEnquiryBody({
      name: 'Sam Event',
      email: 'sam@example.com',
      phone: '0412345678',
      eventType: 'Birthday',
      preferredEventDate: '',
      message: 'Planning a small celebration.',
    });

    expect(buildEventsEnquirySubject()).toBe(
      "Events & Catering Enquiry - Earth Mama's Kitchen",
    );
    expect(body).toContain('Enquiry type: Events & Catering');
    expect(body).toContain('Preferred event date: Not provided');
    expect(body).toContain('This is an initial enquiry only.');
    expect(body).toContain(
      'It does not confirm availability, pricing, payment or booking.',
    );
    expect(body).not.toMatch(/booking confirmed|payment received/i);
  });

  it('builds general enquiry email content with optional phone fallback', () => {
    const body = buildGeneralEnquiryBody({
      name: 'Taylor',
      email: 'taylor@example.com',
      phone: '',
      message: 'Do you offer weekend collection?',
    });

    expect(buildGeneralEnquirySubject()).toBe(
      "General Enquiry - Earth Mama's Kitchen",
    );
    expect(body).toContain('Enquiry type: General enquiry');
    expect(body).toContain('Customer phone: Not provided');
    expect(body).toContain(
      'I understand this email was prepared by the website and must be sent manually from my own email client.',
    );
    expect(body).not.toMatch(/message sent|enquiry received|delivered/i);
  });

  it('encodes mailto links and clipboard fallback content without sending messages', () => {
    const subject = buildGeneralEnquirySubject();
    const body = buildGeneralEnquiryBody({
      name: 'Taylor',
      email: 'taylor@example.com',
      phone: '',
      message: 'Hello & thank you.',
    });

    expect(buildMailtoHref(subject, body)).toContain(
      `mailto:${BAKERY_EMAIL}?subject=General%20Enquiry`,
    );
    expect(buildMailtoHref(subject, body)).toContain('body=GENERAL%20ENQUIRY');
    expect(buildMailtoHref(subject, body)).toContain('%26%20thank%20you');

    expect(buildClipboardFallbackText(subject, body)).toMatch(
      new RegExp(`^To: ${BAKERY_EMAIL}\\nSubject: ${subject}\\n\\n`),
    );
  });
});
