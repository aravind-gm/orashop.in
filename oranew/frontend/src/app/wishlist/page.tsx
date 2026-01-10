'use client';

import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import Image from 'next/image';
import Link from 'next/link';

interface WishlistItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  description?: string;
}

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (item: WishlistItem) => {
    addItem({
      id: crypto.randomUUID(),
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
    });
    removeItem(item.productId);
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
                <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
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
