import { HubProfile } from '../domain/hub-profile';
import { HubItem } from '../domain/hub-item';

export const PROFILES: HubProfile[] = [
  /* =========================================================================
   * GENERAL PURPOSE
   * ========================================================================= */

  {
    id: 'default',
    slug: 'default',
    name: 'Default Production',
    description: 'Baseline safety and security for most production LLM applications.',
    fullDescription: `
The **Default Production** profile is our recommended starting point for most commercial LLM applications. It strikes a carefully tuned balance between security, safety, and user experience, ensuring that your application remains helpful while being protected against common threats.

This profile is designed to be "set and forget" for standard use cases like customer support, content generation, and knowledge retrieval. It addresses the top OWASP for LLM vulnerabilities, including prompt injection and PII leakage, without requiring deep security expertise to configure.
    `.trim(),
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
    benefits: [
      {
        title: 'Core Security Coverage',
        description:
          'Protects against the most prevalent attacks like prompt injection and jailbreaking.',
        icon: 'shield-check',
      },
      {
        title: 'PII Protection',
        description:
          'Automatically detects and redact sensitive personal information in both input and output.',
        icon: 'eye-off',
      },
      {
        title: 'Low Latency',
        description:
          'Optimized rule set ensures minimal impact on your application response times.',
        icon: 'zap',
      },
    ],
    useCases: [
      'General purpose customer support chatbots',
      'Marketing content generation tools',
      'Internal knowledge base Q&A systems',
    ],
    implementation: {
      title: 'Quick Start Configuration',
      language: 'json',
      code: `{
  "profile": "default",
  "config": {
    "pii_threshold": "0.8",
    "block_on_injection": true
  }
}`,
    },
    faq: [
      {
        question: 'Is this profile suitable for high-risk applications?',
        answer:
          'For high-risk domains (finance, healthcare), we recommend using their specific profiles which have stricter compliance controls.',
      },
      {
        question: 'Does this affect model creativity?',
        answer:
          'Minimal impact. The guardrails focus on safety boundaries rather than constraining the style or creativity of the output.',
      },
    ],
  },

  {
    id: 'internal-tools',
    slug: 'internal-tools',
    name: 'Internal Tools',
    description: 'Safe defaults for internal employee-facing AI tools.',
    fullDescription: `
The **Internal Tools** profile is specifically engineered for applications used by employees within your organization. Unlike public-facing bots, internal tools often need to handle sensitive company data (code, docs, strategy) while preventing that data from leaking to external model providers or logs.

This profile focuses heavily on *outbound* data security—ensuring that secrets, keys, and proprietary PII don't accidentally leave your secure perimeter via the LLM prompt or logs.
    `.trim(),
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
    benefits: [
      {
        title: 'Data Leak Prevention',
        description:
          'Aggressively scans for API keys, internal hostnames, and proprietary data markers.',
        icon: 'lock',
      },
      {
        title: 'Logging Safety',
        description:
          'Ensures that sensitive inputs are redacted before being written to any application logs.',
        icon: 'file-text',
      },
      {
        title: 'Model Stability',
        description:
          'Pins model versions to prevent unexpected behavioral changes in internal workflows.',
        icon: 'anchor',
      },
    ],
    useCases: [
      'Internal code assistant / co-pilot',
      'HR policy Q&A bot',
      'Sales strategy document summarizer',
    ],
    implementation: {
      title: 'Internal Tool Setup',
      language: 'yaml',
      code: `profile: internal-tools
overrides:
  internal-data-leak:
    patterns:
      - "CONFIDENTIAL"
      - "INTERNAL USE ONLY"
  secrets-in-logs:
    redact_mode: "hash"`,
    },
    faq: [
      {
        question: 'Can I use this for customer-facing bots?',
        answer:
          'It is not ideal. This profile prioritizes protecting company data over filtering NSFW content or jailbreaks, which are more critical for public bots.',
      },
      {
        question: 'Does it block all PII?',
        answer:
          'It warns on PII but allows employee names/emails if configured, assuming internal usage context.',
      },
    ],
  },

  /* =========================================================================
   * ENTERPRISE & SAAS
   * ========================================================================= */

  {
    id: 'enterprise-security',
    slug: 'enterprise-security',
    name: 'Enterprise Security',
    description: 'Enterprise-grade protection with strict leakage and access controls.',
    fullDescription: `
**Enterprise Security** is our most rigorous general-purpose security profile. It is designed for large-scale enterprises with zero-trust environments. This profile enforces strict access controls, comprehensive audit logging, and deep inspection of both inputs and outputs.

It goes beyond simple filtering to include IAM permission checks and tool access controls, making it suitable for applications that integrate deeper into enterprise infrastructure.
    `.trim(),
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
    benefits: [
      {
        title: 'Zero Trust Alignment',
        description:
          'Validates permissions and access controls for every tool call and data access attempt.',
        icon: 'user-check',
      },
      {
        title: 'Comprehensive Auditing',
        description: 'Enforces structure logging for compliance and forensic analysis.',
        icon: 'list',
      },
      {
        title: 'Deep Packet Inspection',
        description: 'Analyzes prompts for sophisticated attacks including indirect injections.',
        icon: 'search',
      },
    ],
    useCases: [
      'Enterprise-wide AI gateways',
      'Automated financial reporting tools',
      'Executive decision support systems',
    ],
    implementation: {
      title: 'Enterprise Policy',
      language: 'json',
      code: `{
  "profile": "enterprise-security",
  "integration": {
    "iam_provider": "aws-iam",
    "audit_sink": "splunk"
  }
}`,
    },
    faq: [
      {
        question: 'Does this introduce latency?',
        answer:
          'Yes, due to the depth of inspection and external IAM checks, expect a 50-100ms overhead compared to the default profile.',
      },
      {
        question: 'Is it HIPAA compliant?',
        answer:
          'It includes PHI awareness, but for strict HIPAA compliance, use the dedicated Healthcare profile.',
      },
    ],
  },

  {
    id: 'saas-multi-tenant',
    slug: 'saas-multi-tenant',
    name: 'SaaS Multi-Tenant',
    description: 'Isolation and safety for multi-tenant SaaS AI platforms.',
    fullDescription: `
The **SaaS Multi-Tenant** profile addresses the unique challenges of building AI features into a SaaS product where multiple customers (tenants) share the same underlying models and infrastructure.

The primary goal here is **Tenant Isolation**. It ensures that a prompt from Customer A cannot trick the model into revealing data from Customer B, and that one tenant cannot potentially exhaust resources meant for others.
    `.trim(),
    guardrails: [
      'cross-context-manipulation',
      'internal-data-leak',
      'output-schema-validation',
      'rate-limit',
      'cost-threshold',
    ],
    tags: ['security'],
    stage: 'completed',
    icon: 'grid',
    stats: { views: 1450, likes: 320, shares: 89 },
    benefits: [
      {
        title: 'Tenant Isolation',
        description: 'Prevents "cross-contamination" of context between different user sessions.',
        icon: 'users',
      },
      {
        title: 'Resource Fairness',
        description: 'Enforces rate limits per tenant ID to preventing "noisy neighbor" issues.',
        icon: 'bar-chart',
      },
      {
        title: 'Schema Enforcement',
        description:
          'Guarantees that JSON outputs match the expected schema for your frontend to consume.',
        icon: 'code',
      },
    ],
    useCases: [
      'B2B SaaS platforms with AI features',
      'Multi-user collaborative editors',
      'Freemium AI services',
    ],
    implementation: {
      title: 'Multitenancy Config',
      language: 'typescript',
      code: `const config = {
  profile: 'saas-multi-tenant',
  context: {
    tenantId: request.headers['x-tenant-id'],
    plan: 'enterprise'
  }
};`,
    },
    faq: [
      {
        question: 'How do you handle rate limits?',
        answer: 'Rate limits are keyed by the `tenantId` you provide in the context object.',
      },
    ],
  },

  /* =========================================================================
   * REGULATED INDUSTRIES
   * ========================================================================= */

  {
    id: 'healthcare-hipaa',
    slug: 'healthcare-hipaa',
    name: 'Healthcare (HIPAA)',
    description: 'HIPAA-aligned protections for healthcare and clinical AI.',
    fullDescription: `
Our **Healthcare (HIPAA)** profile is purpose-built for the rigorous demands of the healthcare industry. It prioritizes the detection and protection of Protected Health Information (PHI) and attempts to prevent the model from providing dangerous or unverified medical advice.

**Note:** While this profile provides technical controls to support HIPAA compliance, you must also ensure your BAA and data handling processes are in place.
    `.trim(),
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
    benefits: [
      {
        title: 'PHI Redaction',
        description:
          'Detects 18 HIPAA identifiers in text and redacts them before logging or third-party transmission.',
        icon: 'eye-off',
      },
      {
        title: 'Medical Advice Safety',
        description: 'Flags or blocks instances where the model attempts to diagnose or prescribe.',
        icon: 'activity',
      },
      {
        title: 'Consent Verification',
        description: 'Checks for markers of user consent before processing sensitive health data.',
        icon: 'check-circle',
      },
    ],
    useCases: [
      'Patient triage intake bots',
      'Clinical note summarization',
      'Medical insurance claims processing',
    ],
    implementation: {
      title: 'HIPAA Configuration',
      language: 'json',
      code: `{
  "profile": "healthcare-hipaa",
  "data_retention": "zero",
  "audit_trail": true
}`,
    },
    faq: [
      {
        question: 'Does this replace a doctor?',
        answer:
          'Absolutely not. The `medical-advice` guardrail is specifically designed to remind users to seek professional help.',
      },
    ],
  },

  {
    id: 'financial-services',
    slug: 'financial-services',
    name: 'Financial Services',
    description: 'Compliance and safety for banking, fintech, and payments.',
    fullDescription: `
The **Financial Services** profile focuses on the specific needs of banking, fintech, and insurance sectors. It places a heavy emphasis on data confidentiality, non-defamation, and providing a rigorous audit trail for all AI decisions.

It includes specialized checks to prevent the model from making unauthorized financial commitments or giving unverified investment advice.
    `.trim(),
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
    benefits: [
      {
        title: 'GLBA/SOX Ready',
        description: 'Logging and data handling controls aligned with financial regulations.',
        icon: 'file-text',
      },
      {
        title: 'Financial Advice Guard',
        description: 'Prevents the model from providing specific investment recommendations.',
        icon: 'trending-up',
      },
      {
        title: 'Defamation Filter',
        description:
          'Reduces risk of liability by filtering potentially defamatory statements about entities.',
        icon: 'shield',
      },
    ],
    useCases: [
      'Customer banking assistance',
      'Fraud detection explanation',
      'Investment research summaries',
    ],
    implementation: {
      title: 'FinServ Setup',
      language: 'yaml',
      code: `profile: financial-services
policies:
  investment_advice: block
  competitor_mention: monitor`,
    },
    faq: [
      {
        question: 'Does it support PCI-DSS?',
        answer:
          'The PII detector includes credit card number detection to help keep PCI data out of logs.',
      },
    ],
  },

  /* =========================================================================
   * CONTENT & CONSUMER APPS
   * ========================================================================= */

  {
    id: 'child-safety',
    slug: 'child-safety',
    name: 'Child Safety',
    description: 'Maximum protection for child-focused and educational applications.',
    fullDescription: `
**Child Safety** is our strictest content moderation profile. Designed for educational tools, games, and platforms catering to minors, it implements a "safety-first" policy that aggressively filters any content that could be harmful, inappropriate, or frightening.

This profile has a very low tolerance false negatives—it would rather block a safe message than let a harmful one through.
    `.trim(),
    guardrails: ['nsfw-content', 'hate-speech', 'violence', 'self-harm', 'language-restriction'],
    tags: ['content-safety'],
    stage: 'completed',
    icon: 'heart',
    stats: { views: 780, likes: 102, shares: 33 },
    benefits: [
      {
        title: 'Strict Content Filtering',
        description: 'Zero-tolerance policy for NSFW, violence, hate speech, and self-harm topics.',
        icon: 'shield-off',
      },
      {
        title: 'Language Simplification',
        description: 'Encourages simple, age-appropriate language in model outputs.',
        icon: 'message-circle',
      },
      {
        title: 'Bullying Detection',
        description: 'Specialized classifiers to detect and intervene in cyberbullying patterns.',
        icon: 'alert-triangle',
      },
    ],
    useCases: [
      'K-12 educational tutors',
      'Social platforms for kids',
      'Interactive storytelling games',
    ],
    implementation: {
      title: 'Child Safety Config',
      language: 'json',
      code: `{
  "profile": "child-safety",
  "age_group": "under-13",
  "filter_strength": "maximum"
}`,
    },
    faq: [
      {
        question: 'Is it COPPA compliant?',
        answer:
          'It helps with COPPA compliance by preventing the collection of PII from children and filtering inappropriate content.',
      },
    ],
  },

  {
    id: 'consumer-chatbot',
    slug: 'consumer-chatbot',
    name: 'Consumer Chatbot',
    description: 'Balanced safety for public-facing chatbots.',
    fullDescription: `
The **Consumer Chatbot** profile is the industry standard for general public engagement. Whether you are building a brand ambassador, a shopping assistant, or a fun character bot, this profile manages reputation risk by preventing the bot from "going off the rails."

It handles the tricky edge cases of public interaction: handling trolls, avoiding hallucinations, and maintaining a respectful tone.
    `.trim(),
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
    benefits: [
      {
        title: 'Reputation Protection',
        description:
          'Prevents your bot from being tricked into saying offensive or brand-damaging things.',
        icon: 'thumbs-up',
      },
      {
        title: 'Hallucination Checks',
        description: 'Verifies facts against provided context to reduce "made up" answers.',
        icon: 'check-square',
      },
      {
        title: 'Troll Resistance',
        description: 'Resilient against users attempting to confuse or anger the bot.',
        icon: 'anchor',
      },
    ],
    useCases: ['E-commerce shopping assistants', 'Brand engagement bots', 'Virtual concierges'],
    implementation: {
      title: 'Bot Config',
      language: 'javascript',
      code: `const botConfig = {
  profile: 'consumer-chatbot',
  personality: 'friendly',
  strictness: 'medium'
};`,
    },
    faq: [
      {
        question: 'Will this block slang?',
        answer: 'No, it understands context (slang vs. hate speech) to allow natural coversation.',
      },
    ],
  },

  /* =========================================================================
   * AGENTS & TOOL USE
   * ========================================================================= */

  {
    id: 'agentic-ai',
    slug: 'agentic-ai',
    name: 'Agentic AI',
    description: 'Safety for autonomous agents with tool execution.',
    fullDescription: `
The **Agentic AI** profile is a cutting-edge security set designed for the new wave of autonomous agents. When an LLM can execute code, call APIs, or browse the web, the risk profile changes dramatically.

This profile acts as a sandbox, monitoring the *intent* and *payload* of tool calls. It prevents agents from executing destructive commands (like \`rm -rf\`), exfiltrating data via curl, or browsing to malicious application endpoints.
    `.trim(),
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
    benefits: [
      {
        title: 'Tool Sandboxing',
        description:
          'Validates arguments of function calls to prevent injection attacks and misuse.',
        icon: 'box',
      },
      {
        title: 'Destructive Action Block',
        description:
          'Detects and blocks commands that delete data, stop services, or modify system configs.',
        icon: 'slash',
      },
      {
        title: 'Loop Prevention',
        description: 'Monitors for run-away agents stuck in execution loops.',
        icon: 'repeat',
      },
    ],
    useCases: [
      'Autonomous coding agents',
      'Data analysis pipelines',
      'Customer support agents with refund capabilities',
    ],
    implementation: {
      title: 'Agent Setup',
      language: 'python',
      code: `agent = GuardrailAgent(
  profile="agentic-ai",
  tools=[calculator, weather_api],
  allow_file_system=False
)`,
    },
    faq: [
      {
        question: 'Does this work with LangChain?',
        answer: 'Yes, it integrates as a middleware in the LangChain execution loop.',
      },
    ],
  },

  {
    id: 'developer-playground',
    slug: 'developer-playground',
    name: 'Developer Playground',
    description: 'Relaxed guardrails for experimentation and testing.',
    fullDescription: `
The **Developer Playground** profile is designed for non-production environments where flexibility is key. It turns off most restrictive filters (like strict PII blocking or tone policing) to allow developers to test the raw capabilities of the model.

However, it maintains basic sanity checks (like huge payload protection and telemetry) to ensure the development environment remains stable and observable.
    `.trim(),
    guardrails: ['input-size', 'rate-limit', 'telemetry-enforcement'],
    tags: ['input'],
    stage: 'completed',
    icon: 'code',
    stats: { views: 1320, likes: 301, shares: 88 },
    benefits: [
      {
        title: 'Maximum Flexibility',
        description:
          'Minimum interference with model outputs, ideal for debugging prompt engineering.',
        icon: 'maximize',
      },
      {
        title: 'Rapid Iteration',
        description: 'High rate limits and low latency configuration for fast feedback loops.',
        icon: 'zap',
      },
      {
        title: 'Debug Telemetry',
        description:
          'Enhanced logging to help you understand exactly what the model is seeing and thinking.',
        icon: 'terminal',
      },
    ],
    useCases: [
      'Local development environments',
      'Prompt engineering logic',
      'Unit testing pipelines',
    ],
    implementation: {
      title: 'Dev Config',
      language: 'bash',
      code: `export GUARDRAIL_PROFILE=developer-playground
npm run dev`,
    },
    faq: [
      {
        question: 'Should I use this in production?',
        answer:
          'Never. It lacks essential security protections required for public or enterprise use.',
      },
    ],
  },

  /* =========================================================================
   * OPERATIONS & COST CONTROL
   * ========================================================================= */

  {
    id: 'cost-optimized',
    slug: 'cost-optimized',
    name: 'Cost Optimized',
    description: 'Aggressive cost and rate controls for high-volume workloads.',
    fullDescription: `
The **Cost Optimized** profile is all about efficiency. For high-volume applications where unit economics are critical, this profile enforces strict token budgets, context window limits, and aggressive caching strategies.

It is designed to stop expensive queries before they hit the LLM provider, saving both money and computational resources.
    `.trim(),
    guardrails: ['rate-limit', 'cost-threshold', 'model-version-pin', 'quality-threshold'],
    tags: ['finance'],
    stage: 'completed',
    icon: 'trending-down',
    stats: { views: 960, likes: 188, shares: 52 },
    benefits: [
      {
        title: 'Budget Enforcement',
        description:
          'Automatically rejects requests that are estimated to exceed a defined cost threshold.',
        icon: 'dollar-sign',
      },
      {
        title: 'Token Economy',
        description: 'Trims excessive context and history to minimize token usage per call.',
        icon: 'scissors',
      },
      {
        title: 'Smart Caching',
        description: 'Aggressively caches frequent similar queries to bypass the LLM entirely.',
        icon: 'database',
      },
    ],
    useCases: [
      'Free-tier public users',
      'High-volume background batch processing',
      'Internal search indexing',
    ],
    implementation: {
      title: 'Budget Config',
      language: 'json',
      code: `{
  "profile": "cost-optimized",
  "max_cost_per_req": 0.02,
  "monthly_budget": 500
}`,
    },
    faq: [
      {
        question: 'Does this degrade quality?',
        answer:
          'It can, if token limits are set too tight. It requires tuning for your specific use case.',
      },
    ],
  },

  {
    id: 'compliance-audit',
    slug: 'compliance-audit',
    name: 'Compliance & Audit',
    description: 'Maximum observability and compliance enforcement.',
    fullDescription: `
The **Compliance & Audit** profile is built for legal and regulatory teams. It doesn't just focus on blocking bad inputs; it focuses on *proving* what happened. Every interaction is logged with cryptographic integrity, PII is rigorously managed, and data retention policies are strictly enforced.

Use this profile when you need to be ready for a GDPR audit or a legal discovery request.
    `.trim(),
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
    benefits: [
      {
        title: 'Full Audit Trail',
        description:
          'Immutable logging of inputs, outputs, decisions, and guardrail interventions.',
        icon: 'file-text',
      },
      {
        title: 'GDPR / CCPA Tools',
        description: 'Native support for "Right to be Forgotten" and data minimization principles.',
        icon: 'user-check',
      },
      {
        title: 'Data Sovereignty',
        description:
          'Configurable routing to ensure data stays within specific geographic regions.',
        icon: 'globe',
      },
    ],
    useCases: [
      'Legal discovery tools',
      'government contract work',
      'European market applications (GDPR)',
    ],
    implementation: {
      title: 'Audit Config',
      language: 'yaml',
      code: `profile: compliance-audit
storage:
  region: eu-west-1
  retention_days: 365
  encryption: enabled`,
    },
    faq: [
      {
        question: 'Is the logging encrypted?',
        answer: 'Yes, all audit logs are encrypted at rest and in transit.',
      },
    ],
  },
];

/**
 * Hub catalog normalized to HubItem
 * UI consumes only HubItem
 */
export const profileCatalog: HubItem[] = PROFILES.map(
  (p): HubItem => ({
    id: p.id,
    slug: p.slug,
    type: 'profile',
    name: p.name,
    description: p.description,
    tags: p.tags,
    stage: p.stage,
    icon: p.icon,
    stats: p.stats,
  }),
);
