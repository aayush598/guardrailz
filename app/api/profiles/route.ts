import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/shared/db/client';
import { users, profiles } from '@/shared/db/schema';
import { eq } from 'drizzle-orm';
import { ProfileService } from '@/modules/profiles/service/profile.service';

// Helper to get or create user
async function getOrCreateUser(clerkUser: any) {
  const [existingUser] = await db.select().from(users).where(eq(users.id, clerkUser.id)).limit(1);

  if (existingUser) {
    return existingUser;
  }

  const [newUser] = await db
    .insert(users)
    .values({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })
    .returning();

  return newUser;
}

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getOrCreateUser(clerkUser);
  const service = new ProfileService();

  await service.ensureBuiltIns(user.id);

  const profiles = await service.getRuntimeProfiles(user.id);
  return NextResponse.json({ profiles });
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrCreateUser(user);
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
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create profile', details: error.message },
      { status: 500 },
    );
  }
}
