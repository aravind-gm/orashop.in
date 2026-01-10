'use client';

import { api } from '@/lib/api';
import { authStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { token, user, logout } = authStore();
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
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.firstName}!
            </h1>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="font-semibold">{orders.length}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded col-span-2 md:col-span-2">
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Quick Links</h2>
              <nav className="space-y-2">
                <Link
                  href="/account/orders"
                  className="block p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  My Orders
                </Link>
                <Link
                  href="/account/addresses"
                  className="block p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  Addresses
                </Link>
                <Link
                  href="/products"
                  className="block p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  Shop
                </Link>
                <Link
                  href="/wishlist"
                  className="block p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  Wishlist
                </Link>
              </nav>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Recent Orders</h2>

              {loading ? (
                <p className="text-gray-600">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-600">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-2">Order ID</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                          <td className="p-2">₹{order.totalAmount.toFixed(2)}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                order.status === 'PAID'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-2 text-xs">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="text-blue-600 hover:underline text-xs"
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

              {orders.length > 5 && (
                <Link
                  href="/account/orders"
                  className="block mt-4 text-center text-blue-600 hover:underline"
                >
                  View All Orders
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
