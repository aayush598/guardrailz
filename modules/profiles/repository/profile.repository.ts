import { db } from '@/shared/db/client';
import { profiles } from '@/shared/db/schema';
import { eq, and } from 'drizzle-orm';

export class ProfileRepository {
  async findByUser(userId: string) {
    return db.select().from(profiles).where(eq(profiles.userId, userId));
  }

  async findBuiltIn(userId: string) {
    return db
      .select()
      .from(profiles)
      .where(and(eq(profiles.userId, userId), eq(profiles.isBuiltIn, true)));
  }

  async create(profile: any) {
    const [created] = await db.insert(profiles).values(profile).returning();
    return created;
  }
}
