'use client';

import api from '@/lib/api';
import { authStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const router = useRouter();
  const { token, user } = authStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }

    fetchCategories();
  }, [token, user, router]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      const response = await api.post('/admin/categories', {
        name: newCategory.name,
        slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      });
      setCategories([...categories, response.data]);
      setNewCategory({ name: '', slug: '' });
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure?')) return;
    
    try {
      await api.delete(`/admin/categories/${categoryId}`);
      setCategories(categories.filter(c => c.id !== categoryId));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-blue-400 hover:underline mb-6 inline-block">
          ← Back to Admin
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Categories Management</h1>

          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="mb-8 bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Slug (auto-generated)"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                className="bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
            >
              Add Category
            </button>
          </form>

          {/* Categories List */}
          {loading ? (
            <p>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-400">No categories found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-600">
                  <tr>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Slug</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">{category.name}</td>
                      <td className="py-3 px-4 text-gray-400">{category.slug}</td>
                      <td className="text-right py-3 px-4">
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          Delete
                        </button>
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
