import { useState } from 'react'
import { subscribeNewsletter, isSupabaseConfigured } from '../lib/supabase'

interface Props {
  variant?: 'inline' | 'card'
  source?: string
  className?: string
}

export default function NotifySignup({ variant = 'card', source = 'website', className = '' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      await subscribeNewsletter(email.trim(), source)
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  const isCard = variant === 'card'

  return (
    <div
      className={`${isCard ? 'rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 md:p-8' : ''} ${className}`}
    >
      <p className="font-display text-xs tracking-[0.35em] uppercase text-split-yellow">Drop alerts</p>
      <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide mt-2">
        Get notified first
      </h3>
      <p className="mt-2 text-sm text-white/50 max-w-md">
        Enter your email for Split drop updates, restocks, and launch access. No spam.
      </p>

      {status === 'done' ? (
        <p className="mt-5 text-split-yellow text-sm font-medium">You&apos;re on the list. See you at the drop.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            placeholder="you@email.com"
            className="flex-1 rounded-full border border-white/15 bg-black/40 px-5 py-3 text-sm placeholder:text-white/30 focus:border-split-yellow focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-full bg-split-yellow text-split-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition disabled:opacity-50 shrink-0"
          >
            {status === 'loading' ? '...' : 'Notify me'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-2 text-xs text-split-red">Something went wrong. Try again.</p>
      )}

      {!isSupabaseConfigured && status !== 'done' && (
        <p className="mt-3 text-[10px] uppercase tracking-wider text-white/25">
          Demo mode — saved locally until Supabase is connected
        </p>
      )}
    </div>
  )
}
