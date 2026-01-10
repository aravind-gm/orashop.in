'use client';

import { authStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const router = useRouter();
  const { token, user, logout } = authStore();

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/admin/login');
    }
  }, [token, user, router]);

  if (!token || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Products</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">₹0</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition text-center"
          >
            <p className="text-2xl mb-2">📦</p>
            <p className="font-semibold">Products</p>
            <p className="text-sm text-gray-400">Manage inventory</p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition text-center"
          >
            <p className="text-2xl mb-2">🏷️</p>
            <p className="font-semibold">Categories</p>
            <p className="text-sm text-gray-400">Manage categories</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition text-center"
          >
            <p className="text-2xl mb-2">🛒</p>
            <p className="font-semibold">Orders</p>
            <p className="text-sm text-gray-400">View all orders</p>
          </Link>

          <Link
            href="/"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition text-center"
          >
            <p className="text-2xl mb-2">🏪</p>
            <p className="font-semibold">Store</p>
            <p className="text-sm text-gray-400">Back to store</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
