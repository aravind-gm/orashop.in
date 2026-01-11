'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#FFD6E8', '#D4AF77', '#FDFBF7', '#F8E8D0'][Math.floor(Math.random() * 4)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-lg mx-auto text-center relative z-20">
        {/* Success Icon with Ring Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-success/30 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-light text-text-primary mb-3">
          Thank You!
        </h1>
        <p className="text-lg text-text-muted mb-8">
          Your order has been placed successfully
        </p>

        {orderId && (
          <div className="bg-background-white rounded-2xl p-6 mb-8 shadow-luxury border border-border">
            <p className="text-sm text-text-muted mb-2">Order Confirmation Number</p>
            <p className="text-xl font-mono font-bold text-accent break-all">{orderId}</p>
          </div>
        )}

        {/* Order Timeline */}
        <div className="bg-background-white rounded-2xl p-6 mb-8 shadow-luxury text-left">
          <h3 className="font-serif font-semibold text-text-primary mb-4">What happens next?</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent text-sm font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium text-text-primary">Order Confirmed</p>
                <p className="text-sm text-text-muted">We&apos;ve received your order</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-border flex items-center justify-center">
                <span className="text-text-muted text-sm font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium text-text-primary">Processing</p>
                <p className="text-sm text-text-muted">Your jewellery is being prepared</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-border flex items-center justify-center">
                <span className="text-text-muted text-sm font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium text-text-primary">Shipped</p>
                <p className="text-sm text-text-muted">On its way to you with care</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-border flex items-center justify-center">
                <span className="text-text-muted text-sm font-semibold">4</span>
              </div>
              <div>
                <p className="font-medium text-text-primary">Delivered</p>
                <p className="text-sm text-text-muted">Beautifully packaged at your door</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/account"
            className="btn-primary block w-full py-4"
          >
            View Order Status
          </Link>
          <Link
            href="/products"
            className="btn-outline block w-full py-4"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-sm text-text-muted">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
