// Gifting section - elegant gifting cards like Palmonas
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const giftingCategories = [
  {
    id: 'wife',
    title: 'WIFE',
    subtitle: 'Gifts For',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop',
    color: 'from-rose-100 to-pink-50',
    href: '/gifting/wife',
  },
  {
    id: 'husband',
    title: 'HUSBAND',
    subtitle: 'Gifts For',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&h=600&fit=crop',
    color: 'from-blue-100 to-slate-50',
    href: '/gifting/husband',
  },
  {
    id: 'girlfriend',
    title: 'GIRLFRIEND',
    subtitle: 'Gifts For',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=600&fit=crop',
    color: 'from-amber-100 to-orange-50',
    href: '/gifting/girlfriend',
  },
  {
    id: 'boyfriend',
    title: 'BOYFRIEND',
    subtitle: 'Gifts For',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=600&fit=crop',
    color: 'from-gray-100 to-slate-50',
    href: '/gifting/boyfriend',
  },
];

export default function GiftingSection() {
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
            The Gifting Edit
          </h2>
          <div className="divider-gold" />
          <p className="text-gray-500 font-light max-w-xl mx-auto mt-4">
            Find the perfect piece for your loved ones. Thoughtfully curated collections for every special person.
          </p>
        </motion.div>

        {/* Gifting Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {giftingCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.href} className="group block">
                <div className={`relative overflow-hidden rounded-lg bg-gradient-to-b ${category.color} aspect-[3/4]`}>
                  {/* Decorative Top Badge */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-[#A52A2A] flex flex-col items-center justify-center text-white shadow-lg">
                        <span className="text-[8px] tracking-[0.1em] uppercase">Gifts For</span>
                        <span className="text-sm font-serif font-semibold tracking-wider mt-0.5">
                          {category.title}
                        </span>
                      </div>
                      {/* Ribbon effect */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-[#A52A2A] rounded-t-sm" />
                    </div>
                  </div>

                  {/* Image */}
                  <div className="absolute inset-0 pt-24">
                    <Image
                      src={category.image}
                      alt={`Gifts for ${category.title}`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
