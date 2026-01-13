import { requireAuth } from '@/shared/auth';
import { db } from '@/shared/db/client';
import { profiles } from '@/shared/db/schema';
import { eq } from 'drizzle-orm';
import ProfilesClient from './ProfilesClient';
import type { GuardrailDescriptor } from '@/modules/guardrails/descriptors/types';

export default async function ProfilesPage() {
  const { dbUser } = await requireAuth();

  const rows = await db.select().from(profiles).where(eq(profiles.userId, dbUser.id));

  const data = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? 'No description provided',
    isBuiltIn: row.isBuiltIn,
    inputGuardrails: row.inputGuardrails as GuardrailDescriptor[],
    outputGuardrails: row.outputGuardrails as GuardrailDescriptor[],
    toolGuardrails: row.toolGuardrails as GuardrailDescriptor[],
  }));

  return <ProfilesClient profiles={data} />;
}
