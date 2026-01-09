// Product detail page - luxurious product view with all details
'use client';

import { useCart } from '@/components/context/CartContext';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import { PRODUCTS } from '@/data/products';
import { motion } from 'framer-motion';
import {
    Check,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    RefreshCw,
    Share2,
    Shield,
    Star,
    Truck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const colorOptions = [
  { name: 'Gold', color: '#D4AF37' },
  { name: 'Rose Gold', color: '#E8B4B8' },
  { name: 'Silver', color: '#C0C0C0' },
];

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const product = PRODUCTS.find((p) => p.id === resolvedParams.id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].name);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  
  if (!product) {
    notFound();
  }

  const wishlisted = isInWishlist(product.id);
  const images = [product.image, product.hoverImage || product.image];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-[140px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#B8860B] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/collections" className="hover:text-[#B8860B] transition-colors">Collections</Link>
            <ChevronRight size={14} />
            <Link href={`/collections/${product.category}`} className="hover:text-[#B8860B] transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#2C2C2C]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-[#FAF8F5] rounded-lg overflow-hidden mb-4">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 badge-new">New</span>
                )}
                {product.discount && product.discount > 0 && (
                  <span className="absolute top-4 right-4 badge-sale">-{product.discount}%</span>
                )}
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 bg-[#FAF8F5] rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-[#B8860B]' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Title & Rating */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-[0.15em] mb-2">
                  {product.material.replace('-', ' ')}
                </p>
                <h1 className="text-2xl md:text-3xl font-serif text-[#2C2C2C] mb-3">
                  {product.name}
                </h1>
                
                {product.rating && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(product.rating!) ? 'fill-[#B8860B] text-[#B8860B]' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-6 border-b border-gray-100">
                <span className="text-2xl font-medium text-[#2C2C2C]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <p className="text-sm font-medium text-[#2C2C2C] mb-3">
                  Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => setSelectedColor(option.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === option.name
                          ? 'border-[#2C2C2C] scale-110'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: option.color }}
                    >
                      {selectedColor === option.name && (
                        <Check size={16} className="text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-sm font-medium text-[#2C2C2C] mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-[#FAF8F5] transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-[#FAF8F5] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-green-600">In Stock</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#2C2C2C] text-white text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#1a1a1a] transition-colors"
                >
                  Add to Bag
                </button>
                <button
                  onClick={handleWishlist}
                  className={`w-14 h-14 border flex items-center justify-center transition-all ${
                    wishlisted
                      ? 'border-[#B8860B] bg-[#B8860B]/5'
                      : 'border-gray-200 hover:border-[#B8860B]'
                  }`}
                >
                  <Heart
                    size={20}
                    className={wishlisted ? 'fill-[#B8860B] text-[#B8860B]' : 'text-gray-400'}
                  />
                </button>
                <button className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:border-[#2C2C2C] transition-colors">
                  <Share2 size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-100">
                <div className="text-center">
                  <Truck size={22} className="mx-auto mb-2 text-[#B8860B]" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RefreshCw size={22} className="mx-auto mb-2 text-[#B8860B]" />
                  <p className="text-xs text-gray-600">7 Days Return</p>
                </div>
                <div className="text-center">
                  <Shield size={22} className="mx-auto mb-2 text-[#B8860B]" />
                  <p className="text-xs text-gray-600">Secure Checkout</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-[#2C2C2C] mb-3 uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Care Instructions */}
              <div>
                <h3 className="text-sm font-medium text-[#2C2C2C] mb-3 uppercase tracking-wider">
                  Care Instructions
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {product.careInstructions}
                </p>
              </div>

              {/* Product Highlights */}
              <div className="bg-[#FAF8F5] p-5 rounded-lg">
                <h3 className="text-sm font-medium text-[#2C2C2C] mb-3 uppercase tracking-wider">
                  Product Highlights
                </h3>
                <ul className="space-y-2">
                  {product.trustBadges.map((badge, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={14} className="text-[#B8860B]" />
                      {badge}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
