import { HubTag } from '@/modules/hub/domain/hub-tags';
import { Stage } from '@/modules/hub/domain/hub-stage';

export interface HubProfile {
  id: string;
  slug: string;
  name: string;
  description: string;

  /**
   * Guardrail IDs included in this profile
   * (references hub guardrails by ID)
   */
  guardrails: string[];

  tags: HubTag[];
  stage: Stage;
  icon: string;

  stats: {
    views: number;
    likes: number;
    shares: number;
  };

  // Expanded Details (Optional for now, strictly enforced for one template profile)
  fullDescription?: string; // Markdown supported

  benefits?: {
    title: string;
    description: string;
    icon?: string;
  }[];

  useCases?: string[];

  // Code Example
  implementation?: {
    title: string;
    language: string;
    code: string;
  };

  faq?: {
    question: string;
    answer: string;
  }[];
}
