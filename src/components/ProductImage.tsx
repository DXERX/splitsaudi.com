import { getProductImage } from '../lib/brand-assets'
import type { Product } from '../lib/types'

interface Props {
  product: Product
  className?: string
  animate?: boolean
}

export default function ProductImage({ product, className = '', animate = false }: Props) {
  const src = getProductImage(product.slug)
  if (!src) return null

  return (
    <div
      className={`relative flex items-center justify-center ${animate ? 'animate-float-gentle' : ''} ${className}`}
    >
      <img
        src={src}
        alt={product.name}
        className="w-full h-full object-contain object-center drop-shadow-2xl"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
