'use client';

import { authStore } from '@/store/authStore';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = authStore();

  if (!token || user?.role !== 'ADMIN') {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/products" className="text-blue-400 hover:underline mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
          <p className="text-gray-400">Product ID: {params.id}</p>
          <p className="text-gray-400 mt-4">TODO: Load and edit product details</p>
        </div>
      </div>
    </div>
  );
}
