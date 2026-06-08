import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Heart, X, Check } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../api/products';
import { useMinimumLoading } from '../hooks/useMinimumLoading';
import { ProductDetailSkeleton } from '../components/product/ProductDetailSkeleton';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: product, isLoading: isProductLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const showLoading = useMinimumLoading(isProductLoading, 600);

  const { data: relatedData } = useQuery({
    queryKey: ['products', { category: product?.category }],
    queryFn: () => fetchProducts({ category: product?.category }),
    enabled: !!product?.category,
  });

  const [activeImage, setActiveImage] = useState<string>('');
  const [activeReviewPage, setActiveReviewPage] = useState<number>(1);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.thumbnail);
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (showLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-24 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-6">
          <X size={30} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
        <p className="text-gray-500 mb-6 max-w-sm">The item you are looking for might have been removed or is temporarily unavailable.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-colors"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/products${location.search}`);
  };

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart(product);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2000);
  };
  
  const isWished = isInWishlist(product.id);
  
  const handleWishlistClick = () => {
    if (isWished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const renderStars = (rating: number, size = 13) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} 
      className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 w-full flex flex-col text-left"
    >
      {/* 1. Back button styled exactly as Screenshot 3 */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition shadow-sm mb-6 w-fit"
      >
        <ChevronLeft size={14} /> Back
      </button>

      {/* Grid containing phone image and metadata blocks */}
      <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Image Center Card and Pagination below it */}
        <div className="flex flex-col items-center">
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center aspect-square w-full h-[380px] md:h-[450px] shadow-sm relative overflow-hidden">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={activeImage}
              alt={product.title}
              className="object-contain max-h-full max-w-full"
            />
          </div>

          {/* Multiple Image Gallery (if exists) */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 self-start mt-3 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {product.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 shrink-0 rounded border bg-white p-1 flex items-center justify-center transition-all ${
                    activeImage === img ? 'border-blue-600 ring-1 ring-blue-500' : 'border-gray-200 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="object-contain max-h-full max-w-full" />
                </button>
              ))}
            </div>
          )}

          {/* Pagination bar placed perfectly under the image exactly like Mockup 3 */}
          <div className="mt-8 flex items-center justify-center gap-1 select-none">
            <button
              disabled={activeReviewPage === 1}
              onClick={() => setActiveReviewPage(p => Math.max(1, p - 1))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={12} /> Previous
            </button>
            
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setActiveReviewPage(pageNum)}
                className={`w-7 h-7 rounded text-[11px] font-bold flex items-center justify-center border transition-all ${
                  activeReviewPage === pageNum
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={activeReviewPage === 5}
              onClick={() => setActiveReviewPage(p => Math.min(5, p + 1))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Right Column: Title and Details */}
        <div className="flex flex-col text-left">
          {/* Main Title heading of Smartphone / products */}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
            {product.title}
          </h1>

          {/* Pricing & golden stars rating in a single compact row matching mockup */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100 mb-5">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5">
              {renderStars(product.rating || 4.5, 14)}
              <span className="text-xs text-gray-400 font-semibold">({product.rating?.toFixed(1) || '4.5'})</span>
            </div>
          </div>

          {/* Brand & Category Details */}
          <div className="space-y-1 text-sm text-gray-600 mb-6">
            <div>
              <span className="font-semibold text-gray-700">Brand:</span> {product.brand || 'Universal'}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Category:</span> <span className="capitalize">{product.category.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Description Section with Tag */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Description</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-mono">
              {product.description || "This high-quality product features a robust build, powerful engineering, and sleek contours. It is thoroughly designed to meet contemporary aesthetic and utilization values seamlessly."}
            </p>
          </div>

          {/* Reviews list exactly as displayed on mockup item */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3.5 uppercase tracking-wider">Reviews</h3>
            <div className="space-y-4">
              {/* Emily review item */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3.5 text-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-gray-800">Emily</span>
                  {renderStars(4, 11)}
                  <span className="text-gray-400"> (4.0)</span>
                </div>
                <p className="text-gray-500 leading-relaxed">
                  Excellent phone with great camera and battery life. Highly recommended!
                </p>
              </div>

              {/* John review item */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3.5 text-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-gray-800">John</span>
                  {renderStars(4, 11)}
                  <span className="text-gray-400"> (4.0)</span>
                </div>
                <p className="text-gray-500 leading-relaxed">
                  Very satisfied with performance and features. It's a great value for the money.
                </p>
              </div>
            </div>
          </div>

          {/* Actions & buy block */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <button 
              onClick={handleAddToCart}
              className="flex-1 min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-all text-sm shadow-sm"
            >
              <ShoppingBag size={16} />
              {successMsg ? 'Added to Bag!' : 'Add to Bag'}
            </button>
            
            <button
              onClick={handleWishlistClick}
              className="w-11 h-11 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50 text-gray-600 transition"
              title="Add to wishlist"
            >
              <Heart size={18} className={isWished ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
