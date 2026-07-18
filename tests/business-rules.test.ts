import { describe, expect, it } from 'vitest';

import { businessRules } from '@/configuration/rules/rules';

function findRule(id: string) {
  const rule = businessRules.find((candidate) => candidate.id === id);
  if (!rule) throw new Error(`Missing rule ${id}`);
  return rule;
}

describe('declarative business rules', () => {
  it('defines cupcake flavour selection limits by bouquet and box size', () => {
    expect(findRule('small-bouquet-limits-one-flavour')).toMatchObject({
      kind: 'limits-selection',
      when: { groupId: 'bouquet-size', value: 'small-bouquet' },
      targetGroupId: 'cupcake-flavours',
      maximumSelections: 1,
    });
    expect(findRule('medium-bouquet-limits-two-flavours')).toMatchObject({
      kind: 'limits-selection',
      when: { groupId: 'bouquet-size', value: 'medium-bouquet' },
      targetGroupId: 'cupcake-flavours',
      maximumSelections: 2,
    });
    expect(findRule('large-bouquet-limits-three-flavours')).toMatchObject({
      kind: 'limits-selection',
      when: { groupId: 'bouquet-size', value: 'large-bouquet' },
      targetGroupId: 'cupcake-flavours',
      maximumSelections: 3,
    });
    expect(findRule('celebration-box-limits-four-flavours')).toMatchObject({
      kind: 'limits-selection',
      when: { groupId: 'box-size', value: 'celebration-box' },
      targetGroupId: 'cupcake-flavours',
      maximumSelections: 4,
    });
  });

  it('covers vegan and gluten-friendly Bespoke Cake compatibility rules', () => {
    expect(
      findRule('vegan-sponge-auto-selects-vegan-buttercream'),
    ).toMatchObject({
      kind: 'auto-selects',
      when: { groupId: 'sponge-flavour', value: 'chocolate-vegan' },
      targetGroupId: 'frosting',
      value: 'vegan-buttercream',
    });
    expect(
      findRule('vegan-sponge-excludes-incompatible-fillings'),
    ).toMatchObject({
      kind: 'excludes',
      when: { groupId: 'sponge-flavour', value: 'chocolate-vegan' },
      targetGroupId: 'filling',
      values: ['biscoff', 'nutella'],
    });
    expect(
      findRule('vegan-sponge-excludes-standard-buttercream'),
    ).toMatchObject({
      kind: 'excludes',
      when: { groupId: 'sponge-flavour', value: 'chocolate-vegan' },
      targetGroupId: 'frosting',
      values: ['buttercream'],
    });
    expect(
      findRule('gluten-friendly-sponge-excludes-incompatible-fillings'),
    ).toMatchObject({
      kind: 'excludes',
      when: {
        groupId: 'sponge-flavour',
        value: 'orange-almond-gluten-friendly',
      },
      targetGroupId: 'filling',
      values: ['biscoff', 'nutella'],
    });
  });

  it('represents event enquiry thresholds as redirects to Events & Catering', () => {
    expect(
      findRule('more-than-forty-eight-cupcakes-redirects-to-enquiry'),
    ).toMatchObject({
      kind: 'redirects-to-enquiry',
      serviceOfferingId: 'events-catering',
      when: {
        kind: 'numeric-threshold',
        field: 'cupcake-count',
        operator: 'greater-than',
        value: 48,
      },
    });
    expect(findRule('more-than-two-tiers-redirects-to-enquiry')).toMatchObject({
      kind: 'redirects-to-enquiry',
      serviceOfferingId: 'events-catering',
      when: { field: 'tier-count', operator: 'greater-than', value: 2 },
    });
    expect(
      findRule('more-than-sixty-servings-redirects-to-enquiry'),
    ).toMatchObject({
      kind: 'redirects-to-enquiry',
      serviceOfferingId: 'events-catering',
      when: { field: 'servings', operator: 'greater-than', value: 60 },
    });
  });
});
