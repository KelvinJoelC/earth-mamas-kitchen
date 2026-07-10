import { addCartItem } from './cart-state.js';

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

const conditionalPanelHideTimers = new WeakMap();
const optionalPanelHideTimers = new WeakMap();

function readPreorderConfig(form) {
  if (!form?.dataset.preorderConfig) return null;

  try {
    return JSON.parse(form.dataset.preorderConfig);
  } catch (err) {
    console.error('preorder config parse error', err);
    return null;
  }
}

function formatAud(cents) {
  return currencyFormatter.format(cents / 100);
}

function getControl(form, groupId) {
  return form.querySelector(`[name="${CSS.escape(groupId)}"]`);
}

function getControls(form, groupId) {
  return [...form.querySelectorAll(`[name="${CSS.escape(groupId)}"]`)];
}

function getOptionGroupPanel(form, groupId) {
  return form.querySelector(
    `[data-option-group-panel="${CSS.escape(groupId)}"]`,
  );
}

function getOptionalFieldPanel(form, groupId) {
  return form.querySelector(
    `[data-optional-field-panel="${CSS.escape(groupId)}"]`,
  );
}

function getOptionalFieldToggle(form, groupId) {
  return form.querySelector(
    `[data-optional-field-toggle="${CSS.escape(groupId)}"]`,
  );
}

function getOptionalFieldContent(form, groupId) {
  return form.querySelector(
    `[data-optional-field-content="${CSS.escape(groupId)}"]`,
  );
}

function getSelectedValues(form, groupId) {
  const controls = [
    ...form.querySelectorAll(`[name="${CSS.escape(groupId)}"]`),
  ];

  if (controls.some((control) => control.type === 'checkbox')) {
    return controls
      .filter((control) => control.checked)
      .map((control) => control.value);
  }

  const control = controls[0];
  return control?.value ? [control.value] : [];
}

function conditionMatches(form, condition) {
  if (condition.kind === 'selection-equals') {
    return getSelectedValues(form, condition.groupId).includes(condition.value);
  }

  if (condition.kind === 'selection-includes') {
    return getSelectedValues(form, condition.groupId).includes(condition.value);
  }

  if (condition.kind === 'field-has-value') {
    return Boolean(getControl(form, condition.field)?.value.trim());
  }

  return false;
}

function setMessage(groupId, message) {
  const messageElement = document.querySelector(
    `[data-field-message="${CSS.escape(groupId)}"]`,
  );
  if (messageElement) messageElement.textContent = message;
}

function applyCollectionDateLimit(form, config) {
  const collectionDate = getControl(form, 'collection-date');
  if (!collectionDate || config.leadTime?.unit !== 'calendar-days') return;

  const minimumDate = new Date();
  minimumDate.setDate(minimumDate.getDate() + config.leadTime.minimum);

  const firstAvailableDate = minimumDate.toISOString().slice(0, 10);

  collectionDate.min = firstAvailableDate;

  if (!collectionDate.value || collectionDate.value < firstAvailableDate) {
    collectionDate.value = firstAvailableDate;
  }

  setMessage(
    'collection-date',
    `Minimum notice: ${config.leadTime.minimum} calendar days.`,
  );
}

function applyAddOnInputs(form) {
  const addOnCheckboxes = [...form.querySelectorAll('[name="addOns"]')];

  addOnCheckboxes.forEach((checkbox) => {
    const inputWrapper = form.querySelector(
      `[data-add-on-input="${CSS.escape(checkbox.value)}"]`,
    );
    if (!inputWrapper) return;

    const input = inputWrapper.querySelector('input, textarea');
    const isSelected = checkbox.checked;
    inputWrapper.classList.toggle('hidden', !isSelected);
    inputWrapper.hidden = !isSelected;
    inputWrapper.setAttribute('aria-hidden', String(!isSelected));

    if (input) {
      input.disabled = !isSelected;
      input.required = isSelected;
      if (!isSelected) input.value = '';
    }
  });
}

