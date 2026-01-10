'use client';

import { api } from '@/lib/api';
import { authStore } from '@/store/authStore';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = authStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchOrder();
  }, [token, router, params.id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${params.id}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (err) {
      console.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link href="/account/orders" className="text-blue-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/account/orders" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Orders
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order {order.id.slice(0, 12)}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded font-semibold ${
                order.status === 'PAID'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-3 border-b pb-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div>
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              <div className="p-4 bg-gray-50 rounded text-sm">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
