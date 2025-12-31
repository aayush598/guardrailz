export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiKeys, profiles, guardrailExecutions } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { runGuardrails } from '@/lib/guardrails/service';
import { PerfTracker } from '@/lib/perf';
import { redis } from "@/lib/redis";
import { getRuntimeProfile } from '@/lib/profiles/profile-cache';
import { encrypt } from '@/lib/utils/crypto';

export async function POST(req: NextRequest) {
  const perf = new PerfTracker();

  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    perf.start("api_key_lookup");
    let keyData = await redis.hgetall(`apikey:${apiKey}`);

    // Fallback to database if not in Redis
    if (!keyData || Object.keys(keyData).length === 0) {
      const [dbKey] = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.keyEncrypted, encrypt(apiKey)))
        .limit(1);

      console.log(` APi key loopup : ${dbKey} | APi key : ${apiKey} | Encrypted : ${encrypt(apiKey)}`)

      if (!dbKey || !dbKey.isActive) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }

      // Repopulate Redis cache
      await redis.hset(`apikey:${apiKey}`, {
        id: dbKey.id,
        userId: dbKey.userId,
        active: "true",
        rpm: dbKey.requestsPerMinute.toString(),
        rpd: dbKey.requestsPerDay.toString(),
      });
      await redis.expire(`apikey:${apiKey}`, 86400);

      keyData = {
        id: dbKey.id,
        userId: dbKey.userId,
        active: "true",
        rpm: dbKey.requestsPerMinute.toString(),
        rpd: dbKey.requestsPerDay.toString(),
      };
    }

    if (!keyData || keyData.active !== "true") {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const key = {
      id: keyData.id,
      userId: keyData.userId,
      requestsPerMinute: Number(keyData.rpm),
      requestsPerDay: Number(keyData.rpd),
    };
    perf.end("api_key_lookup");

    if (!key) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    perf.start("rate_limit_check");
    const rate = await checkRateLimit({
      apiKeyId: key.id,
      userId: key.userId,
      apiRpm: key.requestsPerMinute,
      apiRpd: key.requestsPerDay,
      userRpm: 100,      // can also come from Redis later
      userRpd: 10000,
    });
    perf.end("rate_limit_check");

    if (!rate.allowed) {
      return NextResponse.json(
        { error: rate.reason, limits: rate.limits },
        { status: 429 }
      );
    }

    const { text, profileId, validationType = 'input' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    perf.start("profile_lookup");
    const profile = await getRuntimeProfile(profileId);
    perf.end("profile_lookup");

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const guardrails =
      validationType === "input"
        ? profile.input
        : validationType === "output"
        ? profile.output
        : profile.both;

    perf.start("guardrails_total");
    const result = await runGuardrails(
      profile.id,
      guardrails,
      text,
      {
        validationType,
        userId: key.userId,
        apiKeyId: key.id,
        profileId: profile.id,
      }
    );
    perf.end("guardrails_total");

    perf.start("execution_log_insert");
    await db.insert(guardrailExecutions).values({
      userId: key.userId,
      apiKeyId: key.id,
      profileId: profile.id,
      inputText: validationType === 'input' ? text : null,
      outputText: validationType === 'output' ? text : null,
      guardrailResults: result.results,
      passed: result.passed,
      executionTimeMs: result.executionTimeMs,
    });
    perf.end("execution_log_insert");

    return NextResponse.json({
      success: true,
      passed: result.passed,
      profile: { id: profile.id, name: profile.name },
      validationType,
      results: result.results,
      summary: result.summary,
      executionTimeMs: result.executionTimeMs,
      rateLimits: rate.limits,
      perf: perf.summary(),
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: 'Validation failed', details: err.message },
      { status: 500 }
    );
  }
}
