# Earth Mama's Kitchen — Business Requirements

**Status:** Approved for v1.0.0  
**Product Owner:** Kelvin Carreño Espin  
**Approval date:** 5 July 2026  
**Release target:** v1.0.0 — 31 July 2026

## 1. Purpose

This document defines the approved business model, catalogue, customer workflows, pricing rules, operational policies, and documented assumptions for Earth Mama's Kitchen v1.0.0.

Earth Mama's Kitchen is a professional portfolio case study based on a realistic premium artisan bakery. The original bakery and Silvia's story remain the inspiration for the brand, but this website is not an active client engagement and does not represent a business currently operated by her.

The Product Owner is the final decision-maker. Version 1.0.0 is the final portfolio baseline; no post-v1 roadmap is committed.

## 2. Business overview

Earth Mama's Kitchen represents a premium artisan bakery specialising in handcrafted celebration cakes, floral cupcake bouquets, edible blooms, and edible gifts.

The business competes on quality, creativity, presentation, reliability, and personalised service rather than price.

The core promise is:

> Beautiful handcrafted creations made especially for your celebration, with a simple and stress-free preorder experience.

The operating model is preorder-only from a commercial kitchen. There is no walk-in retail service. Products are freshly made to order to support quality, customisation, and reduced food waste.

## 3. Target audience

The primary audience is customers in Cairns, Queensland who value quality and personalisation over the lowest price.

Typical occasions include:

- birthdays;
- baby showers and gender reveals;
- anniversaries and engagements;
- graduations;
- Mother's Day and gifting occasions;
- office, school, family, and community celebrations;
- weddings and corporate events through consultation.

Customers commonly discover the bakery through word of mouth, Instagram, Facebook, or local search.

The website must build confidence for first-time visitors and provide a convenient path for returning customers.

## 4. Scope and terminology

### 4.1 Product Offerings

The v1 catalogue contains exactly three configurable Product Offerings:

1. Floral Cupcake Bouquets
2. Edible Blooms
3. Bespoke Cakes

These are the actual offerings, not categories containing separately named products.

### 4.2 Service Offering

Events & Catering is a consultation-led Service Offering. It is not a standard product and is not added to the cart.

### 4.3 Workflow Types

- **guided-preorder:** structured configuration for Floral Cupcake Bouquets and Edible Blooms;
- **design-brief-preorder:** structured cake configuration plus a free-form design brief for Bespoke Cakes;
- **custom-enquiry:** initial consultation request for Events & Catering.

### 4.4 Option Groups

Reusable Option Groups include:

- sizes;
- cupcake flavours;
- sponge flavours;
- fillings;
- frostings;
- colour palettes;
- decoration styles;
- occasions;
- add-ons;
- design brief fields;
- dietary notes;
- collection details;
- enquiry fields.

## 5. Domain architecture principles

The domain must be configuration-driven and strongly typed without becoming a generic form engine, CMS, or database.

Reusable catalogues own the identity and default data for shared concepts. Product Offerings reference catalogue entries and define how supported entries behave in that offering.

Business rules must use a limited set of declarative operations:

- requires;
- excludes;
- selection limit;
- automatic selection;
- redirect to custom enquiry;
- requires review.

Global policy rules, workflow rules, offering rules, and compatibility rules must remain separate.

Money must be stored as integer AUD cents.

## 6. Product Offering requirements

### 6.1 Floral Cupcake Bouquets

Floral Cupcake Bouquets are premium gift products arranged and wrapped to resemble floral bouquets. The emphasis is presentation and gifting rather than group catering.

#### Sizes and estimated base prices

| Size           | Cupcakes | Flavour limit | Estimated base price |
| -------------- | -------: | ------------: | -------------------: |
| Small Bouquet  |        7 |             1 |              AUD $65 |
| Medium Bouquet |       12 |       Up to 2 |              AUD $95 |
| Large Bouquet  |       19 |       Up to 3 |             AUD $145 |

When multiple flavours are selected, cupcakes are distributed as evenly as possible.

#### Design workflow

- Colour Palette is required.
- Custom Colours reveals a required free-text colour description.
- Design Notes are optional, maximum 300 characters.
- Reference images are not uploaded through the website.
- Customers are reminded to attach inspiration images manually to the generated email.
- References and notes are guidance only and do not guarantee exact reproduction.

#### Lead time

Minimum notice is three calendar days.

### 6.2 Edible Blooms

Edible Blooms are decorated cupcake collections intended for sharing. They do not include bouquet-style presentation.

