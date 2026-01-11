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
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-background-white border-b border-border">
        <div className="container-luxury py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-text-muted hover:text-accent">Home</Link>
            <span className="text-text-muted">/</span>
            <span className="text-text-primary font-medium">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="container-luxury py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-text-primary">My Wishlist</h1>
            <p className="text-text-muted mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          {items.length > 0 && (
            <Link href="/products" className="btn-outline hidden md:inline-flex">
              Continue Shopping
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-light text-text-primary mb-3">Your Wishlist is Empty</h2>
            <p className="text-text-muted mb-8">Save pieces you love by clicking the heart icon on any product</p>
            <Link href="/products" className="btn-primary inline-block">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group bg-background-white rounded-2xl shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-square bg-primary/5 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-3 right-3 w-9 h-9 bg-background-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-error hover:bg-error hover:text-background-white transition shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-serif font-semibold text-text-primary hover:text-accent transition line-clamp-1 text-lg">
                      {item.name}
                    </h3>
                  </Link>
                  {item.description && (
                    <p className="text-text-muted text-sm mt-2 line-clamp-2">{item.description}</p>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-serif font-bold text-accent">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
