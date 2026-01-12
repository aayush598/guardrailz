export interface ProfileUsedPayload {
  profileName: string;
  validationType: 'input' | 'output' | 'tool';
}

export const PROFILE_USED_EVENT = 'profile.used';
