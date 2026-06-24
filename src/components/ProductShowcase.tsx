import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../lib/types'
import { getProductBackground, getProductImage } from '../lib/brand-assets'
import { useMobileLite } from '../hooks/useMobileLite'
import PageBackground, { PageBackgroundOverlay } from './PageBackground'
import PriceTag from './PriceTag'

interface Props {
  product: Product
  index: number
}

/** Full-screen editorial block — desktop only (skipped on mobile for performance). */
export default function ProductShowcase({ product, index }: Props) {
  const lite = useMobileLite()
  const bg = getProductBackground(product.slug)
  const img = getProductImage(product.slug)
  const isLight = bg === 'yellow-camo'
  const textClass = isLight ? 'text-split-black' : 'text-white'

  if (lite) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <PageBackground type={bg} />
      <PageBackgroundOverlay type={bg} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-28 md:py-32 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <Link
          to={`/product/${product.slug}`}
          className="relative flex items-center justify-center min-h-[50vh] order-1 md:order-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-lg"
          >
            {img && (
              <img
                src={img}
                alt={product.name}
                className="w-full h-auto max-h-[min(70vh,520px)] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 md:bottom-8">
              <PriceTag amount={product.price_sar} dark={!isLight} />
            </div>
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className={`flex flex-col gap-4 ${index % 2 === 1 ? 'md:text-right md:items-end' : ''}`}
        >
          <span className={`font-display text-xs tracking-[0.4em] uppercase opacity-50 ${textClass}`}>
            0{index + 1} — Drop 02
          </span>
          <h2
            className={`font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.9] ${textClass}`}
          >
            {product.name}
          </h2>
          <p className={`text-sm md:text-base uppercase tracking-[0.2em] opacity-60 ${textClass}`}>
            {product.category} · {product.fit_type}
          </p>
          <p className={`max-w-md text-sm leading-relaxed opacity-70 ${textClass}`}>{product.description}</p>
          <Link
            to={`/product/${product.slug}`}
            className={`mt-4 inline-flex w-fit rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition ${
              isLight
                ? 'bg-split-black text-white hover:bg-white hover:text-split-black'
                : 'bg-split-yellow text-split-black hover:bg-white'
            }`}
          >
            Shop — {product.price_sar} SAR
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
