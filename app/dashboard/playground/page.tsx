import { requireAuth } from '@/shared/auth';
import { db } from '@/shared/db/client';
import { profiles, apiKeys } from '@/shared/db/schema';
import { eq } from 'drizzle-orm';
import PlaygroundClient from './PlaygroundClient';

export default async function PlaygroundPage() {
  const { dbUser } = await requireAuth();

  const [rawProfiles, apiKeysData] = await Promise.all([
    db
      .select({
        id: profiles.id,
        name: profiles.name,
        description: profiles.description,
      })
      .from(profiles)
      .where(eq(profiles.userId, dbUser.id)),

    db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        key: apiKeys.key,
        isActive: apiKeys.isActive,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, dbUser.id)),
  ]);

  const profilesData = rawProfiles.map((p) => ({
    ...p,
    description: p.description ?? '',
  }));

  return <PlaygroundClient profiles={profilesData} apiKeys={apiKeysData} />;
}