#### Sizes and estimated base prices

| Size            | Cupcakes | Flavour limit | Estimated base price |
| --------------- | -------: | ------------: | -------------------: |
| Small Box       |        6 |             1 |              AUD $35 |
| Standard Box    |       12 |       Up to 2 |              AUD $65 |
| Party Box       |       24 |       Up to 3 |             AUD $120 |
| Celebration Box |       48 |       Up to 4 |             AUD $220 |

Custom quantities are not supported. Requests above 48 cupcakes are redirected to Events & Catering.

#### Design workflow

- Colour Palette is required.
- Decoration Style is required.
- Available styles are Simple Buttercream, Floral Buttercream, Sprinkles, Elegant, and Mixed Decorations.
- Occasion is optional.
- Design Notes are optional, maximum 300 characters.
- Inspiration images must be attached manually to the generated email.
- The bakery retains artistic discretion.

#### Lead time

Minimum notice is two calendar days.

### 6.3 Shared cupcake flavours

The active v1 flavour catalogue is:

- Vanilla;
- Chocolate;
- Red Velvet;
- Lemon;
- Cookies & Cream;
- Salted Caramel.

Seasonal Special is not included in v1.

### 6.4 Shared colour palettes

Active palettes are:

- Soft Pastels;
- Pink & White;
- Blue Tones;
- Neutral;
- Bright & Colourful;
- Custom Colours.

Autumn Colours and Christmas Colours are inactive and not selectable in the v1.0.0 release. V1 does not implement an automatic seasonal activation schedule.

### 6.5 Bespoke Cakes

Bespoke Cakes use a design-brief preorder workflow. The form collects a request for review rather than a guaranteed specification.

#### Sizes and estimated base prices

| Size              | Approximate servings | Estimated base price |
| ----------------- | -------------------- | -------------------: |
| 6-inch round      | 15–20                |             AUD $110 |
| 8-inch round      | 40–50                |             AUD $170 |
| Two-tier 6+8-inch | Approximately 55     |             AUD $260 |

#### Guided-preorder limits

The guided workflow supports:

- no more than two tiers;
- no more than approximately 60 servings;
- no venue delivery or setup;
- no complex structural designs;
- no wedding-scale or large corporate requirements.

Requests outside these limits are redirected to Events & Catering.

#### Sponge flavours

Standard:

- Vanilla;
- Chocolate;
- Chai Spiced Carrot;
- Hummingbird.

Dietary adaptations:

- Chocolate Vegan;
- Orange Almond (Gluten Friendly).

#### Fillings

- Raspberry Jam;
- Biscoff;
- Nutella.

#### Frostings

- Buttercream;
- Vegan Buttercream.

#### Compatibility rules

When Chocolate Vegan is selected:

- Vegan Buttercream is automatically selected and is the only available frosting;
- Raspberry Jam is the only available filling;
- Biscoff and Nutella are unavailable.

When Orange Almond (Gluten Friendly) is selected:

- Raspberry Jam is the only available filling;
- Biscoff and Nutella are unavailable;
- Buttercream and Vegan Buttercream remain available.

Both dietary sponge adaptations have a zero-cent surcharge. They remain subject to review and the shared-kitchen warning.

#### Design brief

Required:

- Occasion;
- Design Description, maximum 600 characters.

Optional:

- Cake Message, maximum 50 characters;
- Elements to Avoid, maximum 250 characters;
- dietary requirements, maximum 300 characters;
- reference images attached manually to the email.

Cake Message is writing placed on the cake. Gift Message is a separate card or note supplied with the order.

#### Lead time

Minimum notice is five calendar days.

## 6.6 Product imagery policy

Each Product Offering must have:

- one representative primary image;
- optional curated supporting images when they add meaningful product context;
- imagery that clearly distinguishes gifting bouquets, sharing boxes, and bespoke cakes.

Catalogue imagery communicates the offering's style and presentation. It does not guarantee that a future handcrafted order will exactly reproduce the photographed design.

Only imagery with appropriate permission or usage rights may be published. Images must not imply that the current case study is an active business operated by Silvia.

Customer reference images are never uploaded to or stored by the website. Customers attach them manually to the generated email.

Meaningful images require contextual alternative text. Decorative images use empty alternative text. Asset optimisation, responsive sources, and final production-image selection are delivered under the dedicated browsing and visual-asset issues.

## 7. Global Add-on Catalogue

The Global Add-on Catalogue owns:

