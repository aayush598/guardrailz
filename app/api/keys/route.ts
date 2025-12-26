import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, apiKeys } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { generateApiKey } from '@/lib/utils/api-key';

// Helper to get or create user
async function getOrCreateUser(clerkUser: any) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, clerkUser.id))
    .limit(1);

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
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const dbUser = await getOrCreateUser(user);

    const allKeys = await db
      .select()
      .from(apiKeys)
      .where(
        eq(apiKeys.userId, dbUser.id)
      )
      .orderBy(desc(apiKeys.createdAt));

    return NextResponse.json({ apiKeys: allKeys });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch API keys', details: error.message },
      { status: 500 }
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
    const { name, requestsPerMinute = 100, requestsPerDay = 10000 } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      );
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
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create API key', details: error.message },
      { status: 500 }
    );
  }
}