import type { ProductOfferingAddOnConfiguration } from '@/domain/add-ons';
import type { StableId } from '@/domain/ids';
import type { OptionGroup } from '@/domain/option-groups';

export interface LeadTime {
  readonly unit: 'calendar-days';
  readonly minimum: number;
}

export interface EnquiryThreshold {
  readonly kind:
    'maximum-cupcakes' | 'maximum-tiers' | 'maximum-servings' | 'request-flag';
  readonly value: number | string;
  readonly serviceOfferingId: StableId;
}

export interface ProductOfferingDefinition<
  TId extends StableId = StableId,
  TWorkflowId extends StableId = StableId,
  TOptionGroup extends OptionGroup = OptionGroup,
  TAddOnConfiguration extends ProductOfferingAddOnConfiguration =
    ProductOfferingAddOnConfiguration,
  TRuleId extends StableId = StableId,
> {
  readonly id: TId;
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly workflowId: TWorkflowId;
  readonly leadTime: LeadTime;
  readonly optionGroups: readonly TOptionGroup[];
  readonly addOns: readonly TAddOnConfiguration[];
  readonly ruleIds: readonly TRuleId[];
  readonly enquiryThresholds: readonly EnquiryThreshold[];
}

export interface ServiceOfferingDefinition<
  TId extends StableId = StableId,
  TWorkflowId extends StableId = StableId,
  TRuleId extends StableId = StableId,
> {
  readonly id: TId;
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly workflowId: TWorkflowId;
  readonly ruleIds: readonly TRuleId[];
}
