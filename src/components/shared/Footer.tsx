// Footer component - elegant luxury footer with newsletter
'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <footer className="bg-[#1A1A1A] text-gray-100">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="text-center md:text-left">
              <h3 className="text-xl font-serif tracking-wider mb-2">
                Join the ORA Family
              </h3>
              <p className="text-sm text-gray-400 font-light">
                Subscribe for exclusive offers, new arrivals, and styling tips.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 bg-[#2C2C2C] border border-gray-700 text-white text-sm font-light focus:outline-none focus:border-[#B8860B] transition-colors placeholder:text-gray-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#B8860B] text-white text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#D4AF37] transition-colors flex items-center gap-2"
              >
                Subscribe
                <ChevronRight size={14} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-serif tracking-[0.3em]">O R A</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-sm">
              Luxury demi-fine jewellery designed for the modern woman. Timeless elegance, 
              premium craftsmanship, and sustainable beauty.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: Twitter, href: '#' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-[#2C2C2C] flex items-center justify-center text-gray-400 hover:bg-[#B8860B] hover:text-white transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] mb-5 text-white">
              Shop
            </h4>
            <ul className="space-y-3">
              {['New Arrivals', 'Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Gold Collection'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#B8860B] transition-colors duration-200 font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] mb-5 text-white">
              Company
            </h4>
            <ul className="space-y-3">
              {['About Us', 'Our Story', 'Sustainability', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#B8860B] transition-colors duration-200 font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] mb-5 text-white">
              Help
            </h4>
            <ul className="space-y-3">
              {['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'Care Guide', 'FAQs'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#B8860B] transition-colors duration-200 font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-10 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[#B8860B]" />
              <a href="mailto:hello@ora.in" className="text-sm text-gray-400 hover:text-white transition-colors font-light">
                hello@ora.in
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[#B8860B]" />
              <a href="tel:+919876543210" className="text-sm text-gray-400 hover:text-white transition-colors font-light">
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#B8860B]" />
              <address className="text-sm text-gray-400 font-light not-italic">
                Mumbai, India
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-light">
              © {new Date().getFullYear()} ORA Jewellery. All rights reserved. Designed with elegance.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200 font-light"
                >
                  {item}
                </Link>
              ))}
            </div>
            {/* Payment Icons Placeholder */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-light">We Accept:</span>
              <div className="flex gap-2">
                {['Visa', 'MC', 'UPI', 'GPay'].map((payment) => (
                  <span
                    key={payment}
                    className="px-2 py-1 bg-[#2C2C2C] text-[10px] text-gray-400 rounded font-light"
                  >
                    {payment}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
