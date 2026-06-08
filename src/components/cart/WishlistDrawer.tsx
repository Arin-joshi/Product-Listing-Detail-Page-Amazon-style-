import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

export function WishlistDrawer() {
  const { isWishlistOpen, setIsWishlistOpen, wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-red-500">
                <Heart className="w-5 h-5 fill-current" />
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Wishlist</h2>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all text-gray-500 hover:text-black"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlistItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your wishlist is empty</h3>
                  <p className="text-gray-500 max-w-[250px]">
                    Save items you like to your wishlist to find them easily later.
                  </p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="mt-4 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {wishlistItems.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      className="flex gap-4 group"
                    >
                      <Link 
                        to={`/product/${item.id}`}
                        onClick={() => setIsWishlistOpen(false)}
                        className="w-24 h-24 shrink-0 rounded-2xl bg-[#F5F5F7] overflow-hidden relative"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between gap-2 mb-1">
                          <Link 
                            to={`/product/${item.id}`}
                            onClick={() => setIsWishlistOpen(false)}
                            className="font-semibold text-gray-900 line-clamp-1 hover:underline"
                          >
                            {item.title}
                          </Link>
                          <span className="font-semibold text-gray-900 shrink-0">
                            ${(item.price).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-auto">{item.brand || item.category}</p>
                        
                        <div className="flex items-center gap-2 mt-3">
                            <button
                                onClick={() => handleMoveToCart(item)}
                                className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors active:scale-95"
                            >
                                <ShoppingBag size={14} /> Add to Bag
                            </button>
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors border border-gray-100 hover:border-red-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
