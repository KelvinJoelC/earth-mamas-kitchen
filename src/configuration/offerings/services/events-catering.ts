import type { BusinessRuleId } from '@/configuration/rules/rules';
import type { WorkflowId } from '@/configuration/workflows/workflows';
import type { ServiceOfferingDefinition } from '@/domain/offerings';

export const eventsCatering = {
  id: 'events-catering',
  slug: 'events-catering',
  name: 'Events & Catering',
  summary:
    'A personalised consultation pathway for large or complex event requirements.',
  workflowId: 'custom-enquiry',
  ruleIds: [],
} as const satisfies ServiceOfferingDefinition<
  'events-catering',
  WorkflowId,
  BusinessRuleId
>;
