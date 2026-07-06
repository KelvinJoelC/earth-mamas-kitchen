import { customEnquiryWorkflow } from '@/configuration/workflows/custom-enquiry';
import { designBriefPreorderWorkflow } from '@/configuration/workflows/design-brief-preorder';
import { guidedPreorderWorkflow } from '@/configuration/workflows/guided-preorder';

export const workflowDefinitions = [
  guidedPreorderWorkflow,
  designBriefPreorderWorkflow,
  customEnquiryWorkflow,
] as const;

export type WorkflowId = (typeof workflowDefinitions)[number]['id'];
