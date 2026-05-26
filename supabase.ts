import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export type Property = {
  id: number
  created_at: string
  user_id: number
  name: string
  phone: string
  province: string
  city: string
  village: string
  property_type: string
  description: string
  capacity: string
  rooms: string
  area: string
  price_from: string
  price_to: string
  amenities: string
  media: string
  status: 'pending' | 'approved' | 'rejected'
}

export function formatPrice(val: string | number | null | undefined): string {
  if (!val) return '-'
  try {
    const n = Number(String(val).replace(/,/g, ''))
    if (n >= 1_000_000) {
      const m = Math.floor(n / 1_000_000)
      const r = Math.floor((n % 1_000_000) / 100_000)
      return r ? `${m}.${r} میلیون تومان` : `${m} میلیون تومان`
    }
    return n.toLocaleString('fa-IR') + ' تومان'
  } catch {
    return String(val)
  }
}
