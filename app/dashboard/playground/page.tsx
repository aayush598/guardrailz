import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/shared/db/client';
import { profiles, apiKeys } from '@/shared/db/schema';
import { eq } from 'drizzle-orm';
import PlaygroundClient from './PlaygroundClient';

export default async function PlaygroundPage() {
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const [profilesData, apiKeysData] = await Promise.all([
    db
      .select({
        id: profiles.id,
        name: profiles.name,
        description: profiles.description,
      })
      .from(profiles)
      .where(eq(profiles.userId, user.id)),

    db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        key: apiKeys.key,
        isActive: apiKeys.isActive,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id)),
  ]);

  return <PlaygroundClient profiles={profilesData} apiKeys={apiKeysData} />;
}
