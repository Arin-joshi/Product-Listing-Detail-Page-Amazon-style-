import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ChevronRight, Star, ShoppingBag, Heart, X, Check, ShieldCheck, Truck, RotateCcw, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../api/products';
import { useMinimumLoading } from '../hooks/useMinimumLoading';
import { ProductDetailSkeleton } from '../components/product/ProductDetailSkeleton';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';

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
  const [successMsg, setSuccessMsg] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

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
            className={i < Math.round(rating) ? 'text-[#FFB800] fill-[#FFB800]' : 'text-gray-200 fill-gray-200'}
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
      className="max-w-[1300px] mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex flex-col text-left"
    >
      {/* Premium Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 font-medium">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${product.category}`} className="hover:text-blue-600 transition-colors capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 truncate max-w-[150px] sm:max-w-[300px]">{product.title}</span>
      </nav>

      {/* 3-Column Premium Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] xl:grid-cols-[500px_1fr_350px] gap-8 xl:gap-12 items-start">
        
        {/* Left Column: Image Center Card and vertical thumbnails */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[550px] no-scrollbar shrink-0 pb-2 sm:pb-0">
              {product.images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setActiveImage(img)}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 shrink-0 rounded-xl bg-white p-2 flex items-center justify-center transition-all ${
                    activeImage === img ? 'ring-2 ring-blue-600 shadow-md' : 'border border-gray-200 hover:border-blue-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="object-contain max-h-full max-w-full mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="bg-white flex-1 flex items-center justify-center aspect-square md:aspect-auto md:h-[550px] relative overflow-hidden rounded-2xl border border-gray-100 p-8 group">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={activeImage}
              alt={product.title}
              className="object-contain max-h-full max-w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
            />
            {product.discountPercentage && product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10 tracking-wide">
                SAVE {Math.round(product.discountPercentage)}%
              </div>
            )}
            <button 
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Middle Column: Title and Details */}
        <div className="flex flex-col text-left">
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-700 tracking-widest uppercase bg-blue-50 px-2.5 py-1 rounded-md">
              {product.brand || 'Premium Quality'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 font-geist tracking-tight">
            {product.title}
          </h1>

          {/* Golden stars rating */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors -ml-2" onClick={() => setIsReviewsOpen(true)}>
              {renderStars(product.rating || 4.5, 18)}
              <span className="text-sm font-semibold text-gray-800 ml-1">
                {product.rating?.toFixed(1) || '4.5'}
              </span>
              <span className="text-sm text-blue-600 hover:underline">
                ({product.reviews?.length || 0} verified reviews)
              </span>
            </div>
          </div>

          {/* Product Information Accordions */}
          <div className="space-y-4">
            {/* Description Accordion */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => setIsDescOpen(!isDescOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors font-bold text-gray-900"
              >
                <span className="text-[15px]">Product Description</span>
                {isDescOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
              </button>
              {isDescOpen && (
                <div className="p-5 bg-white text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  <p className="mb-4">{product.description}</p>
                  
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                      {product.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Specifications Accordion */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors font-bold text-gray-900"
              >
                <span className="text-[15px]">Specifications</span>
                {isSpecsOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
              </button>
              {isSpecsOpen && (
                <div className="p-5 bg-white text-sm text-gray-600 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium text-gray-900 capitalize">{product.category.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Brand</span>
                      <span className="font-medium text-gray-900">{product.brand || 'Generic'}</span>
                    </div>
                    {product.sku && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">SKU</span>
                        <span className="font-medium text-gray-900">{product.sku}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Weight</span>
                        <span className="font-medium text-gray-900">{product.weight} {product.weight < 100 ? 'lbs' : 'oz'}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Dimensions</span>
                        <span className="font-medium text-gray-900">{product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}</span>
                      </div>
                    )}
                    {product.minimumOrderQuantity && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Min Order Qty</span>
                        <span className="font-medium text-gray-900">{product.minimumOrderQuantity} units</span>
                      </div>
                    )}
                  </div>
                  
                  {product.meta?.qrCode && (
                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col items-start gap-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Product QR Code</span>
                      <img src={product.meta.qrCode} alt="QR Code" className="w-24 h-24 border border-gray-200 rounded p-1 bg-white" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reviews Accordion */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors font-bold text-gray-900"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[15px]">Customer Reviews</span>
                  <span className="bg-blue-100 text-blue-700 text-xs py-0.5 px-2 rounded-full font-bold">{product.reviews?.length || 0}</span>
                </div>
                {isReviewsOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
              </button>
              {isReviewsOpen && (
                <div className="p-5 bg-white border-t border-gray-100 flex flex-col gap-6 max-h-[400px] overflow-y-auto">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, i) => (
                      <div key={i} className="flex flex-col gap-2 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm">{review.reviewerName}</span>
                          <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        {renderStars(review.rating, 14)}
                        <p className="text-sm text-gray-600 italic mt-1">"{review.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No reviews yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: The Buy Box */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col premium-shadow sticky top-28 h-fit">
          <div className="text-4xl font-extrabold text-gray-900 mb-2 font-geist tracking-tight">
            ${product.price.toFixed(2)}
          </div>

          {product.discountPercentage && product.discountPercentage > 0 && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <span className="text-gray-400 line-through">${((product.price * 100) / (100 - product.discountPercentage)).toFixed(2)}</span>
              <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">You save ${(((product.price * 100) / (100 - product.discountPercentage)) - product.price).toFixed(2)}</span>
            </div>
          )}

          {/* Stock Urgency Indicator */}
          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className={`font-bold mb-2 flex items-center gap-2 ${product.stock > 0 && product.stock < 20 ? 'text-orange-600' : 'text-green-600'}`}>
              <Check size={18} strokeWidth={2.5} />
              {product.stock > 0 ? (product.stock < 20 ? `Only ${product.stock} left in stock - order soon` : 'In Stock and Ready to Ship') : 'Out of Stock'}
            </div>
            {product.stock > 0 && product.stock < 50 && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${Math.max(10, (product.stock / 50) * 100)}%` }}></div>
              </div>
            )}
          </div>

          {/* Add to Cart / Buy Now buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <ShoppingBag size={18} />
              {successMsg ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button 
              onClick={() => {
                handleAddToCart();
                setTimeout(() => navigate('/checkout'), 500);
              }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl py-4 shadow-sm transition-all active:scale-[0.98]"
            >
              Buy it Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600 leading-tight">{product.warrantyInformation || '1 Year Warranty'}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <Truck size={22} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600 leading-tight">{product.shippingInformation || 'Free Shipping'}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                <RotateCcw size={22} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600 leading-tight">{product.returnPolicy || '30-Day Returns'}</span>
            </div>
          </div>

          {/* Add to List */}
          <div>
            <button
              onClick={handleWishlistClick}
              className="w-full border border-gray-200 rounded-xl text-sm py-3 hover:bg-gray-50 text-gray-700 font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Heart size={16} className={isWished ? "fill-red-500 text-red-500" : ""} />
              {isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

      </div>

      {/* Related Products Section */}
      {relatedData?.products && relatedData.products.length > 1 && (
        <div className="mt-20 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 font-geist tracking-tight">Customers also viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedData.products
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
