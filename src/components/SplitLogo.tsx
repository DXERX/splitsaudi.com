import { BRAND } from '../lib/brand-assets'

interface Props {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  variant?: 'light' | 'dark'
}

const heights = {
  sm: 'h-10 md:h-12',
  md: 'h-14 md:h-20',
  lg: 'h-24 md:h-36',
  xl: 'h-32 md:h-48',
  hero: 'h-40 md:h-64 lg:h-80',
}

export default function SplitLogo({ className = '', size = 'md', variant = 'dark' }: Props) {
  const src = variant === 'dark' ? BRAND.logoWhite : BRAND.logoBlack
  return (
    <img
      src={src}
      alt="split."
      className={`${heights[size]} w-auto max-w-[90vw] object-contain ${className}`}
      draggable={false}
    />
  )
}

export function SplitTagline({ className = '' }: { className?: string }) {
  return (
    <p className={`font-display text-base md:text-xl tracking-[0.35em] uppercase text-white/60 ${className}`}>
      is art<span className="text-split-yellow">.</span>
    </p>
  )
}

export function SplitLogoMark({ className = '', size = 44 }: { className?: string; size?: number }) {
  return (
    <div
      className={`rounded-full border border-split-yellow/40 bg-split-yellow/10 flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={BRAND.logoWhite}
        alt=""
        className="h-[60%] w-auto object-contain"
        aria-hidden
        draggable={false}
      />
    </div>
  )
}
