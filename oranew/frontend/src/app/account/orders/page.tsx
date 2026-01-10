'use client';

import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [token, router]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link href="/account" className="text-blue-600 hover:underline">
            Back to Account
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">No orders found</p>
              <Link href="/products" className="text-blue-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4">Order ID</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">{order.id.slice(0, 12)}...</td>
                      <td className="p-4 font-semibold">₹{order.totalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
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
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
