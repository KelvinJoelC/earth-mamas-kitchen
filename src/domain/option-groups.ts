import type { StableId } from '@/domain/ids';
import type { AudCents } from '@/domain/money';

interface OptionGroupBase<TId extends StableId = StableId> {
  readonly id: TId;
  readonly label: string;
  readonly description?: string;
  readonly required: boolean;
  readonly displayOrder: number;
}

export interface SelectOption<TValueId extends StableId = StableId> {
  readonly value: TValueId;
  readonly label: string;
  readonly description?: string;
}

export interface PricedSelectOption<
  TValueId extends StableId = StableId,
> extends SelectOption<TValueId> {
  readonly price: AudCents;
  readonly attributes?: {
    readonly cupcakeCount?: number;
    readonly minimumServings?: number;
    readonly maximumServings?: number;
    readonly approximateServings?: number;
    readonly tierCount?: number;
  };
}

export interface SingleSelectOptionGroup<
  TId extends StableId = StableId,
  TValueId extends StableId = StableId,
> extends OptionGroupBase<TId> {
  readonly kind: 'single-select';
  readonly options: readonly SelectOption<TValueId>[];
}

export interface MultiSelectOptionGroup<
  TId extends StableId = StableId,
  TValueId extends StableId = StableId,
> extends OptionGroupBase<TId> {
  readonly kind: 'multi-select';
  readonly options: readonly SelectOption<TValueId>[];
  readonly minimumSelections?: number;
  readonly maximumSelections?: number;
}

export interface PricedSingleSelectOptionGroup<
  TId extends StableId = StableId,
  TValueId extends StableId = StableId,
> extends OptionGroupBase<TId> {
  readonly kind: 'priced-single-select';
  readonly options: readonly PricedSelectOption<TValueId>[];
}

export interface TextOptionGroup<
  TId extends StableId = StableId,
> extends OptionGroupBase<TId> {
  readonly kind: 'text';
  readonly multiline: boolean;
  readonly maxLength: number;
  readonly trim: true;
}

export interface DateOptionGroup<
  TId extends StableId = StableId,
> extends OptionGroupBase<TId> {
  readonly kind: 'date';
}

export type OptionGroup<
  TId extends StableId = StableId,
  TValueId extends StableId = StableId,
> =
  | SingleSelectOptionGroup<TId, TValueId>
  | MultiSelectOptionGroup<TId, TValueId>
  | PricedSingleSelectOptionGroup<TId, TValueId>
  | TextOptionGroup<TId>
  | DateOptionGroup<TId>;
