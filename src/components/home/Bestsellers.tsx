// Bestsellers section - top styles with category filter tabs like Palmonas
'use client';

import ProductCard from '@/components/shared/ProductCard';
import { PRODUCTS } from '@/data/products';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const filterTabs = [
  { id: 'all', label: 'ALL' },
  { id: 'necklaces', label: 'NECKLACES' },
  { id: 'bracelets', label: 'BRACELETS' },
  { id: 'earrings', label: 'EARRINGS' },
  { id: 'rings', label: 'RINGS' },
];

export default function Bestsellers() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = activeTab === 'all'
    ? PRODUCTS.slice(0, 8)
    : PRODUCTS.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <section className="py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-serif tracking-[0.1em] text-[#2C2C2C] uppercase">
            ORA Top Styles
          </h2>
          <div className="divider-gold" />
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-xs tracking-[0.1em] uppercase font-medium transition-all duration-300 border ${
                activeTab === tab.id
                  ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]'
                  : 'bg-white text-[#2C2C2C] border-gray-200 hover:border-[#2C2C2C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-10 py-3.5 border border-[#2C2C2C] text-[#2C2C2C] text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#2C2C2C] hover:text-white transition-all duration-300">
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  );
}
