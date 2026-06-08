import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion } from 'motion/react';
import { CheckCircle, ChevronLeft, CreditCard, Package } from 'lucide-react';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-16 w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 md:p-12 rounded-2xl premium-shadow flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Thank you for your purchase. We've received your order and will email you the tracking details shortly.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition-all"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 w-full flex flex-col">
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition mb-6 w-fit"
      >
        <ChevronLeft size={16} /> Back to Products
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 premium-shadow">
          <p className="text-gray-500 mb-6">Your order is empty.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Checkout Form */}
          <div className="flex-1 w-full bg-white border border-gray-100 rounded-2xl p-6 md:p-8 premium-shadow">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Shipping Section */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" /> Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="text" placeholder="First Name" className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-sm outline-none" />
                  <input required type="text" placeholder="Last Name" className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-sm outline-none" />
                  <input required type="text" placeholder="Address" className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-sm outline-none md:col-span-2" />
                  <input required type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-sm outline-none" />
                  <input required type="text" placeholder="Postal Code" className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-sm outline-none" />
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-600" /> Payment Information
                </h2>
                <div className="space-y-4">
                  <input required type="text" placeholder="Card Number" className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-sm outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-sm outline-none" />
                    <input required type="text" placeholder="CVC" className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-sm outline-none" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold rounded-xl py-4 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[350px] shrink-0 bg-white border border-gray-100 rounded-2xl p-6 premium-shadow sticky top-28">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto no-scrollbar">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded flex items-center justify-center shrink-0 p-1">
                    <img src={item.product.thumbnail} alt={item.product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.title}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 py-4 border-t border-gray-100 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-4 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 text-xl">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
