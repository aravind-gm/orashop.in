// Brand Philosophy section - luxury lifestyle carousel like Palmonas
'use client';

import { motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, RefreshCw, Shield, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const lifestyleSlides = [
  {
    id: 1,
    title: 'DAILY WEAR',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop',
    href: '/collections/daily-wear',
  },
  {
    id: 2,
    title: 'OFFICE WEAR',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=1000&fit=crop',
    href: '/collections/office-wear',
  },
  {
    id: 3,
    title: 'PARTY WEAR',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=1000&fit=crop',
    href: '/collections/party-wear',
  },
];

const trustBadges = [
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: '100% secure payments',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders above ₹999',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '7 days return policy',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Premium craftsmanship',
  },
];

export default function BrandPhilosophy() {
  const [_currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % lifestyleSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + lifestyleSlides.length) % lifestyleSlides.length);
  };

  return (
    <>
      {/* Lifestyle Carousel Section */}
      <section className="py-16 bg-white overflow-hidden">
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
              Style For Every Occasion
            </h2>
            <div className="divider-gold" />
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            <div className="flex gap-6 overflow-hidden">
              {lifestyleSlides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  className="flex-shrink-0 w-full md:w-1/3"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={slide.href} className="group block relative">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white text-xl font-serif tracking-wider text-center">
                          {slide.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FAF8F5] transition-colors z-10"
            >
              <ChevronLeft size={20} className="text-[#2C2C2C]" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FAF8F5] transition-colors z-10"
            >
              <ChevronRight size={20} className="text-[#2C2C2C]" />
            </button>
          </div>
        </div>
      </section>

      {/* Because You Deserve to Shine */}
      <section className="py-12 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-serif tracking-[0.1em] text-[#2C2C2C] uppercase mb-4">
              Because You Deserve to Shine
            </h2>
            <div className="divider-gold" />
            <p className="text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mt-6">
              ORA is more than jewellery — it&apos;s a philosophy. We create pieces that celebrate the modern woman: 
              confident, elegant, and unapologetically herself. Every design is born from a desire to capture 
              moments of grace.
            </p>
            <Link
              href="/about"
              className="inline-block mt-8 px-10 py-3.5 border border-[#2C2C2C] text-[#2C2C2C] text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#2C2C2C] hover:text-white transition-all duration-300"
            >
              Discover Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF8F5] flex items-center justify-center">
                    <Icon size={22} className="text-[#B8860B]" />
                  </div>
                  <h4 className="text-sm font-medium text-[#2C2C2C] mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-light">
                    {badge.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
