import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Product } from '../lib/types'
import { getProductBackground, getProductImage } from '../lib/brand-assets'
import PageBackground, { PageBackgroundOverlay } from './PageBackground'
import PriceTag from './PriceTag'

interface Props {
  product: Product
  index: number
}

export default function ProductShowcase({ product, index }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const bg = getProductBackground(product.slug)
  const img = getProductImage(product.slug)
  const isLight = bg === 'yellow-camo'
  const textClass = isLight ? 'text-split-black' : 'text-white'
  const floatDelay = index * 0.12

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [48, -48])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    reduceMotion ? [1, 1, 1, 1] : [0.55, 1, 1, 0.55]
  )

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden [content-visibility:auto]"
    >
      <PageBackground type={bg} />
      <PageBackgroundOverlay type={bg} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-16 items-center">
        <Link
          to={`/product/${product.slug}`}
          className="relative flex items-center justify-center w-full min-h-[52svh] md:min-h-[50vh] order-1"
        >
          <motion.div style={{ y, opacity }} className="relative w-full max-w-md md:max-w-lg">
            <div
              className={reduceMotion ? 'relative' : 'relative animate-float-gentle'}
              style={reduceMotion ? undefined : { animationDelay: `${floatDelay}s` }}
            >
              {img && (
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-auto max-h-[min(58svh,520px)] object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.55)]"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-2 md:bottom-6"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <PriceTag amount={product.price_sar} dark={!isLight} />
              </motion.div>
            </div>
          </motion.div>

          {!reduceMotion && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.18]">
              <div className="w-[88%] h-[88%] rounded-full border border-dashed border-white/40 animate-orbit-slow" />
            </div>
          )}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className={`flex flex-col gap-3 md:gap-4 text-center md:text-left w-full order-2 ${
            index % 2 === 1 ? 'md:text-right md:items-end' : 'md:items-start'
          }`}
        >
          <span className={`font-display text-[10px] md:text-xs tracking-[0.4em] uppercase opacity-50 ${textClass}`}>
            0{index + 1} — Drop 02
          </span>
          <h2
            className={`font-display text-[clamp(2.75rem,11vw,5rem)] md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.92] ${textClass}`}
          >
            {product.name}
          </h2>
          <p className={`text-xs md:text-base uppercase tracking-[0.2em] opacity-60 ${textClass}`}>
            {product.category} · {product.fit_type}
          </p>
          <p className={`max-w-md mx-auto md:mx-0 text-sm leading-relaxed opacity-70 ${textClass}`}>
            {product.description}
          </p>
          <Link
            to={`/product/${product.slug}`}
            className={`mt-3 md:mt-4 inline-flex w-fit mx-auto md:mx-0 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition ${
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
