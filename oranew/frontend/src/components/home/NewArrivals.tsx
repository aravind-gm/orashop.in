'use client';

import Link from 'next/link';

// This will be replaced with actual API call
const products = [
  { id: 1, name: 'Rose Gold Pendant', price: 2499, image: '' },
  { id: 2, name: 'Pearl Earrings', price: 1899, image: '' },
  { id: 3, name: 'Crystal Bracelet', price: 1599, image: '' },
  { id: 4, name: 'Statement Ring', price: 999, image: '' },
];

export default function NewArrivals() {
  return (
    <section className="section-luxury bg-background">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="heading-section mb-4">New Arrivals</h2>
            <p className="text-luxury max-w-lg">
              Be the first to discover our latest designs, fresh from our atelier.
            </p>
          </div>
          <Link href="/products/new" className="btn-outline hidden md:inline-block">
            View All
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="product-card"
            >
              <div className="product-image-container">
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <div className="badge-new absolute top-4 left-4">New</div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg mb-2">{product.name}</h3>
                <p className="text-text-primary font-medium">₹{product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link href="/products/new" className="btn-outline">
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
