export const dynamic = 'force-dynamic';

import { requireAuth } from '@/shared/auth';
import { db } from '@/shared/db/client';
import { apiKeys } from '@/shared/db/schema';
import { eq } from 'drizzle-orm';
import ApiKeysClient from './ApiKeysClient';

export default async function ApiKeysPage() {
  const { dbUser } = await requireAuth();

  const keys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, dbUser.id))
    .orderBy(apiKeys.createdAt);

  const serializedKeys = keys.map((k) => ({
    ...k,
    createdAt: k.createdAt.toISOString(),
    lastUsedAt: k.lastUsedAt ? k.lastUsedAt.toISOString() : null,
    expiresAt: k.expiresAt ? k.expiresAt.toISOString() : null,
  }));

  return <ApiKeysClient initialKeys={serializedKeys} />;
}
