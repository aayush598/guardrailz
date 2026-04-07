import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/shared/db/client';
import { orders, users } from '@/shared/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Payment verification failed
      await db
        .update(orders)
        .set({ status: 'failed' })
        .where(eq(orders.razorpayOrderId, razorpay_order_id));

      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Payment is successful
    // Update order status
    const [updatedOrder] = await db
      .update(orders)
      .set({
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        updatedAt: new Date(),
      })
      .where(eq(orders.razorpayOrderId, razorpay_order_id))
      .returning();

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update user's plan
    await db
      .update(users)
      .set({ plan: updatedOrder.plan, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      plan: updatedOrder.plan,
    });
  } catch (error) {
    console.error('Error verifing payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
