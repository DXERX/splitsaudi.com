import { Link } from 'react-router-dom'
import SplitLogo, { SplitTagline } from './SplitLogo'
import NotifySignup from './NotifySignup'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-split-black px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <NotifySignup variant="inline" source="footer" />
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <SplitLogo size="lg" />
            <SplitTagline className="mt-2" />
            <p className="mt-4 max-w-sm text-sm text-white/50 leading-relaxed">
              Saudi streetwear. Drop 02 — Winter collection. Knowing when to shift, when to stay.
            </p>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-display tracking-widest uppercase text-white/40 text-xs">Shop</p>
              <Link to="/shop" className="block hover:text-split-yellow transition">All Products</Link>
              <Link to="/product/split-loop" className="block hover:text-split-yellow transition">Split Loop</Link>
              <Link to="/product/sia-double" className="block hover:text-split-yellow transition">SIA Double</Link>
            </div>
            <div className="space-y-2">
              <p className="font-display tracking-widest uppercase text-white/40 text-xs">Info</p>
              <a href="mailto:hello@split.sa" className="block hover:text-split-yellow transition">hello@split.sa</a>
              <p className="text-white/50">split.sa</p>
              <p className="text-white/50">Saudi Arabia</p>
            </div>
          </div>
        </div>
        <p className="mt-12 text-center text-xs text-white/30 uppercase tracking-widest">
          © 2026 split. — All rights reserved
        </p>
      </div>
    </footer>
  )
}
