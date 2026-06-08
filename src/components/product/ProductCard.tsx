import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

export function ProductCard({ product }: { product: Product }) {
  const [searchParams] = useSearchParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const isWished = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };
  
  const ratingValue = product.rating || 4.2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] transition-all duration-300 h-full flex flex-col group relative"
    >
      <Link
        to={`/product/${product.id}?${searchParams.toString()}`}
        className="block h-full outline-none flex flex-col"
      >
        {/* Aspect square with pure white container */}
        <div className="relative aspect-square w-full bg-white flex items-center justify-center p-2 mb-4 shrink-0 overflow-hidden">
          
          <button 
            type="button"
            onClick={handleWishlistClick}
            className="absolute top-0 right-0 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 shadow-sm border border-gray-100 hover:scale-105 active:scale-95 transition-all outline-none opacity-0 group-hover:opacity-100 md:opacity-100"
          >
            <Heart size={15} className={`transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'hover:text-red-500'}`} />
          </button>
          
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            src={product.thumbnail}
            alt={product.title}
            className="max-h-full max-w-full object-contain drop-shadow-sm mix-blend-multiply"
            loading="lazy"
          />
        </div>

        {/* Divider line like in the image */}
        <div className="w-full h-px bg-gray-100 mb-4"></div>

        {/* Content detail row */}
        <div className="flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 mb-3">
            {product.title}
          </h3>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-gray-900 text-[22px]">
                ${Math.round(product.price)}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(ratingValue) ? "text-[#FFB800] fill-[#FFB800]" : "text-gray-200 fill-gray-200"}
                    />
                  ))}
                </div>
                <span className="text-[13px] text-gray-500 font-medium ml-0.5">
                  ({ratingValue.toFixed(1)})
                </span>
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCartClick}
              className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all border border-gray-200 shadow-sm active:scale-95 z-20 group/cart"
            >
              <ShoppingCart size={16} strokeWidth={2.5} className="group-hover/cart:-rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
