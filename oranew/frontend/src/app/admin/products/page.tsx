'use client';

import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
  }, [token, user, router]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await api.delete(`/admin/products/${id}`);
      if (response.data.success) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product');
    }
  };

  if (!token || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link href="/admin/products/new" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
            + New Product
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-6">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No products found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">₹{product.price.toFixed(2)}</td>
                    <td className="p-4">{product.stockQuantity}</td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6">
          <Link href="/admin" className="text-blue-400 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
