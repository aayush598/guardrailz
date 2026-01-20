# Guardrailz SDK

Official JavaScript SDK for **Guardrailz** — enterprise-grade guardrails for AI applications.

Protect your LLM inputs and outputs against:

- Prompt injection
- PII & sensitive data leaks
- Unsafe or non-compliant content
- Custom policy violations

---

## Installation

```bash
npm install @guardrailz/sdk
# or
yarn add @guardrailz/sdk
```

---

## Quick Start

```ts
import { GuardrailsClient } from '@guardrailz/sdk';

const client = new GuardrailsClient({
  baseUrl: 'https://guardrailz.vercel.app',
  apiKey: process.env.GUARDRAILZ_API_KEY,
});

const result = await client.validate({
  text: 'Hello world',
  profileName: 'default',
  validationType: 'input',
});

console.log(result);
```

---

## API

### `new GuardrailsClient(config)`

```ts
interface GuardrailsSDKConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs?: number;
  retries?: number;
}
```

---

### `client.validate(request)`

```ts
interface ValidateInputRequest {
  text: string;
  profileName: string;
  validationType: 'input' | 'output' | 'tool';
}
```

Returns detailed guardrail execution results including:

- Pass / fail status
- Execution time
- Guardrail-level decisions

---

## Documentation

Full docs available at:  
https://guardrailz.vercel.app/docs

---

## License

MIT © Guardrailz
