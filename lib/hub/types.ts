export type Stage = 'development' | 'completed' | 'maintenance';

/**
 * Hub-wide tag taxonomy
 * Used for filtering, search, and categorization
 */
export type HubTag =
  // Core flow
  | 'input'
  | 'output'
  | 'tool'

  // Security & privacy
  | 'security'
  | 'privacy'
  | 'compliance'
  | 'secrets'
  | 'policy'
  | 'legal'

  // Safety
  | 'content-safety'
  | 'health'
  | 'healthcare'
  | 'validation'

  // Ops & platform
  | 'operations'
  | 'cost'
  | 'quality'
  | 'performance'
  | 'observability'
  | 'stability'

  // Advanced / custom
  | 'custom'
  | 'ml'
  | 'tooling'

  // Business
  | 'enterprise'
  | 'finance';


export interface HubStats {
  views: number;
  likes: number;
  shares: number;
}

export interface GuardrailMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: HubTag[];
  stage: Stage;
  icon: string;
  stats: HubStats;
}

export interface ProfileMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  guardrails: string[];
  tags: HubTag[];
  stage: Stage;
  icon: string;
  stats: HubStats;
}
