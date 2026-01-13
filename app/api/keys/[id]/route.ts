import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/shared/auth';
import { db } from '@/shared/db/client';
import { apiKeys } from '@/shared/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { dbUser } = await requireAuth();

    await db.delete(apiKeys).where(and(eq(apiKeys.id, params.id), eq(apiKeys.userId, dbUser.id)));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error(err);

    const message = err instanceof Error ? err.message : 'Unknown key deletion error';

    return NextResponse.json(
      { error: 'Failed to delete api key', details: message },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { dbUser } = await requireAuth();
  const body = await request.json();

  const update: {
    name?: string;
    isActive?: boolean;
  } = {};

  if (typeof body.name === 'string') update.name = body.name;
  if (typeof body.isActive === 'boolean') update.isActive = body.isActive;

  await db
    .update(apiKeys)
    .set(update)
    .where(and(eq(apiKeys.id, params.id), eq(apiKeys.userId, dbUser.id)));

  return NextResponse.json({ success: true });
}
