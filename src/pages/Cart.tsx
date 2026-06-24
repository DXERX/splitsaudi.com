import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, CheckCircle2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { createOrder, isSupabaseConfigured } from '../lib/supabase'
import { generateOrderNumber, saveDemoOrder } from '../lib/demo-store'

type Step = 'cart' | 'checkout' | 'success'

export default function Cart() {
  const { items, total, updateQty, removeItem, clear } = useCart()
  const [step, setStep] = useState<Step>('cart')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', city: '', address: '' })

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) return
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        ...form,
        total_sar: total,
        items: items.map((i) => ({
          variant_id: i.variantId,
          product_name: i.productName,
          color_name: i.colorName,
          size: i.size,
          quantity: i.quantity,
          unit_price_sar: i.price,
        })),
      }

      if (isSupabaseConfigured) {
        const result = await createOrder(payload)
        setOrderNumber(result.order_number)
      } else {
        const num = generateOrderNumber()
        saveDemoOrder({
          order_number: num,
          email: form.email,
          phone: form.phone || null,
          full_name: form.full_name,
          city: form.city || null,
          address: form.address || null,
          total_sar: total,
          status: 'pending',
          items: items.map((i) => ({
            id: crypto.randomUUID(),
            product_name: i.productName,
            color_name: i.colorName,
            size: i.size,
            quantity: i.quantity,
            unit_price_sar: i.price,
          })),
        })
        setOrderNumber(num)
      }
      clear()
      setStep('success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Order failed'
      if (msg.includes('no longer available')) {
        setError('One or more items sold out in that size. Update your cart and try again.')
      } else {
        setError('Could not place order. Check your connection and try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="text-split-yellow mb-6" size={48} />
        <p className="font-display text-4xl uppercase tracking-wide">Order placed</p>
        {orderNumber && (
          <p className="mt-4 font-mono text-split-yellow tracking-wider">{orderNumber}</p>
        )}
        <p className="mt-4 text-white/50 max-w-sm">
          Thank you, {form.full_name}. We&apos;ll contact you at {form.email} to confirm payment and
          delivery across Saudi Arabia.
        </p>
        <Link
          to="/shop"
          className="mt-8 rounded-full bg-split-yellow text-split-black px-8 py-3 font-bold uppercase tracking-wider"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-5xl uppercase tracking-wide">Cart</h1>
          {items.length > 0 && (
            <div className="flex gap-2 text-[10px] uppercase tracking-widest">
              <span className={step === 'cart' ? 'text-split-yellow' : 'text-white/30'}>1 · Cart</span>
              <span className="text-white/20">/</span>
              <span className={step === 'checkout' ? 'text-split-yellow' : 'text-white/30'}>2 · Checkout</span>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-white/50">Your cart is empty</p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-wider hover:bg-white/10 transition"
            >
              Shop Drop 02
            </Link>
          </div>
        ) : step === 'cart' ? (
          <div className="mt-10 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-4 rounded-xl border border-white/10 p-4 bg-white/[0.03]"
              >
                <div className="h-20 w-16 rounded-lg shrink-0" style={{ backgroundColor: item.heroColor }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.productName}</h3>
                  <p className="text-xs text-white/50 uppercase tracking-wider">
                    {item.colorName} · Size {item.size}
                  </p>
                  <p className="mt-1 font-medium">{item.price} SAR</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQty(item.variantId, item.quantity - 1)}
                      className="h-8 w-8 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.variantId, item.quantity + 1)}
                      className="h-8 w-8 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="text-white/30 hover:text-split-red transition self-start"
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <div className="rounded-xl border border-white/10 p-5 bg-white/[0.03] flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold">{total.toFixed(0)} SAR</span>
            </div>

            <button
              type="button"
              onClick={() => setStep('checkout')}
              className="w-full rounded-full bg-split-yellow text-split-black py-4 font-bold uppercase tracking-wider hover:bg-white transition"
            >
              Continue to Checkout
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="mt-10 grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3 space-y-3 text-sm">
              <p className="font-display uppercase tracking-wider text-white/50 mb-4">Order summary</p>
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between border-b border-white/10 pb-3">
                  <span>
                    {item.productName} — {item.colorName}, {item.size} × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(0)} SAR</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-semibold text-base">
                <span>Total</span>
                <span>{total.toFixed(0)} SAR</span>
              </div>
              {!isSupabaseConfigured && (
                <p className="text-xs text-split-yellow/80 pt-2">
                  Demo mode — orders saved locally. Connect Supabase for live inventory.
                </p>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              <p className="font-display uppercase tracking-wider text-white/50">Delivery details</p>
              {(['full_name', 'email', 'phone', 'city', 'address'] as const).map((field) => (
                <input
                  key={field}
                  required={field === 'full_name' || field === 'email'}
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={field.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/30 focus:border-split-yellow focus:outline-none"
                />
              ))}

              {error && <p className="text-sm text-split-red">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="flex-1 rounded-full border border-white/20 py-3 text-sm uppercase tracking-wider hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] rounded-full bg-split-yellow text-split-black py-3 font-bold uppercase tracking-wider hover:bg-white transition disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
