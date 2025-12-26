import { db } from './db';
import { rateLimitTracking, apiKeys, userRateLimits, users } from './db/schema';
import { eq, and, gte } from 'drizzle-orm';

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  limits?: {
    perMinute: { current: number; max: number };
    perDay: { current: number; max: number };
  };
}

function utcMinuteBucket(date: Date) {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    0,
    0
  ));
}

function utcDayBucket(date: Date) {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0,
    0
  ));
}


export async function checkRateLimit(
  apiKeyId: string,
  userId: string
): Promise<RateLimitResult> {
  try {
    // Get API key limits
    const [apiKey] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.id, apiKeyId))
      .limit(1);

    if (!apiKey) {
      return { allowed: false, reason: 'Invalid API key' };
    }

    // Get user account limits
    let [userLimit] = await db
      .select()
      .from(userRateLimits)
      .where(eq(userRateLimits.userId, userId))
      .limit(1);

    // Create default user limit if doesn't exist
    if (!userLimit) {
      [userLimit] = await db
        .insert(userRateLimits)
        .values({
          userId,
          requestsPerMinute: 500,
          requestsPerDay: 50000,
        })
        .returning();
    }

    const now = new Date();
    
    // Check per-minute limit (API key)
    const minuteBucket = utcMinuteBucket(now);
    const [minuteTracking] = await db
      .select()
      .from(rateLimitTracking)
      .where(
        and(
          eq(rateLimitTracking.apiKeyId, apiKeyId),
          eq(rateLimitTracking.windowType, 'minute'),
          eq(rateLimitTracking.windowStart, minuteBucket)
        )
      )
      .limit(1);

    const minuteCount = minuteTracking?.requestCount || 0;
    if (minuteCount >= apiKey.requestsPerMinute) {
      return {
        allowed: false,
        reason: 'API key per-minute rate limit exceeded',
        limits: {
          perMinute: { current: minuteCount, max: apiKey.requestsPerMinute },
          perDay: { current: 0, max: apiKey.requestsPerDay },
        },
      };
    }

    // Check per-day limit (API key)
    const dayBucket = utcDayBucket(now);
    const [dayTracking] = await db
      .select()
      .from(rateLimitTracking)
      .where(
        and(
          eq(rateLimitTracking.apiKeyId, apiKeyId),
          eq(rateLimitTracking.windowType, 'day'),
          eq(rateLimitTracking.windowStart, dayBucket)
        )
      )
      .limit(1);

    const dayCount = dayTracking?.requestCount || 0;
    if (dayCount >= apiKey.requestsPerDay) {
      return {
        allowed: false,
        reason: 'API key per-day rate limit exceeded',
        limits: {
          perMinute: { current: minuteCount, max: apiKey.requestsPerMinute },
          perDay: { current: dayCount, max: apiKey.requestsPerDay },
        },
      };
    }

    // Check user account limits (aggregate all API keys)
    const userMinuteTracking = await db
      .select()
      .from(rateLimitTracking)
      .where(
        and(
          eq(rateLimitTracking.userId, userId),
          eq(rateLimitTracking.windowType, 'minute'),
          eq(rateLimitTracking.windowStart, minuteBucket)
        )
      );

    const userMinuteCount = userMinuteTracking.reduce((sum, t) => sum + t.requestCount, 0);
    if (userMinuteCount >= userLimit.requestsPerMinute) {
      return {
        allowed: false,
        reason: 'User account per-minute rate limit exceeded',
        limits: {
          perMinute: { current: userMinuteCount, max: userLimit.requestsPerMinute },
          perDay: { current: 0, max: userLimit.requestsPerDay },
        },
      };
    }

    const userDayTracking = await db
      .select()
      .from(rateLimitTracking)
      .where(
        and(
          eq(rateLimitTracking.userId, userId),
          eq(rateLimitTracking.windowType, 'day'),
          eq(rateLimitTracking.windowStart, dayBucket)
        )
      );

    const userDayCount = userDayTracking.reduce((sum, t) => sum + t.requestCount, 0);
    if (userDayCount >= userLimit.requestsPerDay) {
      return {
        allowed: false,
        reason: 'User account per-day rate limit exceeded',
        limits: {
          perMinute: { current: userMinuteCount, max: userLimit.requestsPerMinute },
          perDay: { current: userDayCount, max: userLimit.requestsPerDay },
        },
      };
    }

    // All checks passed - increment counters
    await incrementRateLimit(apiKeyId, userId, now);

    return {
      allowed: true,
      limits: {
        perMinute: { current: minuteCount + 1, max: apiKey.requestsPerMinute },
        perDay: { current: dayCount + 1, max: apiKey.requestsPerDay },
      },
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: false, reason: 'Rate limit check failed' };
  }
}

async function incrementRateLimit(apiKeyId: string, userId: string, now: Date) {
  const minuteStart = utcMinuteBucket(now);
  const dayStart = utcDayBucket(now);

  // Increment minute counter
  const [existingMinute] = await db
    .select()
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.apiKeyId, apiKeyId),
        eq(rateLimitTracking.windowType, 'minute'),
        eq(rateLimitTracking.windowStart, minuteStart)
      )
    )
    .limit(1);

  if (existingMinute) {
    await db
      .update(rateLimitTracking)
      .set({ requestCount: existingMinute.requestCount + 1 })
      .where(eq(rateLimitTracking.id, existingMinute.id));
  } else {
    await db.insert(rateLimitTracking).values({
      apiKeyId,
      userId,
      requestCount: 1,
      windowStart: minuteStart,
      windowType: 'minute',
    });
  }

  // Increment day counter
  const [existingDay] = await db
    .select()
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.apiKeyId, apiKeyId),
        eq(rateLimitTracking.windowType, 'day'),
        eq(rateLimitTracking.windowStart, dayStart)
      )
    )
    .limit(1);

  if (existingDay) {
    await db
      .update(rateLimitTracking)
      .set({ requestCount: existingDay.requestCount + 1 })
      .where(eq(rateLimitTracking.id, existingDay.id));
  } else {
    await db.insert(rateLimitTracking).values({
      apiKeyId,
      userId,
      requestCount: 1,
      windowStart: dayStart,
      windowType: 'day',
    });
  }

  // Update last used timestamp
  await db
    .update(apiKeys)
    .set({ lastUsedAt: now })
    .where(eq(apiKeys.id, apiKeyId));
}