// Hero section - luxury banner with elegant carousel and promotional offer
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop',
    title: 'BUY 1 GET 1',
    subtitle: 'FREE',
    code: 'B1G1',
    description: 'Apply code at checkout',
    cta: 'Shop Now',
    link: '/collections/bestsellers',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&h=1080&fit=crop',
    title: 'NEW ARRIVALS',
    subtitle: '2024 Collection',
    description: 'Discover our latest demi-fine pieces',
    cta: 'Explore Now',
    link: '/collections/new-arrivals',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1920&h=1080&fit=crop',
    title: 'TIMELESS',
    subtitle: 'Elegance',
    description: '9KT Fine Gold Collection',
    cta: 'Shop Gold',
    link: '/collections/gold',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden mt-[102px]">
      {/* Slides */}
      <AnimatePresence mode="wait">
        {heroSlides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl ml-auto mr-8 lg:mr-16 text-right">
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-white/80 text-sm tracking-[0.2em] uppercase mb-4 font-light"
                      >
                        {slide.description}
                      </motion.p>

                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="font-serif text-white"
                      >
                        <span className="block text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide">
                          {slide.title}
                        </span>
                        <span className="block text-5xl md:text-7xl lg:text-8xl font-bold mt-2 text-[#D4AF37]">
                          {slide.subtitle}
                        </span>
                      </motion.h1>

                      {slide.code && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          className="mt-6 flex items-center justify-end gap-3"
                        >
                          <span className="text-white/80 text-lg font-light">CODE:</span>
                          <span className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wider">
                            {slide.code}
                          </span>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="mt-8"
                      >
                        <Link
                          href={slide.link}
                          className="inline-block px-10 py-4 bg-white text-[#2C2C2C] text-sm tracking-[0.15em] uppercase font-medium hover:bg-[#B8860B] hover:text-white transition-all duration-300"
                        >
                          {slide.cta}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#B8860B] w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={28} className="text-white/60" />
      </motion.div>
    </section>
  );
}
