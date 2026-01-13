export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/shared/auth';
import { db } from '@/shared/db/client';
import { profiles } from '@/shared/db/schema';
import { ProfileService } from '@/modules/profiles/service/profile.service';

export async function GET() {
  const { dbUser } = await requireAuth();
  const service = new ProfileService();

  await service.ensureBuiltIns(dbUser.id);

  const profiles = await service.getRuntimeProfiles(dbUser.id);
  return NextResponse.json({ profiles });
}

export async function POST(request: NextRequest) {
  try {
    const { dbUser } = await requireAuth();
    const body = await request.json();
    const { name, description, inputGuardrails, outputGuardrails, toolGuardrails } = body;

    if (!name) {
      return NextResponse.json({ error: 'Profile name is required' }, { status: 400 });
    }

    const [newProfile] = await db
      .insert(profiles)
      .values({
        userId: dbUser.id,
        name,
        description: description || '',
        isBuiltIn: false,
        inputGuardrails: inputGuardrails || [],
        outputGuardrails: outputGuardrails || [],
        toolGuardrails: toolGuardrails || [],
      })
      .returning();

    return NextResponse.json({ profile: newProfile });
  } catch (err: unknown) {
    console.error(err);

    const message = err instanceof Error ? err.message : 'Unknown profiles error';

    return NextResponse.json(
      { error: 'Failed to create profile', details: message },
      { status: 500 },
    );
  }
}
