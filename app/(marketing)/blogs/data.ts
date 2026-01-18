export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  coverImage: string;
  tags: string[];
  readingTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'mastering-llm-security-guardrails',
    title: 'Mastering LLM Security: A Guide to Guardrails',
    excerpt:
      'Explore the essential strategies for securing Large Language Model applications. From prompt injection to output validation, learn how to build robust guardrails.',
    date: 'Jan 15, 2026',
    author: {
      name: 'Aayush Gid',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aayush',
      role: 'Security Engineer',
    },
    coverImage: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    tags: ['Security', 'LLM', 'Best Practices'],
    readingTime: '10 min read',
    content: `
## Introduction

The rapid adoption of Large Language Models (LLMs) has revolutionized software development, but it has also introduced a new class of security vulnerabilities. Securing these stochastic systems requires a fundamental shift in how we approach application security. In this guide, we'll explore the critical concept of "Guardrails" and how they serve as the first line of defense for your AI applications.

### The Vulnerability Landscape

LLMs are susceptible to a variety of attacks, most notably **Prompt Injection**. This occurs when an attacker manipulates the model's input to override its original instructions.

> "Prompt injection is not a bug in the code; it's a feature of how LLMs process language."

Other threats include:
- **PII Leakage**: The model accidentally revealing sensitive information.
- **Hallucinations**: Generating factually incorrect or nonsensical information.
- **Jailbreaking**: Bypassing safety filters to generate harmful content.

### Implementing Robust Guardrails

A robust guardrail system sits between the user and the LLM, intercepting both inputs and outputs.

#### 1. Input Guardrails
These sanitize the user's prompt before it reaches the model. They check for malicious patterns, attempt to detect injection attacks, and ensure the request is on-topic.

#### 2. Output Guardrails
These validate the model's response. They scan for leaked PII, toxicity, and relevance. If the response violates a policy, the guardrail blocks it and returns a safe fallback message.

### Conclusion

Building secure LLM applications is not just about choosing the right model; it's about wrapping that model in a secure infrastructure. Guardrails provides the necessary control and observability to deploy AI with confidence.
    `,
  },
  {
    slug: 'building-reliable-rag-pipelines',
    title: 'Building Reliable RAG Pipelines with Observability',
    excerpt:
      'Retrieval-Augmented Generation (RAG) is powerful but prone to errors. Discover how to use observability tools to monitor retrieval quality and generation accuracy.',
    date: 'Jan 10, 2026',
    author: {
      name: 'Aayush Gid',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aayush',
      role: 'AI Architect',
    },
    coverImage: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    tags: ['RAG', 'Observability', 'Engineering'],
    readingTime: '8 min read',
    content: `
## The Reality of RAG

Retrieval-Augmented Generation (RAG) has become the standard for building knowledgeable AI agents. However, a RAG system is only as good as its retrieval step. If the model fetches the wrong context, it will generate the wrong answer—a phenomenon known as "Garbage In, Garbage Out."

### Why Observability Matters

You can't fix what you can't measure. In a production RAG pipeline, you need visibility into three key stages:

1.  **Retrieval**: Are we finding the most relevant documents?
2.  **Ranking**: Are the best documents being prioritized?
3.  **Generation**: Is the model effectively using the context provided?

### Key Metrics to Track

- **Context Precision**: The proportion of retrieved chunks that are actually relevant to the query.
- **Context Recall**: Is the system retrieving *all* the necessary information?
- **Answer Faithfulness**: Does the generated answer rely solely on the provided context, or is the model hallucinating from its pre-training data?

### Improving Reliability

By instrumenting your pipeline with tools like Guardrailz, you can trace individual requests and pinpoint exactly where the breakdown occurs. This allows for data-driven iteration, moving from "it feels better" to "score improved by 15%."
    `,
  },
  {
    slug: 'future-of-ai-agents-json-mode',
    title: 'The Future of AI Agents: Function Calling and JSON Mode',
    excerpt:
      'Structured output is the key to useful agents. Learn how to leverage Function Calling and JSON Mode to create deterministic and reliable AI workflows.',
    date: 'Jan 02, 2026',
    author: {
      name: 'Aayush Gid',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aayush',
      role: 'Tech Lead',
    },
    coverImage: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    tags: ['Agents', 'JSON', 'Development'],
    readingTime: '6 min read',
    content: `
## Beyond Chatbots

The first wave of GenAI was dominated by chat interfaces. The next wave is about **Agents**—systems that can take action. To build effective agents, we need models that can speak the language of machines: **structured data**.

### The Problem with Natural Language

Parsing a paragraph of text to extract a date or a price is fragile. It requires complex regex and is prone to errors if the model phrases things slightly differently.

### Enter Function Calling

Function calling (or Tool Use) allows you to describe functions to the model, and have it output a JSON object containing the arguments to call those functions. This turns the LLM into a reasoning engine that drives your existing code.

### Ensuring Type Safety

Even with function calling, models can hallucinate arguments or output invalid JSON. This is where schema validation guardrails come in. By enforcing a strict Zod or JSON Schema on the model's output, we can guarantee that our downstream code receives valid data.

### Use Cases

- **Data Extraction**: Converting unstructured emails into database records.
- **Workflow Automation**: Agents that can query APIs, process data, and send reports.
- **UI Generation**: Generating dynamic UI components based on user intent.

Structured outputs are the bridge between the probabilistic world of AI and the deterministic world of software engineering.
    `,
  },
];
