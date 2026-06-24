/** Brand assets — correctly named from Website split folder */

export const BRAND = {
  /** Script wordmark — white on dark UI */
  logoWhite: '/brand/logo-white.svg',
  /** Script wordmark — black on light UI */
  logoBlack: '/brand/logo-black.svg',
} as const

/** slug → product sticker SVG (correct file per piece) */
export const PRODUCT_IMAGES: Record<string, string> = {
  'split-loop': '/brand/products/split-loop.png',
  'sia-double': '/brand/products/sia-double.svg',
  'sia-pants': '/brand/products/sia-pants.svg',
  'sia-waffle': '/brand/products/sia-waffle.svg',
  '76-waffle': '/brand/products/76-waffle.svg',
  'patch-shorts': '/brand/products/patch-shorts.svg',
}

/** Background per product section */
export const PRODUCT_BACKGROUNDS: Record<string, 'red' | 'yellow-camo' | 'green-camo' | 'black' | 'grey'> = {
  'split-loop': 'red',
  'sia-double': 'green-camo',
  'sia-pants': 'black',
  'sia-waffle': 'green-camo',
  '76-waffle': 'yellow-camo',
  'patch-shorts': 'grey',
}

export function getProductImage(slug: string) {
  return PRODUCT_IMAGES[slug] ?? null
}

export function getProductBackground(slug: string) {
  return PRODUCT_BACKGROUNDS[slug] ?? 'black'
}

export const BRAND_YELLOW = '#fffd7d'
export const BRAND_YELLOW_MUTED = '#d6d45c'
export const BRAND_BLACK = '#010101'
export const BRAND_RED = '#E31B23'

/** Official Drop 02 catalog — names & prices from report */
export const CATALOG = [
  { slug: 'split-loop', name: 'Split Loop', category: 'Hoodie', price: 219 },
  { slug: 'sia-double', name: 'SIA Double', category: 'Zip Up Hoodie', price: 299 },
  { slug: 'sia-pants', name: 'SIA Pants', category: 'Sweat Pants', price: 219 },
  { slug: 'sia-waffle', name: 'SIA Waffle', category: 'Long Sleeve T-Shirt', price: 179 },
  { slug: '76-waffle', name: '76 Waffle', category: 'Long Sleeve T-Shirt', price: 179 },
  { slug: 'patch-shorts', name: 'Patch Shorts', category: 'Shorts', price: 169 },
] as const
