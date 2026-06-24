import { Link } from 'react-router-dom'
import { Home, ShoppingBag, Grid3X3, Info } from 'lucide-react'
import { useCart } from '../hooks/useCart'

const links = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/shop', icon: Grid3X3, label: 'Shop' },
  { to: '/cart', icon: ShoppingBag, label: 'Cart' },
  { to: '/#about', icon: Info, label: 'About' },
]

export default function MobileNav() {
  const { count } = useCart()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-white/10 bg-split-black/95 backdrop-blur-xl">
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-0.5 px-4 py-2 text-[10px] uppercase tracking-wider text-white/50 hover:text-white transition relative"
          >
            <Icon size={20} />
            {label}
            {label === 'Cart' && count > 0 && (
              <span className="absolute top-1 right-2 h-4 min-w-4 rounded-full bg-split-red text-[9px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
