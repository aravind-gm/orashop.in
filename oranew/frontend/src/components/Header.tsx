'use client';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-orange-600">ORA</span>
            <span className="text-xs text-gray-500">Jewellery</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
              Collections
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium">
              Contact
            </Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-700 hover:text-orange-600 font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="text-gray-600 hover:text-orange-600"
              title="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <Link
              href="/wishlist"
              className="text-gray-600 hover:text-orange-600 relative"
              title="Wishlist"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="text-gray-600 hover:text-orange-600 relative"
              title="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Link>

            {token && user ? (
              <div className="relative group">
                <button className="px-3 py-2 text-gray-700 hover:text-orange-600 font-medium">
                  {user.firstName || 'Account'} ▼
                </button>
                <div className="hidden group-hover:block absolute right-0 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <Link href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium">
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium hidden sm:inline-block">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t space-y-2">
            <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Collections
            </Link>
            <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Contact
            </Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Admin Panel
              </Link>
            )}
            {!token && (
              <>
                <Link href="/auth/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Login
                </Link>
                <Link href="/auth/register" className="block px-4 py-2 bg-orange-600 text-white">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
