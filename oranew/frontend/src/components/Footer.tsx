'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-bold text-white mb-2">
              <span className="text-orange-600">ORA</span> Jewellery
            </div>
            <p className="text-sm text-gray-400">own. radiate. adorn.</p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-orange-600">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-orange-600">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-orange-600">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold text-white mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/login" className="hover:text-orange-600">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-orange-600">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-orange-600">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-orange-600">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-orange-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-orange-600">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-400">
            © 2026 ORA Jewellery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
