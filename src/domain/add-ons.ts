import type { Availability } from '@/domain/catalogue';
import type { StableId } from '@/domain/ids';
import type { AudCents } from '@/domain/money';

export interface AddOnDefinition<TId extends StableId = StableId> {
  readonly id: TId;
  readonly name: string;
  readonly description: string;
  readonly defaultPrice: AudCents;
  readonly availability: Availability;
  readonly requiresReview: boolean;
}

export interface AddOnCustomerInput {
  readonly kind: 'single-line-text' | 'multi-line-text';
  readonly label: string;
  readonly required: boolean;
  readonly maxLength: number;
  readonly trim: true;
  readonly allowEmoji: boolean;
}

export interface ProductOfferingAddOnConfiguration<
  TAddOnId extends StableId = StableId,
  TRuleId extends StableId = StableId,
> {
  readonly addOnId: TAddOnId;
  readonly priceOverride?: AudCents;
  readonly availabilityOverride?: Availability;
  readonly requiresReviewOverride?: boolean;
  readonly displayOrder: number;
  readonly compatibilityRuleIds: readonly TRuleId[];
  readonly customerInput?: AddOnCustomerInput;
}
