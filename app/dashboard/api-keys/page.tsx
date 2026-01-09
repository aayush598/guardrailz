import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { apiKeys } from '@/lib/db/schema';
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

  return <ApiKeysClient initialKeys={keys} />;
}
