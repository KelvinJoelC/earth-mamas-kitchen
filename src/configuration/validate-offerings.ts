import type { ProductOfferingDefinition } from '@/domain/offerings';

interface ProductOfferingValidationContext {
  readonly addOnIds: ReadonlySet<string>;
  readonly businessRuleIds: ReadonlySet<string>;
}

export function validateProductOfferingDefinition(
  offering: ProductOfferingDefinition,
  context: ProductOfferingValidationContext,
) {
  const errors: string[] = [];

  requireValue(errors, offering.id, 'id');
  requireValue(errors, offering.slug, `${offering.id}.slug`);
  requireValue(errors, offering.name, `${offering.id}.name`);
  requireValue(errors, offering.workflowId, `${offering.id}.workflowId`);

  collectDuplicateValues(
    offering.optionGroups.map((group) => group.id),
    `${offering.id}.optionGroups`,
    errors,
  );
  collectDuplicateValues(
    offering.addOns.map((configuration) => configuration.addOnId),
    `${offering.id}.addOns`,
    errors,
  );
  collectDuplicateValues(offering.ruleIds, `${offering.id}.ruleIds`, errors);

  offering.optionGroups.forEach((group) => {
    if ('options' in group) {
      const optionValues = group.options.map((option) => option.value);
      collectDuplicateValues(
        optionValues,
        `${offering.id}.${group.id}.options`,
        errors,
      );

      if ('defaultValue' in group && group.defaultValue) {
        if (!optionValues.includes(group.defaultValue)) {
          errors.push(
            `${offering.id}.${group.id} has an unknown default value "${group.defaultValue}".`,
          );
        }
      }
    }

    if (
      group.kind === 'multi-select' &&
      group.minimumSelections !== undefined &&
      group.maximumSelections !== undefined &&
      group.minimumSelections > group.maximumSelections
    ) {
      errors.push(
        `${offering.id}.${group.id} minimumSelections exceeds maximumSelections.`,
      );
    }
  });

  offering.addOns.forEach((configuration) => {
    if (!context.addOnIds.has(configuration.addOnId)) {
      errors.push(
        `${offering.id} references unknown add-on "${configuration.addOnId}".`,
      );
    }
  });

  offering.ruleIds.forEach((ruleId) => {
    if (!context.businessRuleIds.has(ruleId)) {
      errors.push(`${offering.id} references unknown rule "${ruleId}".`);
    }
  });

  return errors;
}

export function assertValidProductOfferingDefinition(
  offering: ProductOfferingDefinition,
  context: ProductOfferingValidationContext,
) {
  const errors = validateProductOfferingDefinition(offering, context);

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

function requireValue(errors: string[], value: string, label: string) {
  if (!value.trim()) errors.push(`${label} is required.`);
}

function collectDuplicateValues(
  values: readonly string[],
  label: string,
  errors: string[],
) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  values.forEach((value) => {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  });

  duplicates.forEach((value) =>
    errors.push(`${label} contains duplicate value "${value}".`),
  );
}
