// Checkout page - luxurious multi-step checkout experience
'use client';

import { useCart } from '@/components/context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Lock,
    MapPin,
    Package,
    Shield,
    Truck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const steps = [
  { id: 1, name: 'Information', icon: MapPin },
  { id: 2, name: 'Shipping', icon: Truck },
  { id: 3, name: 'Payment', icon: CreditCard },
];

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const shippingCost = cartTotal >= 2999 ? 0 : 99;
  const orderTotal = cartTotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto mb-6 text-gray-300" />
          <h1 className="text-2xl font-serif text-[#2C2C2C] mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some beautiful pieces to your cart to checkout.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[#2C2C2C] text-white text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif tracking-[0.3em] text-[#2C2C2C]">
            O R A
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock size={14} className="text-[#B8860B]" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Form */}
          <div className="lg:col-span-7">
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-[#B8860B] text-white'
                              : isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                        </div>
                        <span
                          className={`ml-3 text-sm font-medium ${
                            isActive ? 'text-[#2C2C2C]' : 'text-gray-400'
                          }`}
                        >
                          {step.name}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 lg:w-24 h-0.5 mx-4 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-sm">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-serif text-[#2C2C2C] mb-6">
                      Contact Information
                    </h2>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                        />
                      </div>

                      <h3 className="text-lg font-serif text-[#2C2C2C] pt-4">
                        Shipping Address
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            State
                          </label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all bg-white"
                          >
                            <option value="">Select</option>
                            <option value="MH">Maharashtra</option>
                            <option value="DL">Delhi</option>
                            <option value="KA">Karnataka</option>
                            <option value="TN">Tamil Nadu</option>
                            <option value="GJ">Gujarat</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-serif text-[#2C2C2C] mb-6">
                      Shipping Method
                    </h2>
                    
                    <div className="space-y-4">
                      <label
                        className={`flex items-center justify-between p-5 border rounded-lg cursor-pointer transition-all ${
                          formData.shippingMethod === 'standard'
                            ? 'border-[#B8860B] bg-[#B8860B]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            checked={formData.shippingMethod === 'standard'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#B8860B] focus:ring-[#B8860B]"
                          />
                          <div>
                            <p className="font-medium text-[#2C2C2C]">Standard Shipping</p>
                            <p className="text-sm text-gray-500">5-7 business days</p>
                          </div>
                        </div>
                        <span className="font-medium text-[#2C2C2C]">
                          {cartTotal >= 2999 ? 'FREE' : '₹99'}
                        </span>
                      </label>
                      
                      <label
                        className={`flex items-center justify-between p-5 border rounded-lg cursor-pointer transition-all ${
                          formData.shippingMethod === 'express'
                            ? 'border-[#B8860B] bg-[#B8860B]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={formData.shippingMethod === 'express'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#B8860B] focus:ring-[#B8860B]"
                          />
                          <div>
                            <p className="font-medium text-[#2C2C2C]">Express Shipping</p>
                            <p className="text-sm text-gray-500">2-3 business days</p>
                          </div>
                        </div>
                        <span className="font-medium text-[#2C2C2C]">₹199</span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-serif text-[#2C2C2C] mb-6">
                      Payment Method
                    </h2>
                    
                    <div className="space-y-4 mb-8">
                      {[
                        { value: 'card', label: 'Credit / Debit Card', icon: '💳' },
                        { value: 'upi', label: 'UPI', icon: '📱' },
                        { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
                        { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center gap-4 p-5 border rounded-lg cursor-pointer transition-all ${
                            formData.paymentMethod === method.value
                              ? 'border-[#B8860B] bg-[#B8860B]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={formData.paymentMethod === method.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#B8860B] focus:ring-[#B8860B]"
                          />
                          <span className="text-xl">{method.icon}</span>
                          <span className="font-medium text-[#2C2C2C]">{method.label}</span>
                        </label>
                      ))}
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4 p-5 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                {currentStep > 1 ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2C2C2C] transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2C2C2C] transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Continue Shopping
                  </Link>
                )}
                
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-[#2C2C2C] text-white text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#1a1a1a] transition-colors"
                  >
                    Continue
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button className="flex items-center gap-2 px-8 py-3 bg-[#B8860B] text-white text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#D4AF37] transition-colors">
                    <Lock size={14} />
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-sm sticky top-6">
              <h2 className="text-lg font-serif text-[#2C2C2C] mb-6 pb-4 border-b border-gray-100">
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-[#FAF8F5] rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2C2C2C] truncate">
                        {item.name}
                      </p>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">{item.selectedColor}</p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#2C2C2C]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6 pb-6 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B8860B] transition-all"
                />
                <button className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors rounded-lg">
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#2C2C2C]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-[#2C2C2C]">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                {cartTotal < 2999 && (
                  <p className="text-xs text-green-600">
                    Add {formatPrice(2999 - cartTotal)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-lg font-medium text-[#2C2C2C]">Total</span>
                <span className="text-xl font-serif font-medium text-[#2C2C2C]">
                  {formatPrice(orderTotal)}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-gray-400">
                  <Shield size={20} />
                  <span className="text-xs">100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
