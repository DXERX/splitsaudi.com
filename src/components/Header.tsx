import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import SplitLogo, { SplitLogoMark } from './SplitLogo'
import { useCart } from '../hooks/useCart'

export default function Header() {
  const { count } = useCart()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 py-3 md:px-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isHome && (
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <SplitLogoMark size={48} />
            <SplitLogo size="md" className="hidden sm:block" />
          </Link>
        </div>

        <div className="flex-1 overflow-hidden mx-2">
          <div className="animate-marquee whitespace-nowrap font-display text-xs md:text-sm tracking-[0.25em] uppercase opacity-60">
            <span className="mx-8">Split Is Art — Drop 02 — Winter — Saudi Always —</span>
            <span className="mx-8">Split Is Art — Drop 02 — Winter — Saudi Always —</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/shop"
            className="hidden md:inline-flex rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/20 transition"
          >
            Shop All
          </Link>
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-split-red text-[10px] font-bold flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
