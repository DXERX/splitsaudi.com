import type { ProductVariant } from './types'
import { PRODUCT_SIZES } from './sizes'

export function uniqueColors(variants: ProductVariant[]): ProductVariant[] {
  const seen = new Set<string>()
  return variants.filter((v) => {
    if (seen.has(v.color_name)) return false
    seen.add(v.color_name)
    return true
  })
}

export function variantsForColor(variants: ProductVariant[], colorName: string): ProductVariant[] {
  return variants
    .filter((v) => v.color_name === colorName)
    .sort((a, b) => PRODUCT_SIZES.indexOf(a.size as (typeof PRODUCT_SIZES)[number]) - PRODUCT_SIZES.indexOf(b.size as (typeof PRODUCT_SIZES)[number]))
}

export function findVariant(
  variants: ProductVariant[],
  colorName: string,
  size: string
): ProductVariant | undefined {
  return variants.find((v) => v.color_name === colorName && v.size === size)
}

export function toPublicVariant(v: ProductVariant & { stock?: number }): ProductVariant {
  const inStock = v.in_stock ?? (v.stock ?? 0) > 0
  const { stock: _stock, ...rest } = v
  return { ...rest, in_stock: inStock }
}
