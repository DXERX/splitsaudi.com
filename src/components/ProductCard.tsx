import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../lib/types'
import { getProductBackground } from '../lib/brand-assets'
import ProductImage from './ProductImage'
import PriceTag from './PriceTag'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const bg = getProductBackground(product.slug)
  const isLight = bg === 'yellow-camo'

  const bgClass =
    bg === 'yellow-camo'
      ? 'bg-split-yellow'
      : bg === 'red'
        ? 'bg-gradient-to-br from-split-red to-[#5a0005]'
        : bg === 'green-camo'
          ? 'bg-[#3d4f2f]'
          : 'bg-split-black'

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ delay: index * 0.06, duration: 0.45 }}
        whileHover={{ y: -5 }}
        className={`relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 ${bgClass}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
        <ProductImage product={product} animate className="absolute inset-0 p-5 md:p-8" />
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 z-20">
          <PriceTag amount={product.price_sar} className="mb-2" />
          <h3
            className={`font-display text-xl md:text-3xl uppercase tracking-wide ${isLight ? 'text-split-black' : 'text-white'}`}
          >
            {product.name}
          </h3>
          <p
            className={`text-[10px] md:text-xs uppercase tracking-widest mt-1 ${isLight ? 'text-split-black/60' : 'text-white/50'}`}
          >
            {product.category}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}
