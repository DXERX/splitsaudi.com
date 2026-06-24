import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split('=').map((s) => s.trim()))
    .filter(([k]) => k)
)

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, key)

const checks = [
  { name: 'drops', query: supabase.from('drops').select('slug').limit(1) },
  { name: 'products', query: supabase.from('products').select('slug').limit(3) },
  { name: 'product_variants_public', query: supabase.from('product_variants_public').select('size').limit(1) },
]

for (const { name, query } of checks) {
  const { data, error } = await query
  if (error) {
    console.log(`FAIL ${name}: ${error.message}`)
  } else {
    console.log(`OK ${name}: ${Array.isArray(data) ? data.length : 0} row(s)`)
    if (data?.length) console.log('  sample:', JSON.stringify(data[0]))
  }
}

const { error: rpcErr } = await supabase.rpc('subscribe_newsletter', {
  p_email: 'test-connection@split.sa',
  p_source: 'healthcheck',
})
console.log(rpcErr ? `FAIL subscribe_newsletter: ${rpcErr.message}` : 'OK subscribe_newsletter')
