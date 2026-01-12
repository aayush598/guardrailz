import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/shared/db/client';
import { users, rateLimitTracking } from '@/shared/db/schema';
import { eq, and } from 'drizzle-orm';

async function getOrCreateUser(clerkUser: any) {
  const [user] = await db.select().from(users).where(eq(users.id, clerkUser.id));
  if (user) return user;

  const [created] = await db
    .insert(users)
    .values({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })
    .returning();

  return created;
}

function utcMinuteBucket(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      0,
      0,
    ),
  );
}

function utcDayBucket(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
  );
}

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getOrCreateUser(clerkUser);
  const now = new Date();

  const minuteBucket = utcMinuteBucket(now);
  const dayBucket = utcDayBucket(now);

  const rows = await db
    .select({
      apiKeyId: rateLimitTracking.apiKeyId,
      count: rateLimitTracking.requestCount,
      windowType: rateLimitTracking.windowType,
    })
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.userId, user.id),
        eq(rateLimitTracking.windowStart, dayBucket), // covers day
      ),
    );

  const usageDay: Record<string, number> = {};
  const usageMinute: Record<string, number> = {};

  for (const row of rows) {
    if (row.windowType === 'day') {
      usageDay[row.apiKeyId] = row.count;
    }
  }

  const minuteRows = await db
    .select({
      apiKeyId: rateLimitTracking.apiKeyId,
      count: rateLimitTracking.requestCount,
    })
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.userId, user.id),
        eq(rateLimitTracking.windowType, 'minute'),
        eq(rateLimitTracking.windowStart, minuteBucket),
      ),
    );

  for (const row of minuteRows) {
    usageMinute[row.apiKeyId] = row.count;
  }

  return NextResponse.json({
    perDay: usageDay,
    perMinute: usageMinute,
  });
}
