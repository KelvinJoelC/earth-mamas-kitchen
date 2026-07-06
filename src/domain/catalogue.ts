import type { StableId } from '@/domain/ids';

export type Availability = 'active' | 'inactive';

export interface CatalogueItem<TId extends StableId = StableId> {
  readonly id: TId;
  readonly label: string;
  readonly description?: string;
  readonly availability: Availability;
}
