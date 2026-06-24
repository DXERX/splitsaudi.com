import { getProductBackground } from '../lib/brand-assets'

export type BackgroundType = ReturnType<typeof getProductBackground>

interface PageBackgroundProps {
  slug?: string
  type?: BackgroundType
  atmosphere?: boolean
}

/** CSS-only backgrounds — no heavy SVG assets (mobile + Git-safe). */
export default function PageBackground({ slug, type, atmosphere = true }: PageBackgroundProps) {
  const bg = type ?? (slug ? getProductBackground(slug) : 'black')
  const isLight = bg === 'yellow-camo'

  return (
    <>
      {bg === 'yellow-camo' && <div className="absolute inset-0 camo-yellow" />}
      {bg === 'green-camo' && <div className="absolute inset-0 camo-green" />}
      {bg === 'red' && (
        <div className="absolute inset-0 bg-gradient-to-br from-split-red via-[#B01018] via-40% to-split-black" />
      )}
      {bg === 'grey' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#3a3a3a] via-[#1a1a1a] to-split-black" />
      )}
      {bg === 'black' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-split-black to-[#050505]" />
      )}

      {bg === 'red' && atmosphere && (
        <div className="absolute top-0 right-0 w-[60%] h-[50%] bg-split-yellow/10 blur-3xl md:blur-[100px] pointer-events-none" />
      )}
      {(bg === 'green-camo' || bg === 'yellow-camo') && atmosphere && (
        <div
          className={`absolute bottom-0 left-0 w-1/2 h-1/3 blur-3xl pointer-events-none ${
            isLight ? 'bg-split-yellow/20' : 'bg-split-red/15'
          }`}
        />
      )}

      {atmosphere && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      )}
    </>
  )
}

export function PageBackgroundOverlay({ slug, type }: { slug?: string; type?: BackgroundType }) {
  const bg = type ?? (slug ? getProductBackground(slug) : 'black')
  const isLight = bg === 'yellow-camo'
  return (
    <div
      className={`absolute inset-0 ${isLight ? 'bg-black/10' : 'bg-black/30'}`}
    />
  )
}