- stable ID;
- customer-facing name;
- description;
- default price in AUD cents;
- global availability;
- default requiresReview value.

All 15 v1 add-ons are globally available.

Stable IDs use lowercase kebab-case and are immutable once referenced by persisted cart data.

| Stable ID                   | Add-on                      | Description                                                              | Default cents |     Display price | Review |
| --------------------------- | --------------------------- | ------------------------------------------------------------------------ | ------------: | ----------------: | :----: |
| gift-message                | Gift Message                | A personalised printed card or handwritten note supplied with the order. |             0 |            AUD $0 |   No   |
| personalised-acrylic-topper | Personalised Acrylic Topper | A custom acrylic topper with a name, age, or short celebration message.  |          1200 |           AUD $12 |  Yes   |
| personalised-ribbon         | Personalised Ribbon         | A ribbon personalised with a short name or celebratory message.          |           500 |            AUD $5 |   No   |
| fairy-lights                | Fairy Lights                | Battery-operated decorative lights used to enhance presentation.         |           800 |            AUD $8 |   No   |
| premium-bouquet-wrapping    | Premium Bouquet Wrapping    | Upgraded bouquet wrapping using premium materials and finishes.          |          1000 |           AUD $10 |   No   |
| premium-gift-bag            | Premium Gift Bag            | A reusable gift bag that improves presentation and transport.            |           800 |            AUD $8 |   No   |
| premium-cupcake-packaging   | Premium Cupcake Packaging   | An upgraded presentation box for Edible Blooms.                          |           600 |            AUD $6 |   No   |
| custom-cupcake-toppers      | Custom Cupcake Toppers      | One coordinated set of personalised toppers for the selected order.      |          1500 | AUD $15 per order |  Yes   |
| premium-cupcake-decorations | Premium Cupcake Decorations | Premium sprinkles, edible pearls, metallic details, or similar finishes. |          1000 |           AUD $10 |   No   |
| edible-image                | Edible Image                | A printed edible decoration based on customer-supplied artwork.          |          1500 |           AUD $15 |  Yes   |
| chocolate-drip              | Chocolate Drip              | A standard decorative chocolate drip finish.                             |           800 |            AUD $8 |   No   |
| sugar-flowers               | Sugar Flowers               | A handcrafted set of decorative sugar flowers.                           |          2500 |           AUD $25 |  Yes   |
| fresh-flowers               | Fresh Flowers               | Seasonal fresh flowers selected for decorative cake presentation.        |          2000 |           AUD $20 |  Yes   |
| macarons                    | Macarons                    | A predefined quantity of macarons used as cake decoration.               |          1800 |           AUD $18 |   No   |
| edible-gold-leaf            | Edible Gold Leaf            | Edible gold leaf applied within a predefined decorative scope.           |          1500 |           AUD $15 |   No   |

An add-on marked requiresReview is included in the estimate at its default price, but the bakery may revise or reject it during review.

### 7.1 Product Offering compatibility

#### Floral Cupcake Bouquets

- Gift Message;
- Personalised Acrylic Topper;
- Personalised Ribbon;
- Fairy Lights;
- Premium Bouquet Wrapping;
- Premium Gift Bag.

#### Edible Blooms

- Gift Message;
- Premium Cupcake Packaging;
- Custom Cupcake Toppers;
- Premium Cupcake Decorations.

#### Bespoke Cakes

- Gift Message;
- Personalised Acrylic Topper;
- Edible Image;
- Chocolate Drip;
- Sugar Flowers;
- Fresh Flowers;
- Macarons;
- Edible Gold Leaf.

No other combinations are permitted.

### 7.2 Add-on input rules

Gift Message:

- maximum 250 characters;
- multiline;
- trimmed;
- cannot be blank or whitespace-only;
- supports Unicode and emoji.

Personalised Ribbon:

- maximum 30 characters;
- single line;
- trimmed;
- cannot be blank;
- letters, numbers, and common punctuation;
- no emoji or line breaks.

Personalised Acrylic Topper:

- maximum 50 characters;
- single line;
- requires review.

Custom Cupcake Toppers:

- maximum 100 characters;
- single line;
- logos or artwork are attached manually to the email;
- default price applies once per order.

Fairy Lights:

- decorative and non-edible;
- must be removed before consumption;
- battery components must be kept away from children;
- colour and style may vary.

Fresh Flowers:

- decorative and non-edible;
- must be removed before consumption;
- selection and availability require review.

## 8. Pricing

