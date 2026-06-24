import { useQuery } from '@tanstack/react-query'
import { FALLBACK_DROP, FALLBACK_PRODUCTS, getFallbackProduct } from '../data/fallback-products'
import { fetchActiveDrop, fetchProductBySlug, fetchProducts, isSupabaseConfigured } from '../lib/supabase'

export function useDrop() {
  return useQuery({
    queryKey: ['drop'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return FALLBACK_DROP
      const drop = await fetchActiveDrop()
      return drop ?? FALLBACK_DROP
    },
  })
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return FALLBACK_PRODUCTS
      const products = await fetchProducts()
      return products.length ? products : FALLBACK_PRODUCTS
    },
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!isSupabaseConfigured) return getFallbackProduct(slug)
      const product = await fetchProductBySlug(slug)
      return product ?? getFallbackProduct(slug)
    },
    enabled: Boolean(slug),
  })
}
