export interface Drop {
  id: string
  slug: string
  name: string
  season: string
  concept: string | null
  launch_date: string | null
  is_active: boolean
}

export interface Product {
  id: string
  drop_id: string
  slug: string
  name: string
  category: string
  description: string | null
  fit_type: string | null
  fabric: string | null
  wash_treatment: string | null
  special_details: string[] | null
  price_sar: number
  hero_color: string
  accent_color: string | null
  sort_order: number
  is_featured: boolean
  status: string
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  color_name: string
  color_hex: string | null
  size: string
  sku: string
  in_stock: boolean
  image_url: string | null
}

export interface Order {
  id: string
  order_number: string
  email: string
  phone: string | null
  full_name: string
  city: string | null
  address: string | null
  total_sar: number
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled'
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  product_name: string
  color_name: string
  size: string
  quantity: number
  unit_price_sar: number
}

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  colorName: string
  size: string
  price: number
  quantity: number
  heroColor: string
}

export interface OrderPayload {
  email: string
  phone?: string
  full_name: string
  city?: string
  address?: string
  items: CartItem[]
}
