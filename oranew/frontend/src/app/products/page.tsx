'use client';

import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  finalPrice?: string | number;
  description: string;
  stockQuantity: number;
  image?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.success || response.data.data) {
        const data = response.data.success ? response.data.data.products : response.data.data?.products || response.data.products || [];
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Collection</h1>
        <p className="text-gray-600 mb-8">Premium artificial fashion jewellery</p>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow h-full overflow-hidden group cursor-pointer">
                  <div className="h-56 bg-gray-200 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{Number(product.finalPrice || product.price).toLocaleString()}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stockQuantity > 0 ? 'In Stock' : 'Out'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (product.stockQuantity > 0) {
                          addItem({
                            id: crypto.randomUUID(),
                            productId: product.id,
                            name: product.name,
                            price: Number(product.finalPrice || product.price),
                            quantity: 1,
                            image: product.image || '',
                          });
                        }
                      }}
                      disabled={product.stockQuantity === 0}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
                    >
                      {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
