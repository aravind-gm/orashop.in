// CartSidebar component - elegant sliding cart panel
'use client';

import { useCart } from '@/components/context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidebar() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#B8860B]" />
                <h2 className="text-lg font-serif tracking-wide text-[#2C2C2C]">
                  Shopping Bag
                </h2>
                <span className="text-sm text-gray-500 font-light">
                  ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-[#2C2C2C] transition-colors p-1"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-[#FAF8F5] flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-serif text-[#2C2C2C] mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-sm text-gray-500 font-light mb-6 max-w-[200px]">
                    Discover our exquisite collection and find your perfect piece
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-8 py-3 bg-[#2C2C2C] text-white text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#1a1a1a] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 pb-6 border-b border-gray-100 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 bg-[#FAF8F5] rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium text-[#2C2C2C] truncate pr-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {item.selectedColor && (
                          <p className="text-xs text-gray-500 mt-1 font-light">
                            Color: {item.selectedColor}
                          </p>
                        )}

                        <p className="text-sm font-medium text-[#B8860B] mt-2">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 bg-[#FAF8F5]">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 font-light">Subtotal</span>
                  <span className="text-lg font-serif text-[#2C2C2C]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {/* Free Shipping Progress */}
                {cartTotal < 2999 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-light">
                      Add {formatPrice(2999 - cartTotal)} more for free shipping
                    </p>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#B8860B]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(cartTotal / 2999) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full py-3.5 bg-[#2C2C2C] text-white text-center text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#1a1a1a] transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3 border border-gray-300 text-[#2C2C2C] text-xs tracking-[0.1em] uppercase font-medium hover:border-[#2C2C2C] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-gray-200">
                  <span className="text-[10px] text-gray-400 tracking-wider uppercase">
                    Secure Checkout
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-[10px] text-gray-400 tracking-wider uppercase">
                    Easy Returns
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