function applyRequiredRules(form, rules) {
  rules
    .filter((rule) => rule.kind === 'requires')
    .forEach((rule) => {
      const targets = getControls(form, rule.targetGroupId);
      if (!targets.length) return;

      const active = conditionMatches(form, rule.when);
      const panel = getOptionGroupPanel(form, rule.targetGroupId);

      targets.forEach((target) => {
        target.required = active;
        target.disabled = !active;

        if (!active) {
          if (target.type === 'checkbox' || target.type === 'radio') {
            target.checked = false;
          } else {
            target.value = '';
          }
        }
      });

      setConditionalPanelVisibility(panel, active);
      if (active) {
        setOptionalFieldExpanded(form, rule.targetGroupId, true);
      }
      setMessage(
        rule.targetGroupId,
        active ? 'Required based on your current selection.' : '',
      );
    });
}

function setConditionalPanelVisibility(panel, visible) {
  if (!panel) return;

  const existingTimer = conditionalPanelHideTimers.get(panel);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
    conditionalPanelHideTimers.delete(panel);
  }

  panel.setAttribute('aria-hidden', String(!visible));

  if (visible) {
    panel.hidden = false;
    window.requestAnimationFrame(() => {
      panel.classList.remove('conditional-field-panel--hidden');
    });
    return;
  }

  panel.classList.add('conditional-field-panel--hidden');

  const hideTimer = window.setTimeout(() => {
    panel.hidden = true;
    conditionalPanelHideTimers.delete(panel);
  }, 250);

  conditionalPanelHideTimers.set(panel, hideTimer);
}

function fieldHasValue(form, groupId) {
  return getControls(form, groupId).some((control) => {
    if (control.type === 'checkbox' || control.type === 'radio') {
      return control.checked;
    }

    return Boolean(control.value?.trim());
  });
}

function setOptionalFieldExpanded(form, groupId, expanded) {
  const panel = getOptionalFieldPanel(form, groupId);
  const toggle = getOptionalFieldToggle(form, groupId);
  const content = getOptionalFieldContent(form, groupId);

  if (!panel || !toggle || !content) return;

  const existingTimer = optionalPanelHideTimers.get(content);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
    optionalPanelHideTimers.delete(content);
  }

  toggle.setAttribute('aria-expanded', String(expanded));
  panel.classList.toggle('optional-field-card--collapsed', !expanded);

  if (expanded) {
    content.hidden = false;
    window.requestAnimationFrame(() => {
      content.classList.remove('optional-field-content--collapsed');
    });
    return;
  }

  content.classList.add('optional-field-content--collapsed');

  const hideTimer = window.setTimeout(() => {
    content.hidden = true;
    optionalPanelHideTimers.delete(content);
  }, 250);

  optionalPanelHideTimers.set(content, hideTimer);
}

function initOptionalFields(form) {
  form.querySelectorAll('[data-optional-field-toggle]').forEach((toggle) => {
    const groupId = toggle.dataset.optionalFieldToggle;
    if (!groupId) return;

    if (!toggle.dataset.bound) {
      toggle.dataset.bound = 'true';
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        setOptionalFieldExpanded(form, groupId, !expanded);
      });
    }

    setOptionalFieldExpanded(form, groupId, fieldHasValue(form, groupId));
  });
}

function applyExclusionRules(form, rules) {
  const excludedByGroup = new Map();

  rules
    .filter(
      (rule) => rule.kind === 'excludes' && conditionMatches(form, rule.when),
    )
    .forEach((rule) => {
      const existing = excludedByGroup.get(rule.targetGroupId) ?? new Set();
      rule.values.forEach((value) => existing.add(value));
      excludedByGroup.set(rule.targetGroupId, existing);
    });

  form.querySelectorAll('option, input[type="checkbox"]').forEach((control) => {
    const groupId = control.closest('[data-option-group]')?.dataset.optionGroup;
    if (!groupId) return;

    const excludedValues = excludedByGroup.get(groupId);
    const isExcluded = excludedValues?.has(control.value) ?? false;
    control.disabled = isExcluded;

    if (isExcluded && control.selected) control.selected = false;
    if (isExcluded && control.checked) control.checked = false;
  });
}

function applyAutoSelectRules(form, rules) {
  rules
    .filter(
      (rule) =>
        rule.kind === 'auto-selects' && conditionMatches(form, rule.when),
    )
    .forEach((rule) => {
      const control = getControl(form, rule.targetGroupId);
      if (!control) return;

      control.value = rule.value;
      setMessage(
        rule.targetGroupId,
        'Automatically selected to keep this configuration compatible.',
      );
    });
}

