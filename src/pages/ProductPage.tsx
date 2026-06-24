import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import PriceTag from '../components/PriceTag'
import PageBackground, { PageBackgroundOverlay } from '../components/PageBackground'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { uniqueColors, variantsForColor, findVariant } from '../lib/variant-utils'
import { PRODUCT_SIZES } from '../lib/sizes'
import { getProductBackground } from '../lib/brand-assets'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const { data: product, isLoading } = useProduct(slug)
  const { addItem } = useCart()
  const [colorName, setColorName] = useState('')
  const [size, setSize] = useState('')
  const [added, setAdded] = useState(false)

  const colors = product ? uniqueColors(product.variants ?? []) : []
  const sizesForColor = product && colorName ? variantsForColor(product.variants ?? [], colorName) : []
  const variant = product && colorName && size ? findVariant(product.variants ?? [], colorName, size) : null

  useEffect(() => {
    if (product?.variants?.length && !colorName) {
      setColorName(uniqueColors(product.variants)[0]?.color_name ?? '')
    }
  }, [product, colorName])

  useEffect(() => {
    if (!sizesForColor.length) return
    const current = sizesForColor.find((v) => v.size === size)
    if (!current) {
      const pick = sizesForColor.find((v) => v.in_stock) ?? sizesForColor[0]
      setSize(pick.size)
    }
  }, [colorName, sizesForColor, size])

  const bg = product ? getProductBackground(product.slug) : 'black'
  const isLight = bg === 'yellow-camo'

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-split-yellow border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-white/50">Product not found</p>
        <Link to="/shop" className="text-split-yellow underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const handleAdd = () => {
    if (!variant || !variant.in_stock) return
    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      colorName: variant.color_name,
      size: variant.size,
      price: product.price_sar,
      heroColor: product.hero_color,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <section className="relative min-h-[75vh] flex flex-col md:flex-row overflow-hidden">
        <PageBackground slug={product.slug} />
        <PageBackgroundOverlay slug={product.slug} />

        <div className="relative flex-1 flex items-center justify-center pt-28 pb-8 px-4 min-h-[50vh]">
          <ProductImage product={product} className="h-[55vh] w-full max-w-xl mx-auto" />
        </div>

        <div
          className={`relative flex-1 flex flex-col justify-center p-6 md:p-12 ${isLight ? 'text-split-black' : 'text-white'}`}
        >
          <p className="font-display text-xs tracking-[0.35em] uppercase opacity-60">{product.category}</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight mt-2 leading-none">
            {product.name}
          </h1>
          <PriceTag amount={product.price_sar} dark={!isLight} className="mt-5 w-fit" />
          <p className="mt-5 text-sm opacity-70 max-w-sm leading-relaxed">{product.description}</p>
        </div>
      </section>

      <section className="relative px-4 md:px-8 py-12 bg-split-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,253,125,0.06)_0%,transparent_50%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl uppercase tracking-wide mb-6">Details</h2>
            <dl className="space-y-4 text-sm">
              {product.fabric && (
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <dt className="text-white/50">Fabric</dt>
                  <dd>{product.fabric}</dd>
                </div>
              )}
              {product.wash_treatment && (
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <dt className="text-white/50">Wash</dt>
                  <dd>{product.wash_treatment}</dd>
                </div>
              )}
              {product.fit_type && (
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <dt className="text-white/50">Fit</dt>
                  <dd>{product.fit_type}</dd>
                </div>
              )}
              {product.special_details?.map((d: string) => (
                <div key={d} className="flex items-center gap-2 text-white/70">
                  <span className="h-1 w-1 rounded-full bg-split-yellow" />
                  {d}
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-2xl uppercase tracking-wide mb-6">Select</h2>

            {colors.length > 1 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-white/50 mb-3">Color</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.color_name}
                      type="button"
                      onClick={() => setColorName(c.color_name)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                        colorName === c.color_name
                          ? 'border-split-yellow bg-split-yellow/10'
                          : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-white/20"
                        style={{ backgroundColor: c.color_hex ?? '#888' }}
                      />
                      {c.color_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_SIZES.map((s) => {
                  const v = sizesForColor.find((x) => x.size === s)
                  const available = v?.in_stock ?? false
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={!v}
                      onClick={() => available && setSize(s)}
                      className={`min-w-[3rem] rounded-lg border px-4 py-2.5 text-sm font-medium uppercase transition ${
                        size === s
                          ? 'border-split-yellow bg-split-yellow text-split-black'
                          : available
                            ? 'border-white/15 hover:border-white/40'
                            : 'border-white/10 text-white/25 line-through cursor-not-allowed'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!variant?.in_stock}
              className="w-full rounded-full bg-split-yellow text-split-black py-4 font-bold uppercase tracking-wider hover:bg-white transition disabled:opacity-40"
            >
              {!variant?.in_stock
                ? 'Sold out'
                : added
                  ? 'Added ✓'
                  : `Add to Cart — ${product.price_sar} SAR`}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
