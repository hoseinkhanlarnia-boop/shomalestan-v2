import { supabase, Property } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'
import Link from 'next/link'
import { Search, MapPin, Home, ChevronLeft } from 'lucide-react'

export const revalidate = 60

const PROVINCES = ['مازندران', 'گیلان', 'گلستان']
const TYPES = ['کلبه', 'ویلا استخردار', 'کلبه سوئیسی', 'خانه روستایی', 'ویلا با جکوزی', 'ویلا ییلاقی']

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; province?: string; type?: string }>
}) {
  const params = await searchParams
  let query = supabase.from('properties').select('*').eq('status', 'approved').order('created_at', { ascending: false })

  if (params.q) {
    query = query.or(`village.ilike.%${params.q}%,city.ilike.%${params.q}%,province.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }
  if (params.province) query = query.eq('province', params.province)
  if (params.type) query = query.eq('property_type', params.type)

  const { data: properties } = await query.limit(24)
  const hasFilter = params.q || params.province || params.type

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative h-[580px] flex items-center justify-center overflow-hidden">
       <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-green-900 via-green-800 to-black"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"/>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">🌿 شمالستان</h1>
          <p className="text-lg text-white/80 mb-8">بهترین ویلاها و کلبه‌های شمال ایران</p>
          <form method="GET" className="bg-white rounded-2xl p-2 flex gap-2 shadow-2xl max-w-xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-gray-400 shrink-0"/>
              <input name="q" defaultValue={params.q} placeholder="شهر، روستا، نوع اقامتگاه..."
                className="flex-1 text-gray-800 text-sm outline-none bg-transparent"/>
            </div>
            <button type="submit" className="bg-green-600 text-white text-sm rounded-xl px-5 py-2.5">جستجو</button>
          </form>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto">
          <Link href="/" className={`shrink-0 text-sm px-4 py-1.5 rounded-full border ${!params.province ? 'bg-green-600 text-white' : 'border-gray-200 text-gray-600'}`}>همه</Link>
          {PROVINCES.map(p => (
            <Link key={p} href={`/?province=${encodeURIComponent(p)}${params.q ? `&q=${params.q}` : ''}`}
              className={`shrink-0 text-sm px-4 py-1.5 rounded-full border ${params.province === p ? 'bg-green-600 text-white' : 'border-gray-200 text-gray-600'}`}>
              {p}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{hasFilter ? 'نتایج جستجو' : 'اقامتگاه‌های برتر'}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{properties?.length || 0} اقامتگاه یافت شد</p>
          </div>
          {hasFilter && <Link href="/" className="text-sm text-green-600">پاک کردن فیلتر</Link>}
        </div>
        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((p: Property) => <PropertyCard key={p.id} prop={p}/>)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🏕</div>
            <p className="text-gray-400 text-sm mb-6">اقامتگاهی پیدا نشد</p>
            <Link href="/" className="border border-gray-300 text-sm px-4 py-2 rounded-xl">نمایش همه</Link>
          </div>
        )}
      </section>
    </div>
  )
}