All prices are displayed exclusively in Australian Dollars.

The Estimated Price includes only objective configured values:

- selected size;
- configured base price;
- selected add-ons;
- predefined option surcharges.

It must not calculate:

- artistic complexity;
- labour time;
- interpretation of references;
- unusual materials;
- revisions;
- free-form special requests.

Each cart item displays its Estimated Price. The cart displays an Estimated Total.

Customer-facing explanation:

> This estimate is based on your current selections. Your final quotation will be confirmed after we review your design requirements, availability and any special requests.

GST registration, separate tax display, currency conversion, and online payment logic are outside scope.

## 9. Dietary and allergen requirements

### 9.1 Cupcake dietary requests

Floral Cupcake Bouquets and Edible Blooms do not expose dietary adaptations as selectable options.

Customers may enter requests such as vegan, dairy-free, gluten-friendly, nut-free, or egg-free in dietary notes.

- no automatic dietary surcharge;
- no automatic price change;
- no guarantee of availability;
- every request is manually reviewed;
- additional charges may be discussed later.

### 9.2 Allergen architecture

Every configurable edible element uses the same allergen metadata contract.

The interface derives a **Contains** summary from every selected edible element.

The Contains summary is separate from the permanent cross-contamination warning.

Non-edible add-ons do not carry allergen metadata.

### 9.3 Case-study allergen matrix

This matrix is a documented project assumption. It demonstrates the domain model and must be validated against actual recipes, preparation methods, and supplier labels before any commercial use.

| Element                     | Assumed Contains              |
| --------------------------- | ----------------------------- |
| Vanilla cupcake             | Wheat, Gluten, Milk, Egg      |
| Chocolate cupcake           | Wheat, Gluten, Milk, Egg, Soy |
| Red Velvet cupcake          | Wheat, Gluten, Milk, Egg      |
| Lemon cupcake               | Wheat, Gluten, Milk, Egg      |
| Cookies & Cream cupcake     | Wheat, Gluten, Milk, Egg, Soy |
| Salted Caramel cupcake      | Wheat, Gluten, Milk, Egg      |
| Vanilla sponge              | Wheat, Gluten, Milk, Egg      |
| Chocolate sponge            | Wheat, Gluten, Milk, Egg, Soy |
| Chai Spiced Carrot sponge   | Wheat, Gluten, Milk, Egg      |
| Hummingbird sponge          | Wheat, Gluten, Milk, Egg      |
| Chocolate Vegan sponge      | Wheat, Gluten, Soy            |
| Orange Almond sponge        | Milk, Egg, Almond             |
| Raspberry Jam               | None declared                 |
| Biscoff                     | Wheat, Gluten, Soy            |
| Nutella                     | Milk, Soy, Hazelnut           |
| Buttercream                 | Milk                          |
| Vegan Buttercream           | Soy                           |
| Edible Image                | Soy                           |
| Chocolate Drip              | Milk, Soy                     |
| Sugar Flowers               | Egg                           |
| Macarons                    | Egg, Almond                   |
| Premium Cupcake Decorations | Soy                           |
| Edible Gold Leaf            | None declared                 |

None declared does not mean allergen-free.

### 9.4 Cross-contamination warning

The warning is displayed before every preorder submission but does not require an acknowledgement checkbox.

Approved meaning:

> Products are prepared in a shared kitchen where gluten, milk, eggs, soy, peanuts, tree nuts, sesame and other allergens may be present. Dietary requests are reviewed individually, but products cannot be guaranteed to be free from allergens or cross-contamination.

## 10. Cart

The cart supports:

- adding configured Product Offerings;
- up to three configurations per request;
- reviewing configurations;
- removing individual configurations;
- clearing the cart;
- item-level estimated prices;
- Estimated Total.

Editing is not supported. To change an item, the customer removes it and creates a new configuration.

Cart data is stored in localStorage.

- stored data expires automatically after seven days;
- expired data is removed;
- the cart is not cleared automatically when mailto is launched because the website cannot verify that the email was sent.

## 11. Collection

Pickup is the only fulfilment method for standard Product Offerings.

Public location information is limited to Cairns, Queensland. The exact address is supplied privately after confirmation.

Collection availability:

- Monday to Friday;
- 9:00 am to 4:00 pm AEST;
- 30-minute requested collection times from 9:00 am through 4:00 pm inclusive;
- Saturday and Sunday unavailable.

There is no daily cutoff time and no blackout-date catalogue.

