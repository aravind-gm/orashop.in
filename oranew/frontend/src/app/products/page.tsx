'use client';

import { api } from '@/lib/api';
import { cartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  stockQuantity: number;
  image?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = cartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container-luxury">
          <p className="text-text-primary">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-luxury">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-6">
          Products
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-background-white rounded-luxury shadow-luxury hover:shadow-luxury-lg transition">
                <div className="h-48 bg-gray-200 rounded-t-luxury flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-text-muted">No Image</span>
                  )}
                </div>
                <div className="p-6">
                  <Link href={`/products/${product.slug}`}>
                    <h2 className="text-lg font-serif font-semibold text-text-primary hover:text-accent">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-text-muted text-sm mt-2 line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-serif font-bold text-text-primary">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => addItem(product)}
                      disabled={product.stockQuantity === 0}
                      className="flex-1 px-4 py-2 bg-accent text-background rounded hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 px-4 py-2 border border-accent text-accent rounded hover:bg-accent hover:text-background text-center font-medium transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
