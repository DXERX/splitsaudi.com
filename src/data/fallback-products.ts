import type { Drop, Product, ProductVariant } from '../lib/types'
import { PRODUCT_SIZES } from '../lib/sizes'

const DROP_ID = '00000000-0000-4000-8000-000000000001'

function variantsForColors(
  productId: string,
  colors: { color: string; hex: string; skuBase: string }[]
): ProductVariant[] {
  return colors.flatMap(({ color, hex, skuBase }) =>
    PRODUCT_SIZES.map((size) => ({
      id: `${skuBase}-${size}-id`,
      product_id: productId,
      color_name: color,
      color_hex: hex,
      size,
      sku: `${skuBase}-${size}`,
      in_stock: true,
      image_url: null,
    }))
  )
}

export const FALLBACK_DROP: Drop = {
  id: DROP_ID,
  slug: 'drop-02',
  name: 'Split Is Art.',
  season: 'Winter',
  concept:
    "It's about control. Knowing when to shift, when to stay, and how to balance both sides.",
  launch_date: '2026-10-27',
  is_active: true,
}

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    drop_id: DROP_ID,
    slug: 'split-loop',
    name: 'Split Loop',
    category: 'Hoodie',
    description:
      'French terry boxy hoodie. Double layered one-piece hood with screen print and silicone patch.',
    fit_type: 'Boxy',
    fabric: '300gsm French Terry',
    wash_treatment: '10% stone wash',
    special_details: ['Double layered hood', 'Screen print', 'Silicone patch'],
    price_sar: 219,
    hero_color: '#E31B23',
    accent_color: '#F5E642',
    sort_order: 1,
    is_featured: true,
    status: 'production',
    variants: variantsForColors('p1', [{ color: 'Red', hex: '#E31B23', skuBase: 'SPL-LOOP-RED' }]),
  },
  {
    id: 'p2',
    drop_id: DROP_ID,
    slug: 'sia-double',
    name: 'SIA Double',
    category: 'Zip Up Hoodie',
    description:
      'Reversible zip hoodie. 600gsm total. Distressed embroidery, DTG camo print, silicone patch.',
    fit_type: 'Boxy',
    fabric: '300gsm French Terry (reversible)',
    wash_treatment: '30% stone wash',
    special_details: ['Reversible', 'Distressed embroidery', 'DTG camo print', 'Silicone patch'],
    price_sar: 299,
    hero_color: '#0A0A0A',
    accent_color: '#3D4F2F',
    sort_order: 2,
    is_featured: true,
    status: 'production',
    variants: variantsForColors('p2', [
      { color: 'Black', hex: '#0A0A0A', skuBase: 'SIA-DBL-BLK' },
      { color: 'Green Camo', hex: '#3D4F2F', skuBase: 'SIA-DBL-CAM' },
    ]),
  },
  {
    id: 'p3',
    drop_id: DROP_ID,
    slug: 'sia-pants',
    name: 'SIA Pants',
    category: 'Sweat Pants',
    description: 'Wide leg sweat pants with DTG camo pockets and long drawstrings.',
    fit_type: 'Wide Leg',
    fabric: '300gsm French Terry',
    wash_treatment: '30% stone wash',
    special_details: ['DTG camo pockets', 'Long drawstrings', 'Distressed embroidery'],
    price_sar: 219,
    hero_color: '#0A0A0A',
    accent_color: '#3D4F2F',
    sort_order: 3,
    is_featured: false,
    status: 'production',
    variants: variantsForColors('p3', [{ color: 'Black', hex: '#0A0A0A', skuBase: 'SIA-PNT-BLK' }]),
  },
  {
    id: 'p4',
    drop_id: DROP_ID,
    slug: 'sia-waffle',
    name: 'SIA Waffle',
    category: 'Long Sleeve T-Shirt',
    description: 'Open waffle knit with DTG sleeve print, screen print, and appliqué patch.',
    fit_type: 'Drop Shoulders',
    fabric: '220gsm Open Waffle Knit',
    wash_treatment: 'Enzyme wash',
    special_details: ['DTG sleeve print', 'Screen print', 'Appliqué patch'],
    price_sar: 179,
    hero_color: '#0A0A0A',
    accent_color: '#3D4F2F',
    sort_order: 4,
    is_featured: false,
    status: 'production',
    variants: variantsForColors('p4', [
      { color: 'Black', hex: '#0A0A0A', skuBase: 'SIA-WAF-BLK' },
      { color: 'Green Camo', hex: '#3D4F2F', skuBase: 'SIA-WAF-CAM' },
    ]),
  },
  {
    id: 'p5',
    drop_id: DROP_ID,
    slug: '76-waffle',
    name: '76 Waffle',
    category: 'Long Sleeve T-Shirt',
    description: 'Open waffle knit long sleeve. White and yellow camo colorway.',
    fit_type: 'Drop Shoulders',
    fabric: '220gsm Open Waffle Knit',
    wash_treatment: 'Enzyme wash',
    special_details: ['DTG sleeve print', 'Screen print', 'Appliqué patch'],
    price_sar: 179,
    hero_color: '#F5E642',
    accent_color: '#FFFFFF',
    sort_order: 5,
    is_featured: true,
    status: 'production',
    variants: variantsForColors('p5', [
      { color: 'White', hex: '#FFFFFF', skuBase: '76-WAF-WHT' },
      { color: 'Yellow Camo', hex: '#F5E642', skuBase: '76-WAF-YCM' },
    ]),
  },
  {
    id: 'p6',
    drop_id: DROP_ID,
    slug: 'patch-shorts',
    name: 'Patch Shorts',
    category: 'Shorts',
    description: 'Baggy French terry shorts with silicone patch.',
    fit_type: 'Baggy',
    fabric: '300gsm French Terry',
    wash_treatment: '10% stone wash',
    special_details: ['Silicone patch'],
    price_sar: 169,
    hero_color: '#B8B8B8',
    accent_color: '#0A0A0A',
    sort_order: 6,
    is_featured: false,
    status: 'production',
    variants: variantsForColors('p6', [
      { color: 'Light Grey Marl', hex: '#B8B8B8', skuBase: 'PCH-SHT-GRY' },
    ]),
  },
]

export function getFallbackProduct(slug: string) {
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null
}
