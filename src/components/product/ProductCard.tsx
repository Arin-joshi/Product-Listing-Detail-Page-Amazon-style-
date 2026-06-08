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
      className="bg-white border border-gray-100/50 rounded-2xl p-4 premium-shadow hover:premium-shadow-hover transition-shadow duration-300 h-full flex flex-col justify-between group"
    >
      <Link
        to={`/product/${product.id}?${searchParams.toString()}`}
        className="block h-full outline-none flex flex-col"
      >
        {/* Aspect square with subtle container rounded box */}
        <div className="relative aspect-square w-full rounded-xl bg-gray-50 border border-gray-50 flex items-center justify-center p-5 mb-4 shrink-0 overflow-hidden">
          
          <button 
            type="button"
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 z-20 w-8 h-8 glass rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:scale-105 active:scale-95 transition-all outline-none opacity-0 group-hover:opacity-100 md:opacity-100"
          >
            <Heart size={15} className={`transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
          </button>
          
          <motion.img
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            src={product.thumbnail}
            alt={product.title}
            className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-sm"
            loading="lazy"
          />
        </div>

        {/* Content detail row to match mockups */}
        <div className="flex-1 flex flex-col justify-end text-left">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 font-geist">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap mt-auto">
            <span className="font-bold text-primary-600 text-[15px]">
              ${Math.round(product.price)}
            </span>
            <div className="flex items-center ml-auto">
              <Star size={13} className="text-amber-400 fill-amber-400 mr-1" />
              <span className="text-xs text-gray-500 font-medium">
                {product.rating?.toFixed(1) || '4.5'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
