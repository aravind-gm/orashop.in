'use client';

import api from '@/lib/api';
import { authStore } from '@/store/authStore';
import { cartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { items, total, clear } = cartStore();
  const { token } = authStore();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }, [token, items, router]);

  const handlePayment = async () => {
    if (!shippingAddress && !useNewAddress) {
      alert('Please select or enter a shipping address');
      return;
    }

    setLoading(true);

    try {
      // Create order with backend
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: useNewAddress ? newAddress : shippingAddress,
        total: total,
      };

      const orderResponse = await api.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderId = orderResponse.data.id;

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100), // Razorpay expects amount in paise
        currency: 'INR',
        order_id: orderId,
        name: 'OraShop',
        description: `Order ${orderId}`,
        handler: async (response) => {
          try {
            // Verify payment with backend
            const verifyResponse = await api.post(
              '/payments/verify',
              {
                orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              clear();
              router.push(`/checkout/success?orderId=${orderId}`);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: newAddress.fullName || shippingAddress?.fullName,
          email: token ? 'user@example.com' : '',
        },
        theme: {
          color: '#f97316',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/checkout" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Checkout
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold mb-8">Payment</h1>

              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                {!useNewAddress ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600">Select address or</p>
                    <button
                      onClick={() => setUseNewAddress(true)}
                      className="text-orange-600 hover:underline font-semibold mt-2"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <form className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddress.fullName}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, fullName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, address: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, state: e.target.value })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, postalCode: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShippingAddress(newAddress);
                        setUseNewAddress(false);
                      }}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 font-semibold"
                    >
                      Use This Address
                    </button>
                  </form>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading || !shippingAddress}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition mt-8"
              >
                {loading ? 'Processing...' : 'Pay with Razorpay'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
