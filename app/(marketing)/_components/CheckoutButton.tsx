'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export function CheckoutButton({
  plan,
  amount,
  className,
  children,
}: {
  plan: string;
  amount: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handlePayment = async () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    try {
      setIsLoading(true);
      // 1. Create order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, amount }),
      });

      const order = await response.json();

      if (!response.ok) throw new Error(order.error || 'Failed to create order');

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SaWqYAm0DZ8GUR', // Note: Needs NEXT_PUBLIC_... in production if configured
        amount: order.amount,
        currency: order.currency,
        name: 'Guardrailz',
        description: `${plan} Plan`,
        order_id: order.orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              alert('Payment successful!');
              router.push('/dashboard');
            } else {
              alert(verifyData.error || 'Payment verification failed!');
            }
          } catch (e) {
            console.error(e);
            alert('Something went wrong during payment verification.');
          }
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new (
        window as unknown as {
          Razorpay: new (options: unknown) => {
            on: (
              event: string,
              handler: (resp: { error: { description: string } }) => void,
            ) => void;
            open: () => void;
          };
        }
      ).Razorpay(options);
      rzp1.on('payment.failed', function (response: { error: { description: string } }) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert('Could not start checkout.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Button className={className} onClick={handlePayment} disabled={isLoading}>
        {isLoading ? 'Processing...' : children}
      </Button>
    </>
  );
}
