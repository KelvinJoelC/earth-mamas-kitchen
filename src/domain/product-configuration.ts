import type { StableId } from '@/domain/ids';
import type { EstimatedPrice } from '@/domain/pricing';

export type ConfigurationSelection<
  TGroupId extends StableId = StableId,
  TValueId extends StableId = StableId,
> =
  | {
      readonly kind: 'single-select';
      readonly groupId: TGroupId;
      readonly value: TValueId;
    }
  | {
      readonly kind: 'multi-select';
      readonly groupId: TGroupId;
      readonly values: readonly TValueId[];
    }
  | {
      readonly kind: 'text';
      readonly groupId: TGroupId;
      readonly value: string;
    }
  | {
      readonly kind: 'date';
      readonly groupId: TGroupId;
      readonly value: string;
    };

export interface SelectedAddOn<TAddOnId extends StableId = StableId> {
  readonly addOnId: TAddOnId;
  readonly customerInput?: string;
}

export interface ProductConfigurationSelection<
  TOfferingId extends StableId = StableId,
  TGroupId extends StableId = StableId,
  TValueId extends StableId = StableId,
  TAddOnId extends StableId = StableId,
> {
  readonly offeringId: TOfferingId;
  readonly selections: readonly ConfigurationSelection<TGroupId, TValueId>[];
  readonly addOns: readonly SelectedAddOn<TAddOnId>[];
  readonly estimatedPrice: EstimatedPrice<TValueId | TAddOnId>;
}
