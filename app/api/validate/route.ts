export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/shared/db/client';
import { apiKeys, profiles, guardrailExecutions } from '@/shared/db/schema';
import { and, eq } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { runGuardrails } from '@/modules/guardrails/service/run-guardrails';

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    const [key] = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.key, apiKey), eq(apiKeys.isActive, true)))
      .limit(1);

    if (!key) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const rate = await checkRateLimit(key.id, key.userId);
    if (!rate.allowed) {
      return NextResponse.json({ error: rate.reason, limits: rate.limits }, { status: 429 });
    }

    const { text, profileName, validationType = 'input' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.name, profileName), eq(profiles.userId, key.userId)))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const guardrails =
      validationType === 'input'
        ? profile.inputGuardrails
        : validationType === 'output'
          ? profile.outputGuardrails
          : [...profile.inputGuardrails, ...profile.outputGuardrails];

    const result = await runGuardrails(guardrails, text, {
      validationType,
      userId: key.userId,
      apiKeyId: key.id,
      profileId: profile.id,
    });

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

    return NextResponse.json({
      success: true,
      passed: result.passed,
      profile: { id: profile.id, name: profile.name },
      validationType,
      results: result.results,
      summary: result.summary,
      executionTimeMs: result.executionTimeMs,
      rateLimits: rate.limits,
    });
  } catch (err: unknown) {
    console.error(err);

    const message = err instanceof Error ? err.message : 'Unknown validation error';

    return NextResponse.json({ error: 'Validation failed', details: message }, { status: 500 });
  }
}
