interface Props {
  amount: number
  dark?: boolean
  className?: string
}

export default function PriceTag({ amount, dark = false, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide ${
        dark
          ? 'bg-split-black/90 text-white backdrop-blur-sm'
          : 'bg-white/90 text-split-black backdrop-blur-sm'
      } ${className}`}
    >
      {amount.toFixed(0)} SAR
    </span>
  )
}
