import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

export interface UrlFileBlockerConfig {
  allowLocalhost?: boolean;
  allowRelativePaths?: boolean;
  blockedExtensions?: string[];
}

export class UrlFileBlockerGuardrail extends BaseGuardrail<UrlFileBlockerConfig> {
  private readonly urlPatterns: RegExp[];
  private readonly filePatterns: RegExp[];
  private readonly blockedExtensions: Set<string>;

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as UrlFileBlockerConfig;
    super('UrlFileBlocker', 'input', resolved);

    this.blockedExtensions = new Set(
      (resolved.blockedExtensions ?? ['env', 'pem', 'key', 'crt', 'sqlite', 'db', 'bak']).map((e) =>
        e.toLowerCase(),
      ),
    );

    this.urlPatterns = [
      /\bhttps?:\/\/[^\s]+/i,
      /\bftp:\/\/[^\s]+/i,
      /\bwww\.[^\s]+/i,
      /\b\d{1,3}(\.\d{1,3}){3}\b/, // IPv4
    ];

    this.filePatterns = [
      /file:\/\/[^\s]+/i,
      /\b[a-zA-Z]:\\[^\s]+/, // Windows paths
      /\/(?:etc|var|usr|home|opt|tmp)\/[^\s]*/i, // Unix paths
    ];
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty or invalid input',
      });
    }

    const matches: string[] = [];

    for (const rx of this.urlPatterns) {
      const m = text.match(rx);
      if (m) matches.push(m[0]);
    }

    for (const rx of this.filePatterns) {
      const m = text.match(rx);
      if (m) matches.push(m[0]);
    }

    // File extension scan
    for (const ext of this.blockedExtensions) {
      const rx = new RegExp(`\\.${ext}\\b`, 'i');
      if (rx.test(text)) {
        matches.push(`*.${ext}`);
      }
    }

    if (matches.length === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'error',
      message: 'URLs or file references are not allowed in input',
      metadata: {
        matches: matches.slice(0, 5),
        totalMatches: matches.length,
      },
    });
  }
}
