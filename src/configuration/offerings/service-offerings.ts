import { eventsCatering } from '@/configuration/offerings/services/events-catering';

export const serviceOfferings = [eventsCatering] as const;

export type ServiceOfferingId = (typeof serviceOfferings)[number]['id'];
