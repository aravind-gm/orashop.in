// Navbar component - luxury elegant navigation with promo banner
'use client';

import { useCart } from '@/components/context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, wishlist, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'New Arrivals', href: '/collections/new-arrivals', badge: null },
    { label: 'Best Seller', href: '/collections/bestsellers', badge: null },
    { label: 'Fine Silver', href: '/collections/silver', badge: null },
    { label: '9KT Fine Gold', href: '/collections/gold', badge: 'Luxe' },
    { label: 'Collections', href: '/collections', badge: null },
    { label: 'Demi-fine Jewellery', href: '/collections/demifine', badge: null },
    { label: 'Gifting', href: '/gifting', badge: null },
    { label: 'About Us', href: '/about', badge: null },
  ];

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-[#2C2C2C] text-white py-2.5 text-center relative z-[60]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <span className="text-xs tracking-[0.15em] uppercase font-light">
            Buy 4 for ₹999 Each | Use Code:
          </span>
          <span className="bg-[#B8860B] text-white text-xs px-3 py-1 rounded tracking-wider font-medium">
            MEGA4
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`fixed top-[38px] w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white shadow-lg'
            : 'bg-white/98 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Logo, Search, Icons */}
          <div className="flex justify-between items-center h-16 border-b border-gray-100">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl tracking-[0.35em] text-[#2C2C2C] font-serif font-medium">
                O R A
              </h1>
            </Link>

            {/* Center Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for jewellery..."
                  className="w-full px-5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-full text-sm font-light focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all placeholder:text-gray-400"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#B8860B] transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              {/* Mobile Search */}
              <button
                className="md:hidden text-[#2C2C2C] hover:text-[#B8860B] transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} />
              </button>

              {/* User Account */}
              <button className="hidden sm:block text-[#2C2C2C] hover:text-[#B8860B] transition-colors">
                <User size={20} strokeWidth={1.5} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative text-[#2C2C2C] hover:text-[#B8860B] transition-colors"
              >
                <Heart size={20} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B8860B] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-[#2C2C2C] hover:text-[#B8860B] transition-colors"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#2C2C2C] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-[#2C2C2C] hover:text-[#B8860B] transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Bottom Row - Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-8 py-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative group"
              >
                <span className="text-[13px] text-[#2C2C2C] hover:text-[#B8860B] transition-colors tracking-wide font-light luxury-underline">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute -top-3 -right-6 bg-[#B8860B] text-white text-[8px] px-1.5 py-0.5 rounded tracking-wider font-medium uppercase">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white px-4 py-3"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for jewellery..."
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-full text-sm font-light focus:outline-none focus:border-[#B8860B] transition-all"
                  autoFocus
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Search size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white"
            >
              <div className="flex flex-col py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between px-6 py-3 text-[#2C2C2C] hover:bg-[#FAF8F5] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm font-light tracking-wide">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="bg-[#B8860B] text-white text-[8px] px-2 py-0.5 rounded tracking-wider font-medium uppercase">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-6 py-3 text-[#2C2C2C] hover:bg-[#FAF8F5] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} strokeWidth={1.5} />
                    <span className="text-sm font-light tracking-wide">My Account</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}
