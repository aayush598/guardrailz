import { HubTag } from '@/modules/hub/domain/hub-tags';

export interface HubFilter {
  query: string;
  tags: HubTag[];
  type: 'all' | 'guardrail' | 'profile';
}