function getActiveMaximumSelections(form, group, rules) {
  const matchingRule = rules.find(
    (rule) =>
      rule.kind === 'limits-selection' &&
      rule.targetGroupId === group.id &&
      conditionMatches(form, rule.when),
  );

  return matchingRule?.maximumSelections ?? group.maximumSelections;
}

function applySelectionLimits(form, config) {
  config.optionGroups
    .filter((group) => group.kind === 'multi-select')
    .forEach((group) => {
      const checkboxes = [
        ...form.querySelectorAll(`[name="${CSS.escape(group.id)}"]`),
      ];
      const maximumSelections = getActiveMaximumSelections(
        form,
        group,
        config.rules,
      );
      const minimumSelections = group.minimumSelections ?? 0;
      const firstCheckbox = checkboxes[0];
      const selectedCheckboxes = checkboxes.filter(
        (checkbox) => checkbox.checked,
      );

      if (maximumSelections && selectedCheckboxes.length > maximumSelections) {
        selectedCheckboxes.slice(maximumSelections).forEach((checkbox) => {
          checkbox.checked = false;
        });
      }

      const selectedCount = checkboxes.filter(
        (checkbox) => checkbox.checked,
      ).length;

      checkboxes.forEach((checkbox) => {
        checkbox.disabled =
          Boolean(maximumSelections) &&
          selectedCount >= maximumSelections &&
          !checkbox.checked;
      });

      if (firstCheckbox) {
        firstCheckbox.setCustomValidity(
          selectedCount < minimumSelections
            ? `Please select at least ${minimumSelections}.`
            : '',
        );
      }

      const limitMessage = maximumSelections
        ? `Select up to ${maximumSelections}.`
        : '';
      setMessage(group.id, limitMessage);
    });
}

function collectSelections(form, config) {
  const selections = {};
  const labels = {};

  config.optionGroups.forEach((group) => {
    if (group.kind === 'multi-select') {
      const selectedControls = [
        ...form.querySelectorAll(`[name="${CSS.escape(group.id)}"]:checked`),
      ];
      selections[group.id] = selectedControls.map((control) => control.value);
      labels[group.id] = {
        label: group.label,
        value: selectedControls.map((control) => control.dataset.label),
      };
      return;
    }

    const control = getControl(form, group.id);
    if (!control || control.disabled) return;

    selections[group.id] = control?.value ?? '';
    labels[group.id] = {
      label: group.label,
      value:
        control?.selectedOptions?.[0]?.dataset.label ?? control?.value ?? '',
    };
  });

  return { selections, labels };
}

function collectAddOns(form) {
  const selectedAddOns = [...form.querySelectorAll('[name="addOns"]:checked')];

  return {
    values: selectedAddOns.map((checkbox) => {
      const customerInput = getControl(form, `addOnInput:${checkbox.value}`);
      return {
        addOnId: checkbox.value,
        customerInput: customerInput?.value.trim() || undefined,
      };
    }),
    labels: selectedAddOns.map((checkbox) => {
      const customerInput = getControl(form, `addOnInput:${checkbox.value}`);
      return {
        addOnId: checkbox.value,
        label: checkbox.dataset.label,
        customerInput: customerInput?.value.trim() || undefined,
      };
    }),
  };
}

function calculateEstimatedPrice(form, config) {
  const components = [];

  config.optionGroups
    .filter((group) => group.kind === 'priced-single-select')
    .forEach((group) => {
      const control = getControl(form, group.id);
      const selected = control?.selectedOptions?.[0];
      const price = Number(selected?.dataset.price ?? 0);

      if (selected?.value && price) {
        components.push({
          type: 'base-option',
          referenceId: selected.value,
          label: selected.dataset.label,
          amount: price,
        });
      }
    });

  form.querySelectorAll('[name="addOns"]:checked').forEach((checkbox) => {
    const price = Number(checkbox.dataset.price ?? 0);
    components.push({
      type: 'add-on',
      referenceId: checkbox.value,
      label: checkbox.dataset.label,
      amount: price,
    });
  });

  const amount = components.reduce(
    (total, component) => total + component.amount,
    0,
  );

  return {
    kind: 'estimate',
    currency: 'AUD',
    amount,
    components,
    finalQuotationRequired: true,
  };
}