The submission date is day zero. For example, a three-day lead time from 2 July permits 5 July as the earliest otherwise-valid collection date.

A multi-item cart uses one requested collection date and time. The earliest date is based on the longest lead time in the cart.

Every date and time remains provisional until bakery confirmation.

## 12. Preorder workflow

1. Customer browses a Product Offering.
2. Customer selects a valid configuration.
3. The interface updates price and allergen information dynamically.
4. Customer adds the configuration to the cart.
5. Customer reviews or removes cart items.
6. Customer enters collection preference, full name, and mobile number.
7. Customer is reminded that the request is provisional and that images must be attached manually.
8. The website generates a structured mailto email.
9. The customer manually sends the email from their own email client.
10. The bakery reviews availability, feasibility, final price, timing, dietary requests, and review-required add-ons.
11. The bakery contacts the customer within 48 calendar hours.
12. Payment and final confirmation are handled outside the website.

Submitting or preparing an email does not:

- create a contract;
- reserve production capacity;
- reserve a collection time;
- confirm a design;
- guarantee a price;
- require payment.

### 12.1 Preorder customer fields

- Full Name: required, maximum 100 characters.
- Phone: required, exactly 10 digits, beginning with 04; the validation rule is ^04[0-9]{8}$. Spaces, hyphens, landlines, and international formats are not accepted.
- Separate email field: not collected.

The bakery replies to the address from which the customer manually sends the email.

### 12.2 Mailto limitations and fallback

- the website does not transmit the request itself;
- the customer must send the generated email manually;
- the website cannot verify delivery;
- files cannot be attached automatically;
- the interface provides clear attachment instructions;
- a copy-to-clipboard fallback provides the complete message if the email client does not open.

## 13. Events & Catering

Events & Catering starts a personalised consultation and does not attempt to collect a full project specification.

Required fields:

- Name;
- Email;
- Phone Number;
- Event Type;
- Message.

The Events & Catering phone field uses an appropriate tel input but does not enforce the preorder-only local-mobile rule.

Optional:

- Preferred Event Date.

Event Type options:

- Wedding;
- Corporate Event;
- Birthday;
- Baby Shower;
- Anniversary;
- Community Event;
- Other.

The message encourages a brief event description, initial ideas, and important context.

No minimum lead time or urgent-enquiry rule is enforced. Budget, guest count, venue, delivery, setup, and dietary requirements are not separate fields.

Submission generates a structured mailto email. It does not confirm a booking, price, or availability.

## 14. General contact

A functional general-enquiry mailto form collects:

- Name: required;
- Email: required;
- Phone: optional; it uses an appropriate tel input but does not enforce the preorder-only local-mobile rule;
- Message: required, maximum 1,000 characters.

Public business channels remain Instagram and Facebook. A public bakery phone number and exact address are not displayed.

The expected response time is 48 calendar hours for preorders, Events & Catering, and general enquiries.

The bakery chooses the follow-up channel and attempts a phone call first when a number is available.

## 15. Customer policies

### 15.1 Changes

Customers may request changes before production begins.

After production begins, changes cannot be guaranteed and are assessed individually.

### 15.2 Cancellations

Customers should contact the bakery as early as possible.

Cancellation requests are assessed according to the production stage.

### 15.3 Refunds and consumer rights

Change-of-mind requests are assessed according to the production stage.

Nothing in the website policies excludes rights under the Australian Consumer Law. Where a legal consumer remedy applies, the appropriate remedy must be provided.

### 15.4 Payments

The website does not define or process deposits, payment methods, payment timing, or payment status.

All payment arrangements are discussed directly after review.

## 16. Content, navigation, and trust

The public site uses Australian English.

Approved sitemap:

- Home;
- Our Creations;
- Floral Cupcake Bouquets;
- Edible Blooms;
- Bespoke Cakes;
- Events & Catering;
- About;
- FAQ;
- Policies;
- Privacy Notice;
- Cart / Preorder Summary.

Home CTA hierarchy:

1. Explore Our Creations
2. Plan an Event

The site avoids Order Now language that could imply automatic acceptance.

About retains Silvia as the original inspiration for the bakery story and clearly states that the current project is a portfolio case study, not a business operated by her.

FAQ topics include:

- how preorders work;
- what submission means;
- minimum lead times;
- pickup in Cairns;
- estimated pricing;
- custom designs and references;
- dietary requests and allergens;
- Events & Catering;
- changes, cancellations, and refunds;
- 48-hour response expectation.

## 17. SEO

