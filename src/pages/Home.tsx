import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import SplitLogo, { SplitTagline } from '../components/SplitLogo'
import ProductShowcase from '../components/ProductShowcase'
import ProductMarquee from '../components/ProductMarquee'
import ProductCard from '../components/ProductCard'
import NotifySignup from '../components/NotifySignup'
import { useDrop, useProducts } from '../hooks/useProducts'

export default function Home() {
  const { data: drop } = useDrop()
  const { data: products = [], isLoading } = useProducts()
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -48])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

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
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 pt-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,253,125,0.16)_0%,transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_15%,rgba(227,27,35,0.2)_0%,transparent_42%)]" />
        <div className="absolute top-1/4 -left-32 w-72 h-72 md:w-96 md:h-96 rounded-full bg-split-red/20 blur-3xl md:blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-72 h-72 md:w-96 md:h-96 rounded-full bg-split-yellow/12 blur-3xl md:blur-[120px]" />

        <motion.div style={{ scale: logoScale, y: logoY, opacity: heroOpacity }} className="relative z-10 text-center">
          <SplitLogo size="hero" className="mx-auto" />
          <SplitTagline className="mt-6" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 font-display text-xl md:text-3xl tracking-[0.35em] uppercase text-white/80"
          >
            2nd Drop
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-sm text-white/40 uppercase tracking-[0.3em]"
          >
            Saudi · Always
          </motion.p>
          {drop?.launch_date && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-5 text-split-yellow font-medium tracking-wide"
            >
              {new Date(drop.launch_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </motion.p>
          )}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
            <Link
              to="/shop"
              className="mt-12 inline-flex rounded-full bg-split-yellow text-split-black px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white transition"
            >
              Shop Collection
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40 animate-scroll-hint">
          <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      <ProductMarquee products={sorted} />

      <section className="px-4 py-14 md:py-20 text-center border-b border-white/10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-xs tracking-[0.4em] uppercase text-split-yellow mb-4"
        >
          Concept
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[clamp(2rem,8vw,3.5rem)] uppercase tracking-wide max-w-3xl mx-auto leading-tight"
        >
          The Balance
        </motion.h2>
        <p className="mt-5 max-w-xl mx-auto text-white/50 leading-relaxed text-sm md:text-base">
          {drop?.concept ??
            "It's about control. Knowing when to shift, when to stay, and how to balance both sides."}
        </p>
      </section>

      {sorted.map((product, i) => (
        <ProductShowcase key={product.id} product={product} index={i} />
      ))}

      <section className="px-4 py-16 md:py-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="font-display text-xs tracking-[0.35em] uppercase text-split-yellow">Drop 02</p>
              <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide mt-1">Full Collection</h2>
            </div>
            <Link
              to="/shop"
              className="rounded-full border border-white/20 px-5 py-2 text-[10px] md:text-xs font-semibold uppercase tracking-wider hover:bg-split-yellow hover:text-split-black transition shrink-0"
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
