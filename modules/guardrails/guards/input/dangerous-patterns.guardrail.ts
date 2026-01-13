import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailAction, GuardrailSeverity } from '@/modules/guardrails/engine/types';

export interface DangerousPatternsConfig {
  /**
   * If true, BLOCK instead of WARN for medium-risk patterns
   * Default: false
   */
  strictMode?: boolean;

  /**
   * Custom regex patterns to add
   */
  customPatterns?: RegExp[];
}

type PatternCategory = 'malware' | 'exploit' | 'command_injection' | 'fraud' | 'weaponization';

interface DangerousMatch {
  category: PatternCategory;
  pattern: string;
}

export class DangerousPatternsGuardrail extends BaseGuardrail<DangerousPatternsConfig> {
  private readonly patterns: Record<PatternCategory, RegExp[]> = {
    malware: [/\b(ransomware|keylogger|trojan|spyware|backdoor)\b/i, /\b(botnet|ddos\s+attack)\b/i],
    exploit: [
      /\b(sql\s*injection|xss\s*payload|buffer\s*overflow)\b/i,
      /\b(remote\s+code\s+execution|privilege\s+escalation)\b/i,
    ],
    command_injection: [
      /\b(rm\s+-rf\s+\/)\b/i,
      /\b(curl\s+.*\|\s*sh)\b/i,
      /\b(wget\s+.*\|\s*bash)\b/i,
      /\b(powershell\s+-enc)\b/i,
    ],
    fraud: [
      /\b(credit\s*card\s+generator)\b/i,
      /\b(otp\s+bypass|account\s+takeover)\b/i,
      /\b(phishing\s+template)\b/i,
    ],
    weaponization: [
      /\b(make\s+a\s+bomb)\b/i,
      /\b(improvised\s+explosive)\b/i,
      /\b(weaponize\s+chemical)\b/i,
    ],
  };

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as DangerousPatternsConfig;
    super('DangerousPatterns', 'input', resolved);

    if (resolved.customPatterns?.length) {
      this.patterns.exploit.push(...resolved.customPatterns);
    }
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

    const matches = this.detect(text);

    if (matches.length === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    const highRisk = matches.some((m) =>
      ['malware', 'weaponization', 'command_injection'].includes(m.category),
    );

    const action: GuardrailAction = highRisk || this.config.strictMode ? 'BLOCK' : 'WARN';

    const severity: GuardrailSeverity = action === 'BLOCK' ? 'critical' : 'warning';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity,
      message: 'Dangerous or malicious intent detected',
      metadata: {
        categories: [...new Set(matches.map((m) => m.category))],
        matches: matches.slice(0, 5),
      },
    });
  }

  private detect(text: string): DangerousMatch[] {
    const hits: DangerousMatch[] = [];

    for (const [category, patterns] of Object.entries(this.patterns)) {
      for (const rx of patterns) {
        if (rx.test(text)) {
          hits.push({
            category: category as PatternCategory,
            pattern: rx.source,
          });
        }
      }
    }

    return hits;
  }
}
