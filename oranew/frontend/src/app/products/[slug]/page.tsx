'use client';

import { api } from '@/lib/api';
import { cartStore } from '@/store/cartStore';
import { wishlistStore } from '@/store/wishlistStore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  longDescription: string;
  stockQuantity: number;
  image?: string;
  category?: string;
  sku?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = cartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = wishlistStore();

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${params.slug}`);
      if (response.data.success) {
        setProduct(response.data.product);
      }
    } catch (err) {
      console.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container-luxury">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container-luxury text-center">
          <p className="text-text-muted mb-4">Product not found</p>
          <Link href="/products" className="text-accent hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-luxury">
        <Link href="/products" className="text-accent hover:underline mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-background-white rounded-luxury shadow-luxury flex items-center justify-center h-96">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-luxury"
              />
            ) : (
              <span className="text-text-muted">No Image Available</span>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-serif font-bold text-text-primary mb-4">{product.name}</h1>

            {product.category && (
              <p className="text-text-muted text-sm mb-4">Category: {product.category}</p>
            )}

            <div className="text-3xl font-serif font-bold text-accent mb-6">
              ₹{product.price.toFixed(2)}
            </div>

            <p className="text-text-secondary mb-6">{product.description}</p>

            {product.longDescription && (
              <div className="mb-6 p-4 bg-background-white rounded-luxury">
                <p className="text-text-primary">{product.longDescription}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm text-text-muted mb-2">
                Stock: <span className="font-semibold text-text-primary">{product.stockQuantity}</span>
              </p>
              <p
                className={`text-sm font-semibold ${
                  product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            {product.sku && <p className="text-text-muted text-sm mb-6">SKU: {product.sku}</p>}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border border-accent text-accent rounded hover:bg-accent hover:text-background"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border border-gray-300 rounded py-2"
                  min="1"
                  max={product.stockQuantity}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-3 py-2 border border-accent text-accent rounded hover:bg-accent hover:text-background"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 px-6 py-3 bg-accent text-background rounded-luxury font-semibold hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() =>
                  isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)
                }
                className={`px-6 py-3 rounded-luxury font-semibold border-2 transition ${
                  isInWishlist
                    ? 'bg-red-50 border-red-600 text-red-600 hover:bg-red-100'
                    : 'border-accent text-accent hover:bg-accent hover:text-background'
                }`}
              >
                {isInWishlist ? '❤ Wishlist' : '🤍 Wishlist'}
              </button>
            </div>

            {/* Info */}
            <div className="p-4 bg-background-white rounded-luxury text-sm text-text-muted">
              <p>✓ Free shipping on orders over ₹500</p>
              <p>✓ Easy returns within 14 days</p>
              <p>✓ Secure payment with encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
