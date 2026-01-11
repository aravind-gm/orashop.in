'use client';

import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  description?: string;
  stockQuantity: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const response = await api.get(`/products?search=${encodeURIComponent(term)}`);
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      handleSearch(query);
    }
  }, [query, handleSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const isInWishlist = (productId: string) => wishlistItems.some(item => item.productId === productId);

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image || '',
        price: product.price,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-primary/20 to-background py-16">
        <div className="container-luxury text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-light text-text-primary mb-4">
            Search Collection
          </h1>
          <p className="text-text-muted mb-8">Find your perfect piece of jewellery</p>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-14 pr-32 rounded-2xl bg-background-white border border-border shadow-luxury focus:outline-none focus:ring-2 focus:ring-accent/30 text-text-primary"
                placeholder="Search for rings, necklaces, earrings..."
              />
              <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-accent text-background-white rounded-xl font-medium hover:bg-accent/90 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container-luxury py-10">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted">Searching...</p>
          </div>
        ) : !searched ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-text-muted text-lg">Enter a search term to discover our collection</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-text-primary mb-2">No Results Found</h2>
            <p className="text-text-muted mb-6">We couldn&apos;t find any products matching &quot;{searchTerm}&quot;</p>
            <Link href="/products" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-text-muted">
                Found <span className="font-medium text-text-primary">{products.length}</span> results for &quot;{searchTerm}&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group bg-background-white rounded-2xl shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-all duration-300">
                  <div className="relative aspect-square bg-primary/5 overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 w-9 h-9 bg-background-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition shadow-sm"
                    >
                      <svg className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-error fill-current' : 'text-text-muted'}`} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-background-white text-xs font-medium rounded-full">
                        Only {product.stockQuantity} left
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-serif font-semibold text-text-primary hover:text-accent transition line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-xl font-serif font-bold text-accent mt-2">
                      ₹{product.price.toLocaleString()}
                    </p>

                    <button
                      onClick={() => addToCart({
                        id: crypto.randomUUID(),
                        productId: product.id,
                        name: product.name,
                        image: product.image || '',
                        price: product.price,
                        quantity: 1,
                      })}
                      disabled={product.stockQuantity === 0}
                      className="btn-primary w-full mt-4 py-2.5 text-sm disabled:bg-border disabled:cursor-not-allowed"
                    >
                      {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
