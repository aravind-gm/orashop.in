'use client';

import { api } from '@/lib/api';
import { authStore } from '@/store/authStore';
import { cartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  totalAmount: number;
  items: OrderItem[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user } = authStore();
  const { items, totalPrice, clearCart } = cartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Shipping address form state
  const [address, setAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [token, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !order) {
      router.push('/products');
    }
  }, [items, router, order]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate address
      if (!address.street || !address.city || !address.state || !address.zipCode) {
        throw new Error('Please fill in all address fields');
      }

      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // Create order
      const response = await api.post('/orders/checkout', {
        items: orderItems,
        shippingAddress: address,
      });

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to create order');
      }

      setOrder(response.data.order);
      // Proceed to payment
      setTimeout(() => initiatePayment(response.data.order), 500);
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      setLoading(false);
    }
  };

  const initiatePayment = async (orderData: Order) => {
    setPaymentProcessing(true);

    try {
      // Create payment
      const paymentResponse = await api.post('/payments/create', {
        orderId: orderData.id,
        amount: Math.round(orderData.totalAmount * 100), // Convert to paise
      });

      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.error?.message || 'Failed to create payment');
      }

      const { razorpayOrderId, razorpayKeyId } = paymentResponse.data;

      // Open Razorpay checkout
      openRazorpayCheckout(razorpayOrderId, razorpayKeyId, orderData);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      setPaymentProcessing(false);
    }
  };

  const openRazorpayCheckout = (
    razorpayOrderId: string,
    razorpayKeyId: string,
    orderData: Order
  ) => {
    const options = {
      key: razorpayKeyId,
      order_id: razorpayOrderId,
      amount: Math.round(orderData.totalAmount * 100),
      currency: 'INR',
      name: 'ORA Jewellery',
      description: `Order ${orderData.id}`,
      image: '/logo.png',
      prefill: {
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
      },
      notes: {
        orderId: orderData.id,
      },
      handler: async (response: any) => {
        await handlePaymentSuccess(response, orderData.id);
      },
      modal: {
        ondismiss: () => {
          setPaymentProcessing(false);
          setError('Payment cancelled. Please try again.');
        },
      },
    };

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  };

  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      // Verify payment
      const verifyResponse = await api.post('/payments/verify', {
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      });

      if (!verifyResponse.data.success) {
        throw new Error('Payment verification failed');
      }

      // Clear cart and redirect to success
      clearCart();
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
      setPaymentProcessing(false);
    }
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600 mb-4">Please log in to continue</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCreateOrder} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || paymentProcessing}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Order...' : paymentProcessing ? 'Processing Payment...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                💳 <strong>Test Card:</strong> 4111 1111 1111 1111, Exp: 12/25, CVV: 123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
