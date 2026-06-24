import type { Product } from '../lib/types'

interface Props {
  product: Product
  className?: string
  layered?: boolean
}

function HoodieShape({ color, accent }: { color: string; accent?: string | null }) {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full drop-shadow-2xl" aria-hidden>
      <path
        d="M70 90 Q140 60 210 90 L240 130 L220 320 L60 320 L40 130 Z"
        fill={color}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <path d="M100 90 Q140 110 180 90 L170 140 L110 140 Z" fill="rgba(0,0,0,0.15)" />
      <rect x="125" y="160" width="30" height="80" rx="4" fill="rgba(0,0,0,0.12)" />
      {accent && (
        <circle cx="200" cy="200" r="18" fill={accent} opacity="0.9" />
      )}
      <text x="140" y="250" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="11" fontWeight="700" fontFamily="Inter">
        split.
      </text>
    </svg>
  )
}

function TeeShape({ color, pattern }: { color: string; pattern?: 'camo' | 'plain' }) {
  const fill = pattern === 'camo' ? 'url(#yellowCamo)' : color
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full drop-shadow-2xl" aria-hidden>
      <defs>
        <pattern id="yellowCamo" patternUnits="userSpaceOnUse" width="80" height="80">
          <rect width="80" height="80" fill="#F5E642" />
          <ellipse cx="20" cy="25" rx="18" ry="12" fill="rgba(255,255,255,0.85)" />
          <ellipse cx="55" cy="50" rx="15" ry="10" fill="rgba(255,255,255,0.7)" />
          <ellipse cx="35" cy="65" rx="12" ry="8" fill="rgba(200,180,50,0.5)" />
        </pattern>
        <pattern id="greenCamo" patternUnits="userSpaceOnUse" width="80" height="80">
          <rect width="80" height="80" fill="#2a3520" />
          <ellipse cx="25" cy="30" rx="16" ry="11" fill="#3D4F2F" />
          <ellipse cx="55" cy="55" rx="14" ry="9" fill="#4a5f38" />
        </pattern>
      </defs>
      <path
        d="M90 80 L60 120 L75 125 L70 300 L210 300 L205 125 L220 120 L190 80 L160 95 L140 75 L120 95 Z"
        fill={pattern === 'camo' && color === '#3D4F2F' ? 'url(#greenCamo)' : fill}
        stroke="rgba(255,255,255,0.06)"
      />
      <text x="140" y="200" textAnchor="middle" fill="rgba(0,0,0,0.2)" fontSize="10" fontWeight="700" fontFamily="Inter">
        split.
      </text>
    </svg>
  )
}

function PantsShape() {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full drop-shadow-2xl" aria-hidden>
      <path d="M80 60 L200 60 L210 320 L155 320 L140 180 L125 320 L70 320 Z" fill="#0A0A0A" stroke="rgba(255,255,255,0.06)" />
      <rect x="110" y="100" width="25" height="35" rx="3" fill="#3D4F2F" opacity="0.6" />
      <rect x="145" y="100" width="25" height="35" rx="3" fill="#3D4F2F" opacity="0.6" />
    </svg>
  )
}

function ShortsShape() {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full drop-shadow-2xl" aria-hidden>
      <path d="M75 80 L205 80 L215 220 L155 220 L140 160 L125 220 L65 220 Z" fill="#B8B8B8" stroke="rgba(0,0,0,0.08)" />
      <circle cx="200" cy="140" r="14" fill="#0A0A0A" opacity="0.8" />
    </svg>
  )
}

export default function ProductVisual({ product, className = '', layered = false }: Props) {
  const cat = product.category.toLowerCase()
  const isCamo = product.variants?.some((v) => v.color_name.toLowerCase().includes('camo'))

  let visual
  if (cat.includes('hoodie') && !cat.includes('zip')) {
    visual = <HoodieShape color={product.hero_color} accent={product.accent_color} />
  } else if (cat.includes('zip')) {
    visual = <HoodieShape color={product.hero_color} accent={product.accent_color ?? '#3D4F2F'} />
  } else if (cat.includes('pants')) {
    visual = <PantsShape />
  } else if (cat.includes('short')) {
    visual = <ShortsShape />
  } else {
    visual = (
      <TeeShape
        color={product.hero_color}
        pattern={isCamo || product.hero_color === '#F5E642' ? 'camo' : 'plain'}
      />
    )
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {layered && (
        <>
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30"
            style={{ background: product.accent_color ?? product.hero_color }}
          />
          <div className="absolute -right-8 -top-4 w-32 h-32 rounded-full border border-white/10 opacity-40" />
          <div className="absolute -left-6 bottom-8 w-24 h-24 rounded-full bg-white/5" />
        </>
      )}
      <div className="relative w-[70%] max-w-[280px] aspect-[4/5]">{visual}</div>
    </div>
  )
}
