'use client';

import api from '@/lib/api';
import { authStore } from '@/store/authStore';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = authStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }

    fetchOrder();
  }, [token, user, router, params.id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/admin/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (status === order.status) return;

    setUpdating(true);
    try {
      await api.put(
        `/admin/orders/${params.id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder({ ...order, status });
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (orderStatus) => {
    switch (orderStatus) {
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

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!order) return <p className="text-white p-6">Order not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/orders" className="text-blue-400 hover:underline mb-6 inline-block">
          ← Back to Orders
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">Order {order.id.substring(0, 8)}</h1>
              <p className="text-gray-400 mt-2">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Order Status Update */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            <div className="flex gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={updating || status === order.status}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-semibold transition"
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.product?.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <p>{order.shippingAddress.fullName}</p>
              <p className="text-gray-400">{order.shippingAddress.address}</p>
              <p className="text-gray-400">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>
          )}

          {/* Order Summary */}
          <div className="mt-8 bg-gray-700 rounded-lg p-6">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span>₹{order.tax || 0}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-4 mt-4">
              <span>Total:</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
