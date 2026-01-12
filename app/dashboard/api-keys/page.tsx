import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/shared/db/client';
import { apiKeys } from '@/shared/db/schema';
import { eq } from 'drizzle-orm';
import ApiKeysClient from './ApiKeysClient';

export default async function ApiKeysPage() {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  const keys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .orderBy(apiKeys.createdAt);

  const serializedKeys = keys.map((k) => ({
    ...k,
    createdAt: k.createdAt.toISOString(),
    lastUsedAt: k.lastUsedAt ? k.lastUsedAt.toISOString() : null,
    expiresAt: k.expiresAt ? k.expiresAt.toISOString() : null,
  }));

  return <ApiKeysClient initialKeys={serializedKeys} />;
}
