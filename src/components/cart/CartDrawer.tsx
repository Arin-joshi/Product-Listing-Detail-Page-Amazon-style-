import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
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
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Your Bag</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all text-gray-500 hover:text-black"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your bag is empty</h3>
                  <p className="text-gray-500 max-w-[250px]">
                    Looks like you haven't added anything to your bag yet.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.product.id}
                      className="flex gap-4"
                    >
                      <Link 
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-24 h-24 shrink-0 rounded-2xl bg-[#F5F5F7] overflow-hidden group"
                      >
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between gap-2 mb-1">
                          <Link 
                            to={`/product/${item.product.id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-semibold text-gray-900 line-clamp-1 hover:underline"
                          >
                            {item.product.title}
                          </Link>
                          <span className="font-semibold text-gray-900 shrink-0">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-auto">{item.product.brand}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-[#F5F5F7] rounded-lg p-1 border border-transparent">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                            >
                              <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                            >
                              <Plus size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                <button 
                  onClick={() => {
                    import('sonner').then(({ toast }) => {
                      toast.success('Proceeding to checkout...');
                    });
                  }}
                  className="w-full bg-black text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 text-lg"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
