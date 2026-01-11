import Hero from '@/components/home/Hero';
import NewArrivals from '@/components/home/NewArrivals';
import Newsletter from '@/components/home/Newsletter';
import Testimonials from '@/components/home/Testimonials';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Trust Badges */}
      <section className="py-8 bg-background-white border-y border-border">
        <div className="container-luxury">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-center">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-text-muted">Free Shipping</p>
                <p className="text-sm font-medium text-text-primary">Orders ₹999+</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-text-muted">Secure Payment</p>
                <p className="text-sm font-medium text-text-primary">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-text-muted">Easy Returns</p>
                <p className="text-sm font-medium text-text-primary">7-Day Policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-text-muted">Support</p>
                <p className="text-sm font-medium text-text-primary">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-luxury bg-background">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.3em] uppercase text-accent">Discover</span>
            <h2 className="heading-section mt-2 text-text-primary">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Necklaces */}
            <Link href="/products?category=necklaces" className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-primary/10">
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-text-primary/20 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-primary/20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-2xl font-serif text-background-white mb-2">Necklaces</h3>
                <p className="text-background/70 text-sm mb-4">Elegant chains & pendants</p>
                <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Explore Collection
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Earrings */}
            <Link href="/products?category=earrings" className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-primary/10">
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-text-primary/20 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-accent/20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-2xl font-serif text-background-white mb-2">Earrings</h3>
                <p className="text-background/70 text-sm mb-4">Studs, hoops & drops</p>
                <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Explore Collection
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Bracelets */}
            <Link href="/products?category=bracelets" className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-primary/10">
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-text-primary/20 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-primary/30 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-2xl font-serif text-background-white mb-2">Bracelets</h3>
                <p className="text-background/70 text-sm mb-4">Bangles & charm bracelets</p>
                <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Explore Collection
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Rings */}
            <Link href="/products?category=rings" className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-primary/10">
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-text-primary/20 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-accent/30 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-2xl font-serif text-background-white mb-2">Rings</h3>
                <p className="text-background/70 text-sm mb-4">Statement & stacking rings</p>
                <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Explore Collection
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <NewArrivals />

      {/* Promo Banner */}
      <section className="py-16 bg-primary/20">
        <div className="container-luxury">
          <div className="bg-background-white rounded-3xl overflow-hidden shadow-luxury-hover">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-10 md:p-16">
                <span className="inline-block px-4 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full mb-4">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-text-primary mb-4">
                  Get 20% Off on Your First Order
                </h2>
                <p className="text-text-secondary mb-8">
                  Join the ORA family and enjoy exclusive discounts on your first purchase. 
                  Use code <span className="font-semibold text-accent">ORA20</span> at checkout.
                </p>
                <Link href="/products" className="btn-primary inline-block">
                  Shop Now
                </Link>
              </div>
              <div className="bg-primary/20 h-64 md:h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-6xl font-serif font-bold text-accent">20%</p>
                  <p className="text-xl font-serif text-text-primary mt-2">OFF</p>
                  <p className="text-sm text-text-muted mt-2">First Order</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Why Choose ORA */}
      <section className="section-luxury bg-background-white">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.3em] uppercase text-accent">Why ORA</span>
            <h2 className="heading-section mt-2 text-text-primary">The ORA Promise</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif mb-3 text-text-primary">Premium Quality</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Each piece is crafted with attention to detail using high-quality materials that ensure lasting beauty.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif mb-3 text-text-primary">Affordable Luxury</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Experience the look and feel of fine jewellery without the hefty price tag. Beauty accessible to all.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif mb-3 text-text-primary">Made with Love</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Every design is created with passion and care, reflecting modern trends while celebrating timeless elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </main>
  );
}
