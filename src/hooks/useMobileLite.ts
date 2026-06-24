import { useEffect, useState } from 'react'

function detectLite() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(max-width: 767px)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Lighter UI on phones — fewer animations, simpler backgrounds. */
export function useMobileLite() {
  const [lite, setLite] = useState(detectLite)

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 767px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setLite(detectLite())
    narrow.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      narrow.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])

  return lite
}
