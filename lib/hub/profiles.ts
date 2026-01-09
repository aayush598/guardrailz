export const PROFILES = [
  /* =========================================================================
   * GENERAL PURPOSE
   * ========================================================================= */

  {
    id: 'default',
    slug: 'default',
    name: 'Default Production',
    description: 'Baseline safety and security for most production LLM applications.',
    guardrails: [
      'input-size',
      'pii-detection',
      'secrets-in-input',
      'prompt-injection-signature',
      'jailbreak-pattern',
      'output-pii-redaction',
    ],
    tags: ['input', 'security'],
    stage: 'completed',
    icon: 'package',
    stats: { views: 2200, likes: 540, shares: 140 },
  },

  {
    id: 'internal-tools',
    slug: 'internal-tools',
    name: 'Internal Tools',
    description: 'Safe defaults for internal employee-facing AI tools.',
    guardrails: [
      'pii-detection',
      'internal-data-leak',
      'system-prompt-leak',
      'secrets-in-logs',
      'model-version-pin',
    ],
    tags: ['enterprise', 'security'],
    stage: 'completed',
    icon: 'shield',
    stats: { views: 980, likes: 210, shares: 54 },
  },

  /* =========================================================================
   * ENTERPRISE & SAAS
   * ========================================================================= */

  {
    id: 'enterprise-security',
    slug: 'enterprise-security',
    name: 'Enterprise Security',
    description: 'Enterprise-grade protection with strict leakage and access controls.',
    guardrails: [
      'pii-detection',
      'phi-awareness',
      'secrets-in-input',
      'internal-endpoint-leak',
      'iam-permission',
      'tool-access-control',
      'audit-log-enforcement',
    ],
    tags: ['enterprise', 'security'],
    stage: 'maintenance',
    icon: 'shield',
    stats: { views: 3100, likes: 890, shares: 230 },
  },

  {
    id: 'saas-multi-tenant',
    slug: 'saas-multi-tenant',
    name: 'SaaS Multi-Tenant',
    description: 'Isolation and safety for multi-tenant SaaS AI platforms.',
    guardrails: [
      'cross-context-manipulation',
      'internal-data-leak',
      'output-schema-validation',
      'rate-limit',
      'cost-threshold',
    ],
    tags: ['security', 'operations'],
    stage: 'completed',
    icon: 'grid',
    stats: { views: 1450, likes: 320, shares: 89 },
  },

  /* =========================================================================
   * REGULATED INDUSTRIES
   * ========================================================================= */

  {
    id: 'healthcare-hipaa',
    slug: 'healthcare-hipaa',
    name: 'Healthcare (HIPAA)',
    description: 'HIPAA-aligned protections for healthcare and clinical AI.',
    guardrails: [
      'phi-awareness',
      'medical-advice',
      'pii-detection',
      'output-pii-redaction',
      'retention-check',
      'user-consent-validation',
    ],
    tags: ['healthcare', 'compliance'],
    stage: 'completed',
    icon: 'heart',
    stats: { views: 1240, likes: 290, shares: 77 },
  },

  {
    id: 'financial-services',
    slug: 'financial-services',
    name: 'Financial Services',
    description: 'Compliance and safety for banking, fintech, and payments.',
    guardrails: [
      'pii-detection',
      'confidentiality',
      'defamation',
      'audit-log-enforcement',
      'model-version-pin',
    ],
    tags: ['finance', 'compliance'],
    stage: 'completed',
    icon: 'lock',
    stats: { views: 1670, likes: 402, shares: 110 },
  },

  /* =========================================================================
   * CONTENT & CONSUMER APPS
   * ========================================================================= */

  {
    id: 'child-safety',
    slug: 'child-safety',
    name: 'Child Safety',
    description: 'Maximum protection for child-focused and educational applications.',
    guardrails: [
      'nsfw-content',
      'hate-speech',
      'violence',
      'self-harm',
      'language-restriction',
    ],
    tags: ['content-safety'],
    stage: 'completed',
    icon: 'heart',
    stats: { views: 780, likes: 102, shares: 33 },
  },

  {
    id: 'consumer-chatbot',
    slug: 'consumer-chatbot',
    name: 'Consumer Chatbot',
    description: 'Balanced safety for public-facing chatbots.',
    guardrails: [
      'nsfw-content',
      'hate-speech',
      'jailbreak-pattern',
      'hallucination-risk',
      'citation-required',
    ],
    tags: ['content-safety'],
    stage: 'completed',
    icon: 'message',
    stats: { views: 2100, likes: 480, shares: 130 },
  },

  /* =========================================================================
   * AGENTS & TOOL USE
   * ========================================================================= */

  {
    id: 'agentic-ai',
    slug: 'agentic-ai',
    name: 'Agentic AI',
    description: 'Safety for autonomous agents with tool execution.',
    guardrails: [
      'tool-access-control',
      'destructive-tool-call',
      'command-injection-output',
      'sandboxed-output',
      'file-write-restriction',
    ],
    tags: ['tool', 'security'],
    stage: 'development',
    icon: 'activity',
    stats: { views: 890, likes: 155, shares: 41 },
  },

  {
    id: 'developer-playground',
    slug: 'developer-playground',
    name: 'Developer Playground',
    description: 'Relaxed guardrails for experimentation and testing.',
    guardrails: [
      'input-size',
      'rate-limit',
      'telemetry-enforcement',
    ],
    tags: ['operations'],
    stage: 'completed',
    icon: 'code',
    stats: { views: 1320, likes: 301, shares: 88 },
  },

  /* =========================================================================
   * OPERATIONS & COST CONTROL
   * ========================================================================= */

  {
    id: 'cost-optimized',
    slug: 'cost-optimized',
    name: 'Cost Optimized',
    description: 'Aggressive cost and rate controls for high-volume workloads.',
    guardrails: [
      'rate-limit',
      'cost-threshold',
      'model-version-pin',
      'quality-threshold',
    ],
    tags: ['cost', 'operations'],
    stage: 'completed',
    icon: 'trending-down',
    stats: { views: 960, likes: 188, shares: 52 },
  },

  {
    id: 'compliance-audit',
    slug: 'compliance-audit',
    name: 'Compliance & Audit',
    description: 'Maximum observability and compliance enforcement.',
    guardrails: [
      'telemetry-enforcement',
      'audit-log-enforcement',
      'gdpr-data-minimization',
      'right-to-erasure',
    ],
    tags: ['compliance', 'privacy'],
    stage: 'completed',
    icon: 'clipboard',
    stats: { views: 740, likes: 141, shares: 39 },
  },
];
