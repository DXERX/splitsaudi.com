import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SplitLogo, { SplitTagline } from '../components/SplitLogo'
import ProductShowcase from '../components/ProductShowcase'
import ProductMarquee from '../components/ProductMarquee'
import ProductCard from '../components/ProductCard'
import NotifySignup from '../components/NotifySignup'
import { useDrop, useProducts } from '../hooks/useProducts'
import { useMobileLite } from '../hooks/useMobileLite'

export default function Home() {
  const { data: drop } = useDrop()
  const { data: products = [], isLoading } = useProducts()
  const lite = useMobileLite()
  const heroRef = useRef<HTMLElement>(null)

  const sorted = [...products].sort((a, b) => a.sort_order - b.sort_order)

  if (isLoading && !products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="h-10 w-10 rounded-full border-2 border-split-yellow border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0">
      <section
        ref={heroRef}
        className="relative min-h-[85vh] md:min-h-screen flex flex-col items-center justify-center px-4 pt-24 overflow-hidden"
      >
        {!lite && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,253,125,0.14)_0%,transparent_50%)]" />
            <div className="absolute top-1/3 -left-40 w-72 h-72 md:w-96 md:h-96 rounded-full bg-split-red/15 md:bg-split-red/20 blur-3xl md:blur-[140px]" />
            <div className="absolute bottom-1/4 -right-40 w-72 h-72 md:w-96 md:h-96 rounded-full bg-split-yellow/8 md:bg-split-yellow/12 blur-3xl md:blur-[140px]" />
          </>
        )}

        <div className="relative z-10 text-center">
          <SplitLogo size="hero" className="mx-auto" />
          <SplitTagline className="mt-6" />
          <p className="mt-8 font-display text-xl md:text-3xl tracking-[0.35em] uppercase text-white/80">
            2nd Drop
          </p>
          <p className="mt-3 text-sm text-white/40 uppercase tracking-[0.3em]">Saudi · Always</p>
          {drop?.launch_date && (
            <p className="mt-5 text-split-yellow font-medium tracking-wide">
              {new Date(drop.launch_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          <div className="mt-12">
            <Link
              to="/shop"
              className="inline-flex rounded-full bg-split-yellow text-split-black px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white transition"
            >
              Shop Collection
            </Link>
          </div>
        </div>

        {!lite && (
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute bottom-10 flex flex-col items-center gap-2 opacity-40"
          >
            <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        )}
      </section>

      <ProductMarquee products={sorted} />

      <section className="px-4 py-12 md:py-20 text-center border-b border-white/10">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-split-yellow mb-4">Concept</p>
        <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide max-w-3xl mx-auto leading-tight">
          The Balance
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-white/50 leading-relaxed text-sm md:text-base">
          {drop?.concept ??
            "It's about control. Knowing when to shift, when to stay, and how to balance both sides."}
        </p>
      </section>

      {!lite && sorted.map((product, i) => <ProductShowcase key={product.id} product={product} index={i} />)}

      <section className="px-4 py-16 md:py-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-display text-xs tracking-[0.35em] uppercase text-split-yellow">Drop 02</p>
              <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide mt-1">Full Collection</h2>
            </div>
            <Link
              to="/shop"
              className="rounded-full border border-white/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-split-yellow hover:text-split-black transition"
            >
              Shop All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {sorted.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20 border-b border-white/10">
        <div className="mx-auto max-w-3xl">
          <NotifySignup source="home" />
        </div>
      </section>

      <section id="about" className="border-t border-white/10 px-4 py-16 md:py-28 bg-white/[0.02]">
        <div className="mx-auto max-w-3xl text-center">
          <SplitLogo size="xl" className="mx-auto" />
          <SplitTagline className="mt-4" />
          <p className="mt-10 text-base md:text-lg text-white/60 leading-relaxed">
            Streetwear that&apos;s distressed, boxy, loose. Dark, clean, aggressive, soft. Green camo · Yellow camo ·
            Red · Black · Grey marl.
          </p>
        </div>
      </section>
    </div>
  )
}
