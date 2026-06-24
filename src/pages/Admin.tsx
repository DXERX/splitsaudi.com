import { useState, useEffect, useCallback } from 'react'
import { Package, RefreshCw, Lock } from 'lucide-react'
import type { Order } from '../lib/types'
import { adminListOrders, adminUpdateOrderStatus, isSupabaseConfigured } from '../lib/supabase'
import { getDemoOrders, updateDemoOrderStatus } from '../lib/demo-store'

const STATUS_OPTIONS: Order['status'][] = ['pending', 'confirmed', 'shipped', 'cancelled']

const STATUS_LABEL: Record<Order['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
}

export default function Admin() {
  const [secret, setSecret] = useState(() => sessionStorage.getItem('split-admin-key') ?? '')
  const [inputKey, setInputKey] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(false)

  const loadOrders = useCallback(async (key: string) => {
    setLoading(true)
    setError('')
    try {
      if (isSupabaseConfigured) {
        const data = await adminListOrders(key)
        setOrders(data)
      } else {
        setOrders(getDemoOrders())
      }
      setAuthed(true)
      sessionStorage.setItem('split-admin-key', key)
      setSecret(key)
    } catch {
      setError('Invalid admin key or connection error')
      setAuthed(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (secret) loadOrders(secret)
  }, [secret, loadOrders])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    loadOrders(inputKey)
  }

  const handleStatus = async (orderId: string, status: Order['status']) => {
    try {
      if (isSupabaseConfigured && secret) {
        await adminUpdateOrderStatus(secret, orderId, status)
        await loadOrders(secret)
      } else {
        updateDemoOrderStatus(orderId, status)
        setOrders(getDemoOrders())
      }
    } catch {
      alert('Failed to update status')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <Lock className="text-split-yellow mb-4" size={28} />
          <h1 className="font-display text-2xl uppercase tracking-wide">Admin</h1>
          <p className="mt-2 text-sm text-white/50">Order tracking — authorized access only</p>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Admin key"
            className="mt-6 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-split-yellow focus:outline-none"
          />
          {error && <p className="mt-2 text-xs text-split-red">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-split-yellow text-split-black py-3 font-bold uppercase tracking-wider text-sm"
          >
            {loading ? '...' : 'Enter'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl uppercase tracking-wide flex items-center gap-3">
              <Package size={32} className="text-split-yellow" />
              Orders
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {orders.length} orders · {isSupabaseConfigured ? 'Live' : 'Demo (local)'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => secret && loadOrders(secret)}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-wider hover:bg-white/10"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-white/40 text-center py-20">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-split-yellow">{order.order_number}</p>
                    <p className="mt-1 font-semibold">{order.full_name}</p>
                    <p className="text-sm text-white/50">{order.email}</p>
                    {order.phone && <p className="text-sm text-white/40">{order.phone}</p>}
                    {(order.city || order.address) && (
                      <p className="text-sm text-white/40 mt-1">
                        {[order.city, order.address].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{Number(order.total_sar).toFixed(0)} SAR</p>
                    <p className="text-xs text-white/40 mt-1">
                      {new Date(order.created_at).toLocaleString('en-GB')}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatus(order.id, e.target.value as Order['status'])}
                      className="mt-3 rounded-lg border border-white/15 bg-black/50 px-3 py-1.5 text-xs uppercase tracking-wider"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <ul className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-white/70">
                        <span>
                          {item.product_name} — {item.color_name}, {item.size} × {item.quantity}
                        </span>
                        <span>{(item.unit_price_sar * item.quantity).toFixed(0)} SAR</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
