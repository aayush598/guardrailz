import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { normalizeGuardrailDescriptor } from "@/lib/guardrails/normalize";
import type { RuntimeProfile } from "./runtime-profile";

function toRuntimeProfile(dbProfile: any): RuntimeProfile {
  const input = dbProfile.inputGuardrails
    .map(normalizeGuardrailDescriptor)
    .filter(Boolean);

  const output = dbProfile.outputGuardrails
    .map(normalizeGuardrailDescriptor)
    .filter(Boolean);

  return {
    id: dbProfile.id,
    name: dbProfile.name,
    input,
    output,
    both: [...input, ...output], // precomputed once
  };
}

export async function getRuntimeProfile(
  profileId?: string
): Promise<RuntimeProfile> {
  const key = profileId ? `profile:${profileId}` : `profile:default`;

  // 1. Redis first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Cold fallback (rare)
  const [profile] = await db
    .select()
    .from(profiles)
    .where(
      profileId
        ? eq(profiles.id, profileId)
        : and(eq(profiles.name, "default"), eq(profiles.isBuiltIn, true))
    )
    .limit(1);

  if (!profile) {
    throw new Error("Profile not found");
  }

  const runtime = toRuntimeProfile(profile);

  // 3. Populate cache (no TTL)
  await redis.set(key, JSON.stringify(runtime));

  return runtime;
}
