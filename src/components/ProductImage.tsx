import { getProductImage } from '../lib/brand-assets'
import type { Product } from '../lib/types'
import { motion } from 'framer-motion'
import { useMobileLite } from '../hooks/useMobileLite'

interface Props {
  product: Product
  className?: string
  animate?: boolean
}

export default function ProductImage({ product, className = '', animate = false }: Props) {
  const lite = useMobileLite()
  const src = getProductImage(product.slug)
  if (!src) return null

  const img = (
    <img
      src={src}
      alt={product.name}
      className="w-full h-full object-contain object-center drop-shadow-2xl"
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  )

  if (!animate || lite) {
    return <div className={`relative flex items-center justify-center ${className}`}>{img}</div>
  }

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {img}
    </motion.div>
  )
}
