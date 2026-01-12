import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/shared/db/client';
import { profiles } from '@/shared/db/schema';
import { eq } from 'drizzle-orm';
import ProfilesClient from './ProfilesClient';

export default async function ProfilesPage() {
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const data = await db.select().from(profiles).where(eq(profiles.userId, user.id));

  return <ProfilesClient profiles={data} />;
}
