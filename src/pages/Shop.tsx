import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'

export default function Shop() {
  const { data: products = [], isLoading } = useProducts()
  const sorted = [...products].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="min-h-screen pt-28 pb-24 md:pb-12 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <p className="font-display text-xs tracking-[0.35em] uppercase text-split-yellow">Drop 02 · Winter</p>
          <h1 className="font-display text-5xl md:text-8xl uppercase tracking-tight mt-2">Shop All</h1>
          <p className="mt-4 text-white/50">6 pieces · split.sa</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {sorted.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Price table */}
        <div className="mt-16 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left">
                <th className="p-4 font-display uppercase tracking-wider">Piece</th>
                <th className="p-4 font-display uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="p-4 font-display uppercase tracking-wider text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-white/50 hidden md:table-cell">{p.category}</td>
                  <td className="p-4 text-right text-split-yellow font-semibold">{p.price_sar} SAR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
