import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

export interface MedicalAdviceGuardrailConfig {
  /** Block even soft advice like "you should take rest" */
  strictMode?: boolean;

  /** Allow first-aid / emergency safety info */
  allowFirstAid?: boolean;

  /** Custom blocked keywords */
  customBlocklist?: string[];
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */

export class MedicalAdviceGuardrail extends BaseGuardrail<MedicalAdviceGuardrailConfig> {
  private diagnosisPatterns: RegExp[];
  private treatmentPatterns: RegExp[];
  private prescriptionPatterns: RegExp[];
  private disclaimerPatterns: RegExp[];

  private firstAidPatterns: RegExp[];

  private customBlocklist: Set<string>;

  constructor(config?: unknown) {
    const resolved = (config ?? {}) as MedicalAdviceGuardrailConfig;
    super('MedicalAdvice', 'input', resolved);

    this.customBlocklist = new Set((resolved.customBlocklist ?? []).map((v) => v.toLowerCase()));

    /* ------------------------- Diagnosis Detection ------------------------- */
    this.diagnosisPatterns = [
      /\b(you have|you might have|this is)\s+(diabetes|cancer|asthma|depression|infection)\b/i,
      /\bdiagnos(e|is|ed|ing)\b/i,
    ];

    /* -------------------------- Treatment Advice --------------------------- */
    this.treatmentPatterns = [
      /\b(you should|you need to|i recommend|try to)\s+(take|avoid|use|stop|rest|sleep|hydrate|drink|eat|exercise|stretch|fast|ice|heat|elevate)\b/i,
      /\b(treatment|therapy|medication|medicine)\b/i,
    ];

    /* ------------------------- Prescription / Dosage ------------------------ */
    this.prescriptionPatterns = [
      /\b(take|increase|decrease)\s+\d+(mg|ml|tablets?)\b/i,
      /\b(prescribe|dosage|dose)\b/i,
    ];

    /* ------------------------ Medical Disclaimer ---------------------------- */
    this.disclaimerPatterns = [/\b(not a doctor|not medical advice|consult a professional)\b/i];

    /* -------------------------- First Aid Allowed --------------------------- */
    this.firstAidPatterns = [
      /\b(apply pressure|call emergency services|seek immediate help)\b/i,
      /\b(first aid|cpr|emergency response)\b/i,
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

    const normalized = text.toLowerCase();

    /* -------------------------- Custom blocklist ---------------------------- */
    for (const term of this.customBlocklist) {
      if (normalized.includes(term)) {
        return this.block('Custom medical term blocked');
      }
    }

    /* ------------------------ Allow first aid info -------------------------- */
    if (this.config.allowFirstAid !== false) {
      if (this.firstAidPatterns.some((r) => r.test(text))) {
        return this.allow('First-aid or emergency safety information');
      }
    }

    const hasDiagnosis = this.diagnosisPatterns.some((r) => r.test(text));
    const hasTreatment = this.treatmentPatterns.some((r) => r.test(text));
    const hasPrescription = this.prescriptionPatterns.some((r) => r.test(text));
    const hasDisclaimer = this.disclaimerPatterns.some((r) => r.test(text));

    /* ---------------------------- Hard block -------------------------------- */
    if (hasDiagnosis || hasPrescription) {
      return this.block('Medical diagnosis or prescription advice detected');
    }

    /* ---------------------------- Soft advice ------------------------------- */
    if (hasTreatment) {
      if (this.config.strictMode) {
        return this.block('Medical treatment advice detected');
      }

      // Disclaimer does NOT make it safe — still WARN
      return this.warn(
        hasDisclaimer
          ? 'Medical guidance provided with disclaimer'
          : 'Medical treatment advice without disclaimer',
      );
    }

    /* ----------------------------- Allow ----------------------------------- */
    return this.allow('No medical advice detected');
  }

  /* ------------------------------------------------------------------------ */
  /* Helpers                                                                  */
  /* ------------------------------------------------------------------------ */

  private allow(message: string) {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message,
    });
  }

  private warn(message: string) {
    return this.result({
      passed: true,
      action: 'WARN',
      severity: 'warning',
      message,
    });
  }

  private block(message: string) {
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'critical',
      message,
    });
  }
}
