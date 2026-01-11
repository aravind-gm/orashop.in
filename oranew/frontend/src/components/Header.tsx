'use client';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-background-white/95 backdrop-blur-md shadow-luxury' 
        : 'bg-background-white'
    }`}>
      {/* Announcement Bar */}
      <div className="bg-primary/30 py-2 text-center">
        <p className="text-xs tracking-wider text-text-primary">
          ✨ Free Shipping on Orders Above ₹999 | Use Code: <span className="font-semibold">ORA20</span> for 20% Off
        </p>
      </div>

      <nav className="container-luxury">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl font-serif font-bold tracking-wide text-text-primary group-hover:text-accent transition-colors">
              ORA
            </span>
            <span className="hidden sm:block text-xs tracking-[0.2em] text-text-muted uppercase">
              Jewellery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link 
              href="/products" 
              className="text-text-primary hover:text-accent font-medium tracking-wide transition-colors relative group"
            >
              Collections
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/products?category=new" 
              className="text-text-primary hover:text-accent font-medium tracking-wide transition-colors relative group"
            >
              New Arrivals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-text-primary hover:text-accent font-medium tracking-wide transition-colors relative group"
            >
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className="text-text-primary hover:text-accent font-medium tracking-wide transition-colors relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link 
                href="/admin" 
                className="text-accent hover:text-accent/80 font-medium tracking-wide transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <Link
              href="/search"
              className="text-text-primary hover:text-accent transition-colors p-2 rounded-full hover:bg-primary/20"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="text-text-primary hover:text-accent transition-colors p-2 rounded-full hover:bg-primary/20"
              title="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="text-text-primary hover:text-accent transition-colors p-2 rounded-full hover:bg-primary/20 relative"
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-background-white rounded-full text-xs flex items-center justify-center font-semibold">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {token && user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-text-primary hover:text-accent font-medium transition-colors p-2 rounded-full hover:bg-primary/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden lg:inline text-sm">{user.firstName}</span>
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full pt-2 w-56">
                  <div className="bg-background-white rounded-2xl shadow-luxury-hover py-3 border border-border">
                    <div className="px-4 pb-3 mb-2 border-b border-border">
                      <p className="font-serif font-semibold text-text-primary">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>
                    <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-primary/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Account
                    </Link>
                    <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-primary/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-primary/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Wishlist
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-accent hover:bg-primary/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-error hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/auth/login" 
                  className="text-text-primary hover:text-accent font-medium transition-colors hidden sm:inline-block"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="btn-primary text-sm py-2.5 px-5 hidden sm:inline-block"
                >
                  Join ORA
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-text-primary hover:text-accent transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-border bg-background-white">
            <div className="space-y-1">
              <Link 
                href="/products" 
                className="block px-4 py-3 text-text-primary hover:bg-primary/10 rounded-xl transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Collections
              </Link>
              <Link 
                href="/products?category=new" 
                className="block px-4 py-3 text-text-primary hover:bg-primary/10 rounded-xl transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                New Arrivals
              </Link>
              <Link 
                href="/about" 
                className="block px-4 py-3 text-text-primary hover:bg-primary/10 rounded-xl transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Our Story
              </Link>
              <Link 
                href="/contact" 
                className="block px-4 py-3 text-text-primary hover:bg-primary/10 rounded-xl transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              {user?.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className="block px-4 py-3 text-accent hover:bg-primary/10 rounded-xl transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </div>
            
            {!token && (
              <div className="mt-6 pt-6 border-t border-border space-y-3 px-4">
                <Link 
                  href="/auth/login" 
                  className="block text-center py-3 text-text-primary border border-border rounded-xl hover:bg-primary/10 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block text-center btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Join ORA
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
