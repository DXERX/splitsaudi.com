import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem } from '../lib/types'

const STORAGE_KEY = 'split-cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (variantId: string) => void
  updateQty: (variantId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0)
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

    return {
      items,
      count,
      total,
      addItem(item, qty = 1) {
        setItems((prev) => {
          const existing = prev.find((p) => p.variantId === item.variantId)
          if (existing) {
            return prev.map((p) =>
              p.variantId === item.variantId ? { ...p, quantity: p.quantity + qty } : p
            )
          }
          return [...prev, { ...item, quantity: qty }]
        })
      },
      removeItem(variantId) {
        setItems((prev) => prev.filter((p) => p.variantId !== variantId))
      },
      updateQty(variantId, quantity) {
        if (quantity <= 0) {
          setItems((prev) => prev.filter((p) => p.variantId !== variantId))
          return
        }
        setItems((prev) => prev.map((p) => (p.variantId === variantId ? { ...p, quantity } : p)))
      },
      clear() {
        setItems([])
      },
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
