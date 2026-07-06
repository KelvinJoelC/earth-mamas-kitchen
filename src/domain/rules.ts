import type { StableId } from '@/domain/ids';

export type RuleScope<
  TWorkflowId extends StableId = StableId,
  TOfferingId extends StableId = StableId,
> =
  | { readonly kind: 'global' }
  | { readonly kind: 'workflow'; readonly workflowId: TWorkflowId }
  | { readonly kind: 'product-offering'; readonly offeringId: TOfferingId }
  | { readonly kind: 'compatibility'; readonly offeringId: TOfferingId };

export type RuleCondition<
  TGroupId extends StableId = StableId,
  TValueId extends StableId = StableId,
> =
  | {
      readonly kind: 'selection-equals';
      readonly groupId: TGroupId;
      readonly value: TValueId;
    }
  | {
      readonly kind: 'selection-includes';
      readonly groupId: TGroupId;
      readonly value: TValueId;
    }
  | {
      readonly kind: 'numeric-threshold';
      readonly field: string;
      readonly operator: 'greater-than' | 'greater-than-or-equal';
      readonly value: number;
    }
  | {
      readonly kind: 'request-flag';
      readonly flag: string;
      readonly value: boolean;
    }
  | { readonly kind: 'field-has-value'; readonly field: string };

interface BusinessRuleBase<
  TId extends StableId = StableId,
  TWorkflowId extends StableId = StableId,
  TOfferingId extends StableId = StableId,
  TGroupId extends StableId = StableId,
  TValueId extends StableId = StableId,
> {
  readonly id: TId;
  readonly description: string;
  readonly scope: RuleScope<TWorkflowId, TOfferingId>;
  readonly when: RuleCondition<TGroupId, TValueId>;
}

export type BusinessRule<
  TId extends StableId = StableId,
  TWorkflowId extends StableId = StableId,
  TOfferingId extends StableId = StableId,
  TGroupId extends StableId = StableId,
  TValueId extends StableId = StableId,
> =
  | (BusinessRuleBase<TId, TWorkflowId, TOfferingId, TGroupId, TValueId> & {
      readonly kind: 'requires';
      readonly targetGroupId: TGroupId;
    })
  | (BusinessRuleBase<TId, TWorkflowId, TOfferingId, TGroupId, TValueId> & {
      readonly kind: 'excludes';
      readonly targetGroupId: TGroupId;
      readonly values: readonly TValueId[];
    })
  | (BusinessRuleBase<TId, TWorkflowId, TOfferingId, TGroupId, TValueId> & {
      readonly kind: 'limits-selection';
      readonly targetGroupId: TGroupId;
      readonly maximumSelections: number;
    })
  | (BusinessRuleBase<TId, TWorkflowId, TOfferingId, TGroupId, TValueId> & {
      readonly kind: 'auto-selects';
      readonly targetGroupId: TGroupId;
      readonly value: TValueId;
    })
  | (BusinessRuleBase<TId, TWorkflowId, TOfferingId, TGroupId, TValueId> & {
      readonly kind: 'redirects-to-enquiry';
      readonly serviceOfferingId: StableId;
    })
  | (BusinessRuleBase<TId, TWorkflowId, TOfferingId, TGroupId, TValueId> & {
      readonly kind: 'requires-review';
      readonly reason: string;
    });
