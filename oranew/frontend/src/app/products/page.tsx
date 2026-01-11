'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';
import { Menu, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  finalPrice: number;
  price: number;
  discountPercent: number;
  averageRating?: number;
  reviewCount?: number;
  images: Array<{
    id: string;
    imageUrl: string;
    isPrimary: boolean;
    altText: string;
  }>;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface FilterValue {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: string;
  search?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValue>({
    minPrice: 0,
    maxPrice: 100000,
    category: '',
    sortBy: 'createdAt',
    search: '',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchProducts = async (pageNum: number = 1, appliedFilters: FilterValue = filters) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: pagination.limit,
        ...(appliedFilters.category && { category: appliedFilters.category }),
        ...(appliedFilters.minPrice && { minPrice: appliedFilters.minPrice }),
        ...(appliedFilters.maxPrice && { maxPrice: appliedFilters.maxPrice }),
        ...(appliedFilters.sortBy && { sortBy: appliedFilters.sortBy }),
        ...(appliedFilters.search && { search: appliedFilters.search }),
      };

      const response = await api.get('/products', { params });
      setProducts(response.data.data.products);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, filters);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterValue) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">
                Showing {products.length} of {pagination.total} products
              </p>
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <ProductFilters
              onFilterChange={handleFilterChange}
              isMobile={false}
            />
          </div>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <ProductFilters
              onFilterChange={handleFilterChange}
              isMobile={true}
              onClose={() => setShowMobileFilters(false)}
            />
          )}

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-xl text-gray-900 font-semibold mb-2">
                  No products found
                </p>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={() => handleFilterChange({
                    minPrice: 0,
                    maxPrice: 100000,
                    category: '',
                    sortBy: 'createdAt',
                    search: '',
                  })}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Show first page, last page, current page, and neighbors
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.pages ||
                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                              pageNum === pagination.page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }

                      // Show ellipsis for skipped pages
                      if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                        return (
                          <span key={pageNum} className="text-gray-500">
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
}

