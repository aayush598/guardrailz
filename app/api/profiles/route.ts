import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/shared/db/client';
import { users, profiles } from '@/shared/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { BUILTIN_PROFILES } from '@/lib/profiles/built-in';

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

// Initialize built-in profiles for a user
async function initializeBuiltInProfiles(userId: string) {
  const existingProfiles = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.isBuiltIn, true), eq(profiles.userId, userId)));

  if (existingProfiles.length === 0) {
    const builtInProfilesData = Object.values(BUILTIN_PROFILES).map((profile) => ({
      userId,
      name: profile.name,
      description: profile.description,
      isBuiltIn: true,
      inputGuardrails: profile.inputGuardrails,
      outputGuardrails: profile.outputGuardrails,
      toolGuardrails: profile.toolGuardrails,
    }));

    await db.insert(profiles).values(builtInProfilesData);
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrCreateUser(user);
    await initializeBuiltInProfiles(dbUser.id);

    const allProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, dbUser.id))
      .orderBy(desc(profiles.createdAt));

    return NextResponse.json({ profiles: allProfiles });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch profiles', details: error.message },
      { status: 500 },
    );
  }
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
