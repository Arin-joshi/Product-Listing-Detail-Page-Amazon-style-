import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../api/products';
import { useDebounce } from '../hooks/useDebounce';
import { useMinimumLoading } from '../hooks/useMinimumLoading';
import { ProductCard } from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/product/ProductGridSkeleton';
import { Skeleton } from '../components/ui/Skeleton';
import { useLayoutState } from '../contexts/LayoutContext';

const ITEMS_PER_PAGE = 8;

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSidebarOpen, setIsSidebarOpen } = useLayoutState();
  
  const categoryParam = searchParams.get('category') || 'all';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const brandParam = searchParams.get('brand') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const qParam = searchParams.get('q') || '';

  const [q, setQ] = useState(qParam);
  const debouncedQ = useDebounce(q, 400);
  
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  useEffect(() => {
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setQ(qParam);
  }, [minPriceParam, maxPriceParam, qParam]);

  const { data: productsData, isLoading: isProductsLoading, error } = useQuery({
    queryKey: ['products', debouncedQ ? { q: debouncedQ } : { category: categoryParam }],
    queryFn: () => fetchProducts(debouncedQ ? { q: debouncedQ } : { category: categoryParam }),
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const showLoading = useMinimumLoading(isProductsLoading, 600);
  const showCategoriesLoading = useMinimumLoading(isCategoriesLoading, 600);

  const products = productsData?.products || [];
  
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (debouncedQ && categoryParam !== 'all' && p.category !== categoryParam) return false;
      if (minPriceParam && p.price < parseFloat(minPriceParam)) return false;
      if (maxPriceParam && p.price > parseFloat(maxPriceParam)) return false;
      if (brandParam && p.brand !== brandParam) return false;
      return true;
    });
  }, [products, minPriceParam, maxPriceParam, brandParam, categoryParam, debouncedQ]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (pageParam - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, pageParam]);

  const updateParams = (updates: Record<string, string | null>, shouldCloseSidebar = false) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') newParams.delete(key);
      else newParams.set(key, value);
    });
    if (!updates.page) newParams.set('page', '1');
    setSearchParams(newParams);
    if (shouldCloseSidebar) {
      setIsSidebarOpen(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
    updateParams({ q: e.target.value });
  };

  const activeFiltersCount = [
    categoryParam !== 'all',
    minPriceParam !== '',
    maxPriceParam !== '',
    brandParam !== '',
  ].filter(Boolean).length;

  const clearFilters = () => {
    const emptyParams = new URLSearchParams();
    if (q) emptyParams.set('q', q);
    setSearchParams(emptyParams);
  };

  // Shared Filters panel used in collapsible sidebar and desktop sidebar
  const renderFilterPanelContents = () => (
    <div className="space-y-7">
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-500" />
          Filters
        </h3>
        {activeFiltersCount > 0 && (
          <button 
            onClick={clearFilters} 
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories block with checkboxes */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Categories</h4>
        {showCategoriesLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-5 w-full rounded" />)}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 flex flex-col no-scrollbar">
            <label className="flex items-center gap-2.5 cursor-pointer py-0.5 text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors">
              <input
                type="checkbox"
                checked={categoryParam === 'all'}
                onChange={() => updateParams({ category: null }, true)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>All Products</span>
            </label>
            {categories.map((c) => (
              <label key={c.slug} className="flex items-center gap-2.5 cursor-pointer py-0.5 text-sm text-gray-600 hover:text-gray-950 transition-colors capitalize">
                <input
                  type="checkbox"
                  checked={categoryParam === c.slug}
                  onChange={() => updateParams({ category: categoryParam === c.slug ? null : c.slug }, true)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>{c.name.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range block with Inputs and Apply button */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Price Range</h4>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/10 rounded-md py-1.5 px-3 text-xs transition-all text-gray-900 outline-none"
          />
          <span className="text-gray-400 text-xs font-semibold">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/10 rounded-md py-1.5 px-3 text-xs transition-all text-gray-900 outline-none"
          />
        </div>
        <button
          onClick={() => updateParams({ minPrice, maxPrice }, true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md transition-all text-xs shadow-sm hover:shadow-md"
        >
          Apply
        </button>
      </div>

      {/* Brands check list */}
      {availableBrands.length > 0 && (
        <div>
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Brands</h4>
          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 flex flex-col no-scrollbar">
            {availableBrands.map((b) => (
              <label key={b} className="flex items-center gap-2.5 cursor-pointer py-0.5 text-sm text-gray-600 hover:text-gray-950 transition-colors">
                <input
                  type="checkbox"
                  checked={brandParam === b}
                  onChange={() => updateParams({ brand: brandParam === b ? null : b }, true)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full py-6 md:py-8 relative">
      
      {/* Drawer overlay for mobile filters */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          />
        )}
      </AnimatePresence>

      {/* Collapsible Mobile Sidebar Filers Drawer */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
            className="fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white border-r border-gray-200 shadow-2xl z-50 flex flex-col h-full"
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 shrink-0">
              <h2 className="text-base font-bold text-gray-900">Filters</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar">
              {renderFilterPanelContents()}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Master grid: 2-column on desktop, 1-column on mobile */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        
        {/* Left Column: Desktop Sticky Filter panel */}
        <aside className="w-[260px] shrink-0 sticky top-20 bg-white border border-gray-200 rounded-lg p-5 shadow-sm hidden lg:block select-none">
          {renderFilterPanelContents()}
        </aside>

        {/* Right Column: Dynamic catalog area */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-200 rounded-lg p-8">
              <X className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load products</h2>
              <p className="text-gray-500 mb-6 text-sm">{error.message}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : showLoading ? (
            <ProductGridSkeleton />
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">No products found</h2>
              <p className="text-gray-500 max-w-sm mx-auto mb-6 text-sm">
                We couldn't find anything matching your current filters. Try resetting search parameters.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product catalog counter */}
              <div className="mb-4.5 flex items-center justify-between text-left">
                <span className="text-[13px] text-gray-500 font-medium">
                  Showing <strong className="text-gray-900 font-semibold">{filteredProducts.length}</strong> products
                </span>
              </div>

              {/* Grid of clean product boxes matching mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Bottom Pagination Control */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1">
                  <button
                    disabled={pageParam === 1}
                    onClick={() => {
                      updateParams({ page: (pageParam - 1).toString() });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 mx-1 rounded border border-gray-200 text-xs font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all text-gray-600"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageParam === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          updateParams({ page: pageNum.toString() });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-8.5 h-8.5 rounded text-xs font-bold transition-all flex items-center justify-center border ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={pageParam === totalPages}
                    onClick={() => {
                      updateParams({ page: (pageParam + 1).toString() });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 mx-1 rounded border border-gray-200 text-xs font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all text-gray-600"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