Primary local search themes:

- custom cakes Cairns;
- cupcake bouquets Cairns;
- celebration cakes Cairns;
- artisan bakery Cairns;
- cake preorder Cairns.

Each indexable page requires unique metadata, a descriptive heading hierarchy, meaningful image alternatives, canonical handling, and crawlable internal navigation.

The site must not publish the exact collection address.

### 17.1 Structured-data honesty

Local SEO content may demonstrate optimisation for the approved Cairns search themes, but machine-readable data must not present the case study as an active bakery operated by Silvia.

For the current portfolio status:

- Bakery or LocalBusiness structured data is not approved;
- Product availability or purchase structured data is not approved;
- Events & Catering must not be represented as a fixed-price product;
- WebSite, CreativeWork, and developer/author attribution may be used when they accurately describe the project;
- any future commercial structured data would require a new Product Owner decision and verified business details.

## 18. Accessibility

WCAG 2.2 Level AA is the v1 target.

Key requirements include:

- full keyboard operation;
- visible focus;
- sufficient colour contrast;
- semantic landmarks and headings;
- explicit form labels and accessible instructions;
- understandable errors;
- appropriately sized touch targets;
- alternative text for meaningful imagery;
- reduced-motion support;
- no reliance on colour alone;
- dynamically updated price, validation, and allergen information communicated accessibly.

## 19. Privacy

The site uses no analytics, advertising pixels, or marketing cookies.

The Privacy Notice explains:

- cart data is stored locally in the customer's browser;
- cart data expires after seven days;
- the website has no application backend that receives preorder data;
- personal information is passed to the customer's email client;
- the customer sends it directly to the bakery;
- information is used only to respond to and manage the enquiry;
- information is not sold or used for website marketing.

## 20. Out of scope

The following are outside v1:

- online payments;
- customer accounts;
- order tracking;
- delivery for standard Product Offerings;
- image upload or server storage;
- CMS or database;
- automatic booking confirmation;
- real-time capacity management;
- multiple currencies;
- analytics and advertising tracking;
- multilingual content;
- post-v1 feature commitments.

## 21. Documented assumptions

1. The project models a realistic bakery rather than an active client operation.
2. Silvia's story is retained as brand inspiration, not current operational ownership.
3. Prices are realistic portfolio assumptions in AUD.
4. The allergen matrix is illustrative and not commercially verified.
5. The shared-kitchen warning applies to every order.
6. Product imagery and references communicate inspiration, not exact reproduction.
7. mailto remains intentionally accepted despite its platform limitations.
8. All dates, collection times, prices, dietary requests, and designs remain provisional until personal confirmation.
9. The final website is a portfolio baseline and not a commitment to future product expansion.

## 22. EMK-001 acceptance-criteria traceability

| Acceptance criterion                                            | Evidence in this document                                     |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| Internally consistent v1 bakery model                           | Sections 1–5, 8, 11, 12, and 20                               |
| Three Product Offerings and Events & Catering fully defined     | Sections 6 and 13                                             |
| Shared catalogues and compatibility approved                    | Sections 5, 7, and 9                                          |
| Configuration choices have documented purpose                   | Sections 6, 7, 8, and 9                                       |
| Preorder and enquiry information defined                        | Sections 12–14                                                |
| Missing information resolved through assumptions                | Sections 9.3 and 21                                           |
| No implementation-critical business question remains unresolved | Approved rules and explicit out-of-scope decisions throughout |
| Product Owner is the final approval source                      | Sections 1 and 23                                             |

## 23. Reference standards

The following authoritative sources inform the approved policy boundaries:

- [Australian Competition and Consumer Commission — Consumer rights and guarantees](https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees)
- [Food Standards Australia New Zealand — Allergen labelling for consumers](https://www.foodstandards.gov.au/consumer/labelling/allergen-labelling)
- [W3C Web Accessibility Initiative — WCAG 2.2 Level AA](https://www.w3.org/WAI/WCAG2AA-Conformance)
- [Office of the Australian Information Commissioner — What is a privacy policy?](https://www.oaic.gov.au/privacy/your-privacy-rights/your-personal-information/what-is-a-privacy-policy)

These references support product requirements but do not replace legal, food-safety, or accessibility specialist advice for a real commercial deployment.

## 24. Approval

These requirements were established through the EMK-001 Product Owner workshop and approved by Kelvin Carreño Espin.

Any implementation that changes a business rule in this document requires an explicit Product Owner decision and a corresponding documentation update.
