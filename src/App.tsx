/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import RootLayout from './components/layout/RootLayout';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { LayoutProvider } from './contexts/LayoutContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <LayoutProvider>
            <CartProvider>
              <BrowserRouter>
                <Routes>
                  {/* Redirect root path directly to products catalog */}
                  <Route path="/" element={
                    <RootLayout>
                      <Navigate to="/products" replace />
                    </RootLayout>
                  } />
                  <Route path="/products" element={
                    <RootLayout>
                      <ProductList />
                    </RootLayout>
                  } />
                  <Route path="/product/:id" element={
                    <RootLayout>
                      <ProductDetail />
                    </RootLayout>
                  } />
                </Routes>
              </BrowserRouter>
              <Toaster 
                position="top-right"
                expand={false}
                offset="104px"
                className="font-sans"
                toastOptions={{ 
                  style: { 
                    borderRadius: '0.75rem',
                    padding: '0.625rem 0.875rem',
                    boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.1)',
                    border: '1px solid #EAE8E0',
                    background: '#FAF9F6',
                    color: '#1A1A1A',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '13px',
                    width: 'auto',
                    minWidth: '220px',
                    maxWidth: '300px'
                  } 
                }} 
              />
            </CartProvider>
          </LayoutProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

