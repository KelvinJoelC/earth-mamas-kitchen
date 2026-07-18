import { describe, expect, it } from 'vitest';

import { addOnCatalogue } from '@/configuration/catalogues/add-ons';
import { productOfferingPaths } from '@/configuration/offerings/offering-paths';
import { productOfferings } from '@/configuration/offerings/product-offerings';
import { serviceOfferings } from '@/configuration/offerings/service-offerings';
import { businessRules } from '@/configuration/rules/rules';
import {
  assertValidProductOfferingDefinition,
  validateProductOfferingDefinition,
} from '@/configuration/validate-offerings';

const addOnIds = new Set(addOnCatalogue.map((addOn) => addOn.id));
const businessRuleIds = new Set(businessRules.map((rule) => rule.id));
const validationContext = { addOnIds, businessRuleIds };

describe('canonical product and service offering configuration', () => {
  it('keeps stable offering IDs, slugs, and canonical paths unique', () => {
    const productIds = productOfferings.map((offering) => offering.id);
    const productSlugs = productOfferings.map((offering) => offering.slug);
    const serviceIds = serviceOfferings.map((offering) => offering.id);
    const serviceSlugs = serviceOfferings.map((offering) => offering.slug);

    expect(new Set(productIds).size).toBe(productIds.length);
    expect(new Set(productSlugs).size).toBe(productSlugs.length);
    expect(new Set(serviceIds).size).toBe(serviceIds.length);
    expect(new Set(serviceSlugs).size).toBe(serviceSlugs.length);

    productOfferings.forEach((offering) => {
      expect(productOfferingPaths[offering.id]).toBe(
        `/our-creations/${offering.slug}`,
      );
      expect(offering.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    });
  });

  it('validates all configured Product Offerings against shared catalogues and rules', () => {
    productOfferings.forEach((offering) => {
      expect(() =>
        assertValidProductOfferingDefinition(offering, validationContext),
      ).not.toThrow();
    });
  });

  it('rejects invalid Product Offering configuration deterministically', () => {
    const [offering] = productOfferings;
    const invalidOffering = {
      ...offering,
      addOns: [
        ...offering.addOns,
        {
          addOnId: 'unknown-add-on',
          displayOrder: 999,
          compatibilityRuleIds: [],
        },
      ],
      optionGroups: [
        {
          ...offering.optionGroups[0],
          defaultValue: 'unknown-default',
        },
        ...offering.optionGroups.slice(1),
      ],
      ruleIds: [...offering.ruleIds, 'unknown-rule'],
    };

    expect(
      validateProductOfferingDefinition(invalidOffering, validationContext),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining('unknown add-on "unknown-add-on"'),
        expect.stringContaining('unknown default value "unknown-default"'),
        expect.stringContaining('unknown rule "unknown-rule"'),
      ]),
    );
  });

  it('keeps option group definitions renderer-safe', () => {
    productOfferings.forEach((offering) => {
      offering.optionGroups.forEach((group) => {
        expect(group.id).toBeTruthy();
        expect(group.label).toBeTruthy();
        expect(group.displayOrder).toBeGreaterThan(0);

        if ('options' in group) {
          expect(group.options.length).toBeGreaterThan(0);
          const optionValues = group.options.map((option) => option.value);

          expect(new Set(optionValues).size).toBe(optionValues.length);

          if ('defaultValue' in group && group.defaultValue) {
            expect(optionValues).toContain(group.defaultValue);
          }
        }

        if (group.kind === 'multi-select') {
          expect(group.minimumSelections ?? 0).toBeLessThanOrEqual(
            group.maximumSelections ?? Number.POSITIVE_INFINITY,
          );
        }
      });
    });
  });
});
