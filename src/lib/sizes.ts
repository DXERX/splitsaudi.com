/** Drop 02 size run — stock tracked server-side only (30 per variant). */
export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL'] as const
export type ProductSize = (typeof PRODUCT_SIZES)[number]
