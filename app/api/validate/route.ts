export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, profiles, apiKeys, guardrailExecutions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { executeGuardrails } from '@/lib/guardrails';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required in x-api-key header' },
        { status: 401 }
      );
    }

    // Validate API key
    const [keyRecord] = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.key, apiKey), eq(apiKeys.isActive, true)))
      .limit(1);

    if (!keyRecord) {
      return NextResponse.json(
        { error: 'Invalid or inactive API key' },
        { status: 401 }
      );
    }

    // Check rate limits
    const rateLimitResult = await checkRateLimit(keyRecord.id, keyRecord.userId);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.reason, limits: rateLimitResult.limits },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { text, profileId, validationType = 'input' } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text field is required' },
        { status: 400 }
      );
    }

    // Get profile
    let profile;
    if (profileId) {
      [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1);
    } else {
      // Use default profile
      [profile] = await db
        .select()
        .from(profiles)
        .where(and(eq(profiles.name, 'default'), eq(profiles.isBuiltIn, true)))
        .limit(1);
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Select guardrails based on validation type
    let guardrails = [];
    if (validationType === 'input') {
      guardrails = profile.inputGuardrails || [];
    } else if (validationType === 'output') {
      guardrails = profile.outputGuardrails || [];
    } else {
      guardrails = [...(profile.inputGuardrails || []), ...(profile.outputGuardrails || [])];
    }

    // Execute guardrails
    const normalizedGuardrails = (guardrails || [])
  .filter(Boolean)
  .map((g: any) => {
    if (typeof g === 'string') {
      return { name: g };
    }

    // 🔥 SUPPORT DB FORMAT
    if (g?.class) {
      return { name: g.class, config: g.config };
    }

    if (g?.name) {
      return g;
    }

    return null;
  })
  .filter(Boolean);


const result = await executeGuardrails(
  normalizedGuardrails,
  text,
  {
    validationType,
  }
);

    // Log execution
    await db.insert(guardrailExecutions).values({
      userId: keyRecord.userId,
      apiKeyId: keyRecord.id,
      profileId: profile.id,
      inputText: validationType === 'input' ? text : null,
      outputText: validationType === 'output' ? text : null,
      guardrailResults: result.results,
      passed: result.passed,
      executionTimeMs: result.executionTimeMs,
    });

    // Get redacted text if available
    const redactedResult = result.results.find(r => r.redactedText);

    return NextResponse.json({
      success: true,
      passed: result.passed,
      validationType,
      profile: {
        id: profile.id,
        name: profile.name,
      },
      results: result.results,
      summary: result.summary,
      executionTimeMs: result.executionTimeMs,
      redactedText: redactedResult?.redactedText,
      rateLimits: rateLimitResult.limits,
    });
  } catch (error: any) {
    console.error('Validate error:', error);
    return NextResponse.json(
      { error: 'Validation failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Use POST method for validation' },
    { status: 405 }
  );
}