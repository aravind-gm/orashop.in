'use client';

import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user?: {
    email: string;
  };
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get('/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }

    fetchOrders();
  }, [token, user, router, fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-900 text-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-900 text-blue-200';
      case 'SHIPPED':
        return 'bg-purple-900 text-purple-200';
      case 'DELIVERED':
        return 'bg-green-900 text-green-200';
      case 'CANCELLED':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="text-blue-400 hover:underline mb-6 inline-block">
          ← Back to Admin
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

          {loading ? (
            <p className="text-gray-400">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-400">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-600">
                  <tr>
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">{order.id.substring(0, 8)}</td>
                      <td className="py-3 px-4">{order.user?.email || 'N/A'}</td>
                      <td className="py-3 px-4">₹{order.total}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-right py-3 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          View
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
