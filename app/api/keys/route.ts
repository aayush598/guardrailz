export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/shared/auth';
import { db } from '@/shared/db/client';
import { apiKeys } from '@/shared/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateApiKey } from '@/lib/api-key';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

function isUnauthorized(error: unknown): boolean {
  return error instanceof Error && error.name === 'UnauthorizedError';
}

export async function GET() {
  try {
    const { dbUser } = await requireAuth();

    const allKeys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, dbUser.id))
      .orderBy(desc(apiKeys.createdAt));

    return NextResponse.json({ apiKeys: allKeys });
  } catch (error: unknown) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch API keys',
        details: getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dbUser } = await requireAuth();

    const body = await request.json();
    const { name, requestsPerMinute = 100, requestsPerDay = 10000 } = body;

    if (!name) {
      return NextResponse.json({ error: 'API key name is required' }, { status: 400 });
    }

    const key = generateApiKey();

    const [newKey] = await db
      .insert(apiKeys)
      .values({
        userId: dbUser.id,
        key,
        name,
        requestsPerMinute,
        requestsPerDay,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ apiKey: newKey });
  } catch (error: unknown) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: 'Failed to create API key',
        details: getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
