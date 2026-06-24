import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Drop, Order, Product, ProductVariant } from './types'
import { toPublicVariant } from './variant-utils'
import { saveDemoNewsletter } from './demo-store'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

function mapVariants(rows: (ProductVariant & { stock?: number })[]): ProductVariant[] {
  return rows.map(toPublicVariant)
}

export async function fetchActiveDrop(): Promise<Drop | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('drops')
    .select('*')
    .eq('is_active', true)
    .order('launch_date', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

async function fetchVariantsForProducts(productIds: string[]): Promise<ProductVariant[]> {
  if (!supabase || !productIds.length) return []
  const { data, error } = await supabase
    .from('product_variants_public')
    .select('*')
    .in('product_id', productIds)
  if (error) {
    const fallback = await supabase.from('product_variants').select('*').in('product_id', productIds)
    if (fallback.error) throw fallback.error
    return mapVariants((fallback.data ?? []) as (ProductVariant & { stock?: number })[])
  }
  return (data ?? []) as ProductVariant[]
}

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return []
  const { data: products, error } = await supabase.from('products').select('*').order('sort_order')
  if (error) throw error
  const ids = (products ?? []).map((p) => p.id)
  const variants = await fetchVariantsForProducts(ids)
  return (products ?? []).map((p) => ({
    ...p,
    variants: variants.filter((v) => v.product_id === p.id),
  }))
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return null
  const { data: product, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  if (!product) return null
  const variants = await fetchVariantsForProducts([product.id])
  return { ...product, variants }
}

export async function subscribeNewsletter(email: string, source = 'website') {
  if (!supabase) {
    saveDemoNewsletter(email)
    return
  }
  const { error } = await supabase.rpc('subscribe_newsletter', {
    p_email: email,
    p_source: source,
  })
  if (error) throw error
}

export async function createOrder(payload: {
  email: string
  phone?: string
  full_name: string
  city?: string
  address?: string
  total_sar: number
  items: {
    variant_id: string
    product_name: string
    color_name: string
    size: string
    quantity: number
    unit_price_sar: number
  }[]
}): Promise<{ id: string; order_number: string }> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('place_order', {
    p_email: payload.email,
    p_full_name: payload.full_name,
    p_phone: payload.phone ?? '',
    p_city: payload.city ?? '',
    p_address: payload.address ?? '',
    p_total_sar: payload.total_sar,
    p_items: payload.items,
  })
  if (error) throw error
  const result = data as { id: string; order_number: string }
  return result
}

export async function adminListOrders(secret: string): Promise<Order[]> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('admin_list_orders', { p_secret: secret })
  if (error) throw error
  return (data ?? []) as Order[]
}

export async function adminUpdateOrderStatus(secret: string, orderId: string, status: Order['status']) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.rpc('admin_update_order_status', {
    p_secret: secret,
    p_order_id: orderId,
    p_status: status,
  })
  if (error) throw error
}
