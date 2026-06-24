import { getProductImage, getProductBackground } from '../lib/brand-assets'
import type { Product } from '../lib/types'

interface Props {
  product: Product
  className?: string
  animate?: boolean
  priority?: boolean
}

export default function ProductImage({ product, className = '', animate = false, priority = false }: Props) {
  const src = getProductImage(product.slug)
  if (!src) return null

  const bg = getProductBackground(product.slug)
  const needsGlow = bg === 'green-camo' || bg === 'black' || product.slug === 'sia-waffle'

  return (
    <div
      className={`relative flex items-center justify-center ${animate ? 'animate-float-gentle' : ''} ${className}`}
    >
      {needsGlow && (
        <div
          className="absolute inset-[8%] rounded-full bg-white/15 blur-2xl pointer-events-none"
          aria-hidden
        />
      )}
      <img
        src={src}
        alt={product.name}
        className="relative z-[1] w-full h-auto max-h-full object-contain object-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  )
}
