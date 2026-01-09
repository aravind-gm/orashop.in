// Featured Collections section - luxury category showcase like Palmonas
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    id: 'necklaces',
    name: 'NECKLACES',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    href: '/collections/necklaces',
  },
  {
    id: 'rings',
    name: 'RINGS',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    href: '/collections/rings',
  },
  {
    id: 'earrings',
    name: 'EARRINGS',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    href: '/collections/earrings',
  },
  {
    id: 'bracelets',
    name: 'BRACELETS',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    href: '/collections/bracelets',
  },
  {
    id: 'mens',
    name: 'MENS',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=400&fit=crop',
    href: '/collections/mens',
  },
  {
    id: 'mangalsutra',
    name: 'MANGALSUTRA',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop',
    href: '/collections/mangalsutra',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-serif tracking-[0.1em] text-[#2C2C2C] uppercase">
            Everyday Demifine Jewellery
          </h2>
          <div className="divider-gold" />
        </motion.div>

        {/* Decorative Holiday Banner */}
        <div className="relative mb-8 overflow-hidden rounded-lg h-20 bg-gradient-to-r from-green-800 via-green-700 to-green-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-4">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="text-2xl">🎄</span>
              ))}
              <span className="text-white font-serif text-lg tracking-wider">Holiday Special</span>
              {[...Array(6)].map((_, i) => (
                <span key={i} className="text-2xl">🎄</span>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.href} className="group block">
                <div className="relative aspect-square bg-[#FAF8F5] rounded-lg overflow-hidden mb-3 border border-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-center text-xs tracking-[0.15em] text-[#2C2C2C] group-hover:text-[#B8860B] transition-colors font-medium">
                  {category.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