function updateEstimatedPrice(form, config) {
  const target = document.getElementById('estimatedPrice');
  if (!target) return;

  const estimatedPrice = calculateEstimatedPrice(form, config);
  target.textContent = estimatedPrice.amount
    ? formatAud(estimatedPrice.amount)
    : 'Select a size to calculate your estimate.';
}

function getContainsAllergens(form, config) {
  const allergenIds = new Set();

  config.optionGroups.forEach((group) => {
    getSelectedValues(form, group.id).forEach((value) => {
      const allergens = config.optionAllergens[value] ?? [];
      allergens.forEach((allergen) => allergenIds.add(allergen));
    });
  });

  form.querySelectorAll('[name="addOns"]:checked').forEach((checkbox) => {
    const addOn = config.addOns.find(
      ({ addOnId }) => addOnId === checkbox.value,
    );
    addOn?.allergens?.forEach((allergen) => allergenIds.add(allergen));
  });

  return [...allergenIds].map(
    (allergenId) => config.allergenLabels[allergenId] ?? allergenId,
  );
}

function updateAllergens(form, config) {
  const containsTarget = document.getElementById('containsAllergens');
  const warningTarget = document.getElementById('crossContaminationWarning');

  if (warningTarget) {
    warningTarget.textContent = config.allergenPolicy.crossContaminationWarning;
  }

  if (!containsTarget) return;

  const contains = getContainsAllergens(form, config);
  containsTarget.textContent = contains.length
    ? contains.join(', ')
    : 'None listed.';
}

function configurationRequiresReview(form, config) {
  const selectedReviewRule = config.rules.some(
    (rule) =>
      rule.kind === 'requires-review' && conditionMatches(form, rule.when),
  );
  const selectedReviewAddOn = [
    ...form.querySelectorAll('[name="addOns"]:checked'),
  ].some((checkbox) => checkbox.dataset.requiresReview === 'true');

  return selectedReviewRule || selectedReviewAddOn;
}

function createCartItemId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function refreshFormState(form, config) {
  applyRequiredRules(form, config.rules);
  applyAutoSelectRules(form, config.rules);
  applyExclusionRules(form, config.rules);
  applySelectionLimits(form, config);
  applyAddOnInputs(form);
  updateEstimatedPrice(form, config);
  updateAllergens(form, config);
}

function buildCartItem(form, config) {
  const { selections, labels } = collectSelections(form, config);
  const addOns = collectAddOns(form);

  return {
    id: createCartItemId(),
    product: form.dataset.productTitle,
    offeringId: config.offeringId,
    workflowId: config.workflowId,
    options: {
      ...selections,
      addOns: addOns.values.map(({ addOnId }) => addOnId),
    },
    labels: {
      options: labels,
      addOns: addOns.labels,
    },
    addOnInputs: addOns.values,
    estimatedPrice: calculateEstimatedPrice(form, config),
    containsAllergens: getContainsAllergens(form, config),
    requiresReview: configurationRequiresReview(form, config),
    referenceImageInstructions:
      config.workflowId === 'design-brief-preorder'
        ? 'Please attach reference images manually when your email client opens.'
        : undefined,
  };
}

function initPreOrderForm() {
  const form = document.getElementById('preOrderForm');
  const config = readPreorderConfig(form);

  if (!form || !config || form.dataset.bound) return;

  form.dataset.bound = 'true';
  applyCollectionDateLimit(form, config);
  initOptionalFields(form);
  refreshFormState(form, config);

  form.addEventListener('change', () => refreshFormState(form, config));
  form.addEventListener('input', () => refreshFormState(form, config));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    refreshFormState(form, config);

    if (!form.reportValidity()) return;

    const result = addCartItem(buildCartItem(form, config));
    if (!result.ok) {
      const message =
        result.reason === 'cart-limit-reached'
          ? 'You can save up to three preorder configurations. Please remove one before adding another.'
          : 'We could not save this preorder configuration. Please try again.';
      window.alert(message);
      return;
    }

    form.reset();
    window.location.href = '/order';
  });
}

document.addEventListener('astro:page-load', initPreOrderForm);
