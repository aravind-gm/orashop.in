'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-background to-background-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFD6E8 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container-luxury relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tagline */}
            <div className="inline-block mb-6">
              <span className="text-sm tracking-[0.3em] uppercase text-text-muted">
                Luxury Artificial Jewellery
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="heading-display mb-6">
              own. radiate. adorn.
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto">
              Discover our exquisite collection of handcrafted artificial fashion jewellery, 
              designed to make you shine on every occasion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary text-base">
                Shop Collection
              </Link>
              <Link href="/products/new" className="btn-outline text-base">
                New Arrivals
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
          >
            <div className="text-text-muted text-sm">
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
