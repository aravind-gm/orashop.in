'use client';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
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
      <div className="min-h-screen bg-background py-12">
        <div className="container-luxury">
          <h1 className="text-4xl font-serif font-bold text-text-primary mb-6">
            Shopping Cart
          </h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Empty Cart */}
            <div className="lg:col-span-2 bg-background-white rounded-luxury p-8 shadow-luxury">
              <div className="text-center py-12">
                <svg className="w-24 h-24 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-xl font-serif font-semibold mb-2">Your cart is empty</h2>
                <p className="text-text-muted mb-6">Start adding some beautiful jewellery to your cart!</p>
                <Link href="/products" className="btn-primary inline-block">
                  Browse Products
                </Link>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="bg-background-white rounded-luxury p-8 shadow-luxury h-fit">
              <h2 className="text-xl font-serif font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Tax</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹0.00</span>
                </div>
              </div>
              <button className="btn-primary w-full" disabled>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-luxury">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-6">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-background-white rounded-luxury p-8 shadow-luxury">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-serif font-semibold text-text-primary">{item.name}</h3>
                    <p className="text-text-muted text-sm mb-2">SKU: {item.id}</p>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        className="w-12 text-center border rounded px-2 py-1"
                        min="1"
                      />
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="text-right">
                    <p className="font-serif font-bold text-lg text-text-primary mb-2">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-text-muted text-sm mb-3">
                      ₹{item.price.toFixed(2)} each
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Link href="/products" className="text-accent hover:underline text-sm">
                ← Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="bg-background-white rounded-luxury p-8 shadow-luxury h-fit">
            <h2 className="text-xl font-serif font-semibold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal ({items.length} items)</span>
                <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tax</span>
                <span className="font-medium">₹0.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-serif font-bold">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-text-muted text-center mt-4">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
