import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'
import { getProductBackground, getProductImage } from '../lib/brand-assets'
import { useMobileLite } from '../hooks/useMobileLite'
import PriceTag from './PriceTag'

interface Props {
  products: Product[]
}

function MarqueeCard({ p }: { p: Product }) {
  const img = getProductImage(p.slug)
  const bg = getProductBackground(p.slug)
  return (
    <Link
      to={`/product/${p.slug}`}
      className="flex items-center gap-3 shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 hover:border-split-yellow/40 transition group"
    >
      {img && (
        <div
          className={`h-14 w-14 rounded-xl overflow-hidden flex items-center justify-center ${
            bg === 'yellow-camo' ? 'bg-split-yellow' : bg === 'red' ? 'bg-split-red' : 'bg-split-black'
          }`}
        >
          <img src={img} alt="" className="h-12 w-12 object-contain" draggable={false} loading="lazy" />
        </div>
      )}
      <div>
        <p className="font-display text-base uppercase tracking-wide group-hover:text-split-yellow transition">
          {p.name}
        </p>
        <PriceTag amount={p.price_sar} dark className="mt-0.5 text-xs" />
      </div>
    </Link>
  )
}

export default function ProductMarquee({ products }: Props) {
  const lite = useMobileLite()

  if (lite) {
    return (
      <section className="py-4 border-y border-white/10 bg-split-black overflow-x-auto overscroll-x-contain">
        <div className="flex gap-3 w-max px-4 pb-1">
          {products.map((p) => (
            <MarqueeCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    )
  }

  const items = [...products, ...products]

  return (
    <section className="py-6 border-y border-white/10 bg-split-black overflow-hidden">
      <div className="marquee-track flex gap-6 w-max px-4">
        {items.map((p, i) => (
          <MarqueeCard key={`${p.id}-${i}`} p={p} />
        ))}
      </div>
    </section>
  )
}
