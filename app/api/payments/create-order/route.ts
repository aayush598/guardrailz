import { NextRequest, NextResponse } from 'next/server';

import Razorpay from 'razorpay';
import { db } from '@/shared/db/client';
import { orders } from '@/shared/db/schema';
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, amount } = await req.json();

    if (!plan || !amount) {
      return NextResponse.json({ error: 'Missing plan or amount' }, { status: 400 });
    }

    // Create order using Razorpay SDK
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${nanoid(10)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
    }

    // Create order record in our database
    const orderId = nanoid();
    await db.insert(orders).values({
      id: orderId,
      userId,
      razorpayOrderId: razorpayOrder.id,
      plan,
      amount,
      status: 'created',
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
    });
  } catch (error) {
    console.error('Error in create-order API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
