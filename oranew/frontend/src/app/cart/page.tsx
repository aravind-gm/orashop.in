'use client';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, totalPrice, removeItem, updateQuantity } = useCartStore();
  const { token } = useAuthStore();

  const handleCheckout = () => {
    if (!token) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-background-white border-b border-border">
          <div className="container-luxury py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-text-muted hover:text-accent">Home</Link>
              <span className="text-text-muted">/</span>
              <span className="text-text-primary font-medium">Shopping Cart</span>
            </div>
          </div>
        </div>

        <div className="container-luxury py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-light text-text-primary mb-3">Your Cart is Empty</h1>
            <p className="text-text-muted mb-8">Looks like you haven&apos;t added any beautiful pieces yet</p>
            <Link href="/products" className="btn-primary inline-block">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-background-white border-b border-border">
        <div className="container-luxury py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-text-muted hover:text-accent">Home</Link>
            <span className="text-text-muted">/</span>
            <span className="text-text-primary font-medium">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="container-luxury py-10">
        <h1 className="text-3xl md:text-4xl font-serif font-light text-text-primary mb-2">Shopping Cart</h1>
        <p className="text-text-muted mb-8">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-background-white rounded-2xl shadow-luxury p-5 flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-xl flex-shrink-0 overflow-hidden relative">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-text-primary text-lg line-clamp-1">{item.name}</h3>
                  <p className="text-text-muted text-sm mt-1">SKU: {item.productId?.slice(0, 8)}...</p>
                  
                  {/* Price on mobile */}
                  <p className="font-serif font-bold text-accent text-lg mt-2 md:hidden">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg border border-border hover:border-accent hover:text-accent flex items-center justify-center transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-medium text-text-primary">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-border hover:border-accent hover:text-accent flex items-center justify-center transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="mt-3 text-sm text-error hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>

                {/* Price on desktop */}
                <div className="hidden md:block text-right">
                  <p className="font-serif font-bold text-accent text-xl">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-text-muted text-sm mt-1">
                    ₹{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}

            <Link href="/products" className="inline-flex items-center gap-2 text-accent hover:underline mt-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background-white rounded-2xl shadow-luxury p-6 sticky top-32">
              <h2 className="text-xl font-serif font-semibold text-text-primary mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-medium text-text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Shipping</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Tax</span>
                  <span className="font-medium text-text-primary">Included</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="font-serif font-semibold text-text-primary">Total</span>
                  <span className="font-serif font-bold text-accent">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full py-4 text-base"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-xs text-text-muted text-center mt-4 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout powered by Razorpay
              </p>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-medium text-text-primary mb-2">Have a promo code?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="input-luxury flex-1 py-2 text-sm"
                  />
                  <button className="btn-outline px-4 py-2 text-sm">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
