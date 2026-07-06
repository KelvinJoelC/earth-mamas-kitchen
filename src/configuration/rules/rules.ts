import { compatibilityRules } from '@/configuration/rules/compatibility-rules';
import { globalRules } from '@/configuration/rules/global-rules';
import { offeringRules } from '@/configuration/rules/offering-rules';
import { workflowRules } from '@/configuration/rules/workflow-rules';

export const businessRules = [
  ...globalRules,
  ...workflowRules,
  ...offeringRules,
  ...compatibilityRules,
] as const;

export type BusinessRuleId = (typeof businessRules)[number]['id'];
