import React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, Search } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useLayoutState } from '../../contexts/LayoutContext';
import { CartDrawer } from '../cart/CartDrawer';
import { WishlistDrawer } from '../cart/WishlistDrawer';
import { motion } from 'motion/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { toggleSidebar } = useLayoutState();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const qSearchParam = searchParams.get('q') || '';
  const [localQ, setLocalQ] = React.useState(qSearchParam);

  React.useEffect(() => {
    setLocalQ(qSearchParam);
  }, [qSearchParam]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQ(val);
    
    // Create new parameters or update them
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '1');

    if (location.pathname === '/products' || location.pathname === '/') {
      setSearchParams(newParams);
    } else {
      navigate(`/products?${newParams.toString()}`);
    }
  };

  const showSidebarToggle = location.pathname === '/products' || location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 selection:bg-[#344154] selection:text-white flex flex-col">
      {/* Header aligned perfectly with screenshots */}
      <motion.header 
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="sticky top-0 z-40 bg-[#344154] shadow-md border-b border-[#2A3544]"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
          
          {/* Left spacer / Menu Button to balance the header */}
          <div className="flex items-center min-w-[40px] sm:min-w-[100px] justify-start shrink-0">
            {showSidebarToggle && (
              <button
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white focus:outline-none lg:hidden"
              >
                <Menu size={24} />
              </button>
            )}
          </div>

          {/* Search bar centered row */}
          <div className="flex-1 max-w-[650px] relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={localQ}
              onChange={handleSearchChange}
              className="w-full bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded-md py-1.5 pl-9 pr-4 text-sm placeholder-gray-400 font-normal shadow-inner"
            />
          </div>
          
          {/* Action icon group on the right - balanced static size matched to left spacer */}
          <div className="flex items-center min-w-[40px] sm:min-w-[100px] justify-end gap-2 sm:gap-4 shrink-0">
            {/* Wishlist Button */}
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors group active:scale-95 outline-none"
            >
              <Heart size={21} className="group-hover:text-red-300 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-[#344154] shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors group active:scale-95 outline-none"
            >
              <ShoppingBag size={21} className="group-hover:text-amber-100 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-[#344154] shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main page canvas */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <CartDrawer />
      <WishlistDrawer />
    </div>
  );
}
