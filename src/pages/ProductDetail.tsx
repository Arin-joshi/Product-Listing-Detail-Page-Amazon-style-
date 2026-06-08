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
          {/* Main Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2 font-geist">
            {product.title}
          </h1>

          {/* Golden stars rating & Brand */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1 cursor-pointer">
              {renderStars(product.rating || 4.5, 16)}
              <span className="text-blue-600 hover:text-orange-500 hover:underline ml-1">
                ({product.reviews?.length || 0})
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <span>Brand: <span className="text-blue-600 hover:text-orange-500 hover:underline cursor-pointer">{product.brand || 'Generic'}</span></span>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-red-600 text-lg font-semibold bg-red-50 px-2 rounded-sm">-{Math.round(product.discountPercentage)}%</span>
                  <span className="text-3xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  List Price: <span className="line-through">${((product.price * 100) / (100 - product.discountPercentage)).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="text-3xl font-extrabold text-gray-900">${product.price.toFixed(2)}</div>
            )}
          </div>

          {/* Product Information */}
          <div className="mt-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Product Information</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {product.description}
            </p>

            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
              <li>Category: <span className="capitalize">{product.category.replace('-', ' ')}</span></li>
              {product.dimensions && (
                <li>Dimensions: {product.dimensions.width}" W x {product.dimensions.height}" H x {product.dimensions.depth}" D</li>
              )}
              {product.weight && (
                <li>Weight: {product.weight} {product.weight < 100 ? 'lbs' : 'oz'}</li>
              )}
              {product.sku && (
                <li>SKU: {product.sku}</li>
              )}
              <li>Warranty: {product.warrantyInformation || '1 Year Manufacturer Warranty'}</li>
              <li>Product ID: {product.id}</li>
            </ul>
          </div>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-2 mt-6">
              {product.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: The Buy Box */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col shadow-sm sticky top-28 h-fit">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${product.price.toFixed(2)}
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium text-gray-900">{product.shippingInformation || 'Free Standard Shipping'}</span> on all orders.
          </div>

          {/* Stock Urgency Indicator */}
          <div className="mb-6">
            <div className={`font-bold text-sm flex items-center gap-1.5 ${product.availabilityStatus === 'Low Stock' || (product.stock && product.stock > 0 && product.stock < 20) ? 'text-orange-600' : (product.availabilityStatus === 'Out of Stock' || product.stock === 0 ? 'text-red-600' : 'text-green-600')}`}>
              {product.availabilityStatus !== 'Out of Stock' && product.stock !== 0 ? <Check size={16} strokeWidth={2.5} /> : null}
              {product.availabilityStatus || (product.stock && product.stock > 0 ? (product.stock < 20 ? `Only ${product.stock} left in stock - order soon` : 'In Stock and Ready to Ship') : 'Out of Stock')}
            </div>
          </div>

          {/* Add to Cart / Buy Now buttons */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              {successMsg ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button 
              onClick={() => {
                handleAddToCart();
                setTimeout(() => navigate('/checkout'), 500);
              }}
              className="w-full bg-[#111827] hover:bg-black text-white font-bold rounded-lg py-3 transition-colors"
            >
              Buy it Now
            </button>
          </div>

          {/* Ships from / Returns text */}
          <div className="text-xs text-gray-500 flex flex-col gap-2 mb-6">
            <div className="flex justify-between">
              <span>Ships from</span>
              <span className="font-medium text-gray-700">Premium Store</span>
            </div>
            <div className="flex justify-between">
              <span>Returns</span>
              <span className="font-medium text-gray-700">{product.returnPolicy || '30-Day Guarantee'}</span>
            </div>
          </div>

          {/* Add to List */}
          <div>
            <button
              onClick={handleWishlistClick}
              className="w-full border border-gray-200 rounded-lg text-sm py-2 hover:bg-gray-50 text-gray-700 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Heart size={15} className={isWished ? "fill-red-500 text-red-500" : ""} />
              {isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

      </div>

      {/* Customer Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-geist">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">
                    {review.reviewerName.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{review.reviewerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating, 14)}
                  <span className="text-xs font-semibold text-gray-800">{review.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-500">Reviewed on {new Date(review.date).toLocaleDateString()}</span>
                <p className="text-sm text-gray-700 mt-2">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
