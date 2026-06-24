import type { Order, OrderItem } from './types'

const DEMO_ORDERS_KEY = 'split-demo-orders'
const DEMO_NEWSLETTER_KEY = 'split-demo-newsletter'

export function saveDemoOrder(order: Omit<Order, 'id' | 'created_at'> & { items: OrderItem[] }): Order {
  const full: Order = {
    ...order,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  const existing = getDemoOrders()
  localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify([full, ...existing]))
  return full
}

export function getDemoOrders(): Order[] {
  try {
    const raw = localStorage.getItem(DEMO_ORDERS_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

export function updateDemoOrderStatus(id: string, status: Order['status']) {
  const orders = getDemoOrders().map((o) => (o.id === id ? { ...o, status } : o))
  localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders))
}

export function saveDemoNewsletter(email: string) {
  const key = DEMO_NEWSLETTER_KEY
  const list: string[] = JSON.parse(localStorage.getItem(key) ?? '[]')
  const normalized = email.toLowerCase().trim()
  if (!list.includes(normalized)) {
    list.push(normalized)
    localStorage.setItem(key, JSON.stringify(list))
  }
}

export function generateOrderNumber(): string {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `SPL-DEMO-${n}`
}
