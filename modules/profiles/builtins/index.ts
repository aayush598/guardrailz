import { DefaultProfile } from './default.profile';
import { EnterpriseSecurityProfile } from './enterprise.profile';
import { ChildSafetyProfile } from './child-safety.profile';
import { HealthcareProfile } from './healthcare.profile';
import { FinancialProfile } from './financial.profile';
import { MinimalProfile } from './minimal.profile';

export const BUILTIN_PROFILES = [
  DefaultProfile,
  EnterpriseSecurityProfile,
  ChildSafetyProfile,
  HealthcareProfile,
  FinancialProfile,
  MinimalProfile,
];
