import type { CatalogueItem } from '@/domain/catalogue';
import type { StableId } from '@/domain/ids';

export type AllergenCategory =
  'cereal' | 'dairy' | 'egg' | 'legume' | 'tree-nut' | 'seed' | 'preservative';

export interface AllergenDefinition<
  TId extends StableId = StableId,
> extends CatalogueItem<TId> {
  readonly category: AllergenCategory;
}

export interface AllergenProfile<TAllergenId extends StableId = StableId> {
  readonly contains: readonly TAllergenId[];
  readonly basis: 'case-study-assumption';
}

export interface EdibleCatalogueItem<
  TId extends StableId = StableId,
  TAllergenId extends StableId = StableId,
> extends CatalogueItem<TId> {
  readonly allergens: AllergenProfile<TAllergenId>;
}

export interface AllergenPolicy {
  readonly crossContaminationWarning: string;
  readonly assumptionNote: string;
}
