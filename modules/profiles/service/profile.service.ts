import { ProfileRepository } from '../repository/profile.repository';
import { BUILTIN_PROFILES } from '../builtins';
import { compileProfile } from '../compiler/compile-profile';

export class ProfileService {
  constructor(private readonly repo = new ProfileRepository()) {}

  async ensureBuiltIns(userId: string) {
    const existing = await this.repo.findBuiltIn(userId);
    if (existing.length > 0) return;

    for (const p of BUILTIN_PROFILES) {
      await this.repo.create({
        userId,
        name: p.name,
        description: p.description,
        isBuiltIn: true,
        inputGuardrails: p.inputGuardrails,
        outputGuardrails: p.outputGuardrails,
        toolGuardrails: p.toolGuardrails,
      });
    }
  }

  async getRuntimeProfiles(userId: string) {
    const profiles = await this.repo.findByUser(userId);
    return profiles.map(compileProfile);
  }
}
