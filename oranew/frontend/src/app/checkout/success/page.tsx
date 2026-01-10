'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {orderId && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="text-lg font-mono font-bold text-gray-900 break-all">{orderId}</p>
          </div>
        )}

        <div className="space-y-3 mb-8">
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-sm text-gray-600">
            You can track your order from your account dashboard.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/profile"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Order Status
          </Link>
          <Link
            href="/products"
            className="block w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Next Steps:</strong>
            <br />
            1. We will verify your payment<br />
            2. Reserve your items (15 minutes)<br />
            3. Process your order<br />
            4. Ship to your address
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
