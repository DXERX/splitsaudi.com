# splitsaudi.com

Split Drop 02 — Saudi streetwear e-commerce (split.sa).

## Stack

- Vite + React + TypeScript + Tailwind
- Supabase (products, orders, newsletter)
- Vercel (hosting)

## Setup

```bash
npm install
cp .env.example .env
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Supabase

Run migrations in order in the SQL Editor:

1. `supabase/migrations/001_store_schema.sql`
2. `supabase/migrations/002_sizes_newsletter_admin.sql`

## Deploy

Connect this repo to Vercel. Set environment variables from `.env.example`.
