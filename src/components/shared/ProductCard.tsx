// ProductCard component - luxurious card for products with elegant hover effects
'use client';

import { useCart } from '@/components/context/CartContext';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

const colorVariants: Record<string, string> = {
  'gold': '#D4AF37',
  'rose-gold': '#E8B4B8',
  'silver': '#C0C0C0',
  'white-gold': '#F5F5F5',
  'platinum': '#E5E4E2',
};

export default function ProductCard({ product, showBadge = true }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);

  const discountPercentage = product.discount || 0;
  const hasDiscount = discountPercentage > 0 || (product.originalPrice && product.originalPrice > product.price);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/product/${product.id}`}>
        <div
          className="relative overflow-hidden bg-[#FAF8F5]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Hover overlay with swap image */}
            {product.hoverImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.hoverImage}
                  alt={`${product.name} alternate`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* Badges */}
            {showBadge && (
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <span className="badge-new">New</span>
                )}
                {hasDiscount && (
                  <span className="badge-sale">
                    {discountPercentage > 0 ? `-${discountPercentage}%` : 'Sale'}
                  </span>
                )}
              </div>
            )}

            {/* Wishlist Button */}
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-200"
            >
              <Heart
                size={18}
                className={`transition-colors duration-200 ${
                  wishlisted ? 'fill-[#B8860B] text-[#B8860B]' : 'text-gray-400 hover:text-[#B8860B]'
                }`}
              />
            </motion.button>

            {/* Quick Actions on Hover */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-3 flex gap-2"
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#2C2C2C] text-white py-3 text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#1a1a1a] transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                Add to Bag
              </button>
              <Link
                href={`/product/${product.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-12 bg-white text-[#2C2C2C] flex items-center justify-center hover:bg-[#FAF8F5] transition-colors border border-gray-200"
              >
                <Eye size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="pt-4 pb-2 px-1">
            {/* Color Variants */}
            <div className="flex items-center gap-1.5 mb-2">
              {Object.entries(colorVariants).slice(0, 3).map(([name, color]) => (
                <span
                  key={name}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={name.replace('-', ' ')}
                />
              ))}
              <span className="text-[10px] text-gray-400 ml-1 font-light">
                {product.material.replace('-', ' ')}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-medium text-[#2C2C2C] mb-2 line-clamp-2 leading-snug tracking-wide">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-base font-medium text-[#2C2C2C]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through font-light">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
