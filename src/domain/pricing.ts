import type { StableId } from '@/domain/ids';
import type { AudCents } from '@/domain/money';

export type PriceComponentType = 'base-option' | 'option-surcharge' | 'add-on';

export interface EstimatedPriceComponent<
  TReferenceId extends StableId = StableId,
> {
  readonly type: PriceComponentType;
  readonly referenceId: TReferenceId;
  readonly label: string;
  readonly amount: AudCents;
}

export interface EstimatedPrice<TReferenceId extends StableId = StableId> {
  readonly kind: 'estimate';
  readonly currency: 'AUD';
  readonly amount: AudCents;
  readonly components: readonly EstimatedPriceComponent<TReferenceId>[];
  readonly finalQuotationRequired: true;
}

export interface FinalQuotation<TReferenceId extends StableId = StableId> {
  readonly kind: 'final-quotation';
  readonly currency: 'AUD';
  readonly amount: AudCents;
  readonly referenceId: TReferenceId;
  readonly confirmedByBakery: true;
}
