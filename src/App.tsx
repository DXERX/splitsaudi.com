import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LazyMotion, domAnimation } from 'framer-motion'
import { CartProvider } from './hooks/useCart'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'

const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const Cart = lazy(() => import('./pages/Cart'))
const Admin = lazy(() => import('./pages/Admin'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
})

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-split-yellow border-t-transparent animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <LazyMotion features={domAnimation} strict>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <BrowserRouter>
              <Header />
              <main>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/admin" element={<Admin />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <MobileNav />
            </BrowserRouter>
          </CartProvider>
        </QueryClientProvider>
      </LazyMotion>
    </ErrorBoundary>
  )
}
