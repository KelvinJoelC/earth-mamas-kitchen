import type { OptionGroup } from '@/domain/option-groups';
import type { StableId } from '@/domain/ids';

export type WorkflowType =
  'guided-preorder' | 'design-brief-preorder' | 'custom-enquiry';

export interface WorkflowDefinition<
  TId extends StableId = StableId,
  TOptionGroup extends OptionGroup = OptionGroup,
> {
  readonly id: TId;
  readonly type: WorkflowType;
  readonly name: string;
  readonly description: string;
  readonly optionGroups: readonly TOptionGroup[];
}
