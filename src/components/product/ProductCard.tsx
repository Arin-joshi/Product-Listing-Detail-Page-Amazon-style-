import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../contexts/WishlistContext';

export function ProductCard({ product }: { product: Product }) {
  const [searchParams] = useSearchParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWished = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between"
    >
      <Link
        to={`/product/${product.id}?${searchParams.toString()}`}
        className="block h-full outline-none flex flex-col"
      >
        {/* Aspect square with subtle container rounded box */}
        <div className="relative aspect-square w-full rounded-md bg-gray-50/70 border border-gray-100 flex items-center justify-center p-3 mb-3 shrink-0 overflow-hidden">
          
          <button 
            type="button"
            onClick={handleWishlistClick}
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:scale-105 active:scale-95 transition-all outline-none"
          >
            <Heart size={15} className={`transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
          </button>
          
          <motion.img
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
            src={product.thumbnail}
            alt={product.title}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
            loading="lazy"
          />
        </div>

        {/* Content detail row to match mockups */}
        <div className="flex-1 flex flex-col justify-end text-left">
          <h3 className="font-semibold text-gray-950 text-sm leading-tight line-clamp-1 mb-1 font-sans">
            {product.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">
              ${Math.round(product.price)}
            </span>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.round(product.rating || 4.5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              ({product.rating?.toFixed(1) || '4.5'})
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
