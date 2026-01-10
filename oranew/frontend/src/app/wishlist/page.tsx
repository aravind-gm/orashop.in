'use client';

import Link from 'next/link';
import { wishlistStore } from '@/store/wishlistStore';
import { cartStore } from '@/store/cartStore';

export default function WishlistPage() {
  const { items, removeItem } = wishlistStore();
  const { addItem } = cartStore();

  const handleMoveToCart = (item: any) => {
    addItem(item);
    removeItem(item.id);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-luxury">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-6">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-background-white rounded-luxury shadow-luxury p-8">
            <p className="text-text-muted text-lg mb-6">Your wishlist is empty</p>
            <Link href="/products" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-background-white rounded-luxury shadow-luxury overflow-hidden hover:shadow-luxury-lg transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-text-muted">No Image</span>
                  )}
                </div>
                <div className="p-6">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-lg font-serif font-semibold text-text-primary hover:text-accent">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-text-muted text-sm mt-2 line-clamp-2">{item.description}</p>
                  <div className="mt-4">
                    <p className="text-2xl font-serif font-bold text-accent mb-4">
                      ₹{item.price.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 px-4 py-2 bg-accent text-background rounded font-semibold hover:opacity-90"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex-1 px-4 py-2 border-2 border-red-600 text-red-600 rounded font-semibold hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
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
            <svg className="w-24 h-24 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-serif font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-text-muted mb-6">Save your favorite items here!</p>
            <a href="/products" className="btn-primary inline-block">
              Browse Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
