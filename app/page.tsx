import { supabase, Property } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'
import Link from 'next/link'
import { Search, MapPin, Home, ChevronLeft } from 'lucide-react'


const PROVINCES = ['مازندران', 'گیلان', 'گلستان']
const TYPES = ['🏕 کلبه', '🏊 ویلا استخردار', '🏔 کلبه سوئیسی', '🏡 خانه روستایی', '🛁 ویلا با جکوزی', '🌿 ویلا ییلاقی']

export default async function HomePage({ searchParams }: { searchParams: { q?: string; province?: string; type?: string } }) {
  let query = supabase.from('properties').select('*').eq('status', 'approved').order('created_at', { ascending: false })

  if (searchParams.q) {
    const q = searchParams.q
    query = query.or(`village.ilike.%${q}%,city.ilike.%${q}%,province.ilike.%${q}%,description.ilike.%${q}%,property_type.ilike.%${q}%,amenities.ilike.%${q}%`)
  }
  if (searchParams.province) query = query.eq('province', searchParams.province)
  if (searchParams.type) query = query.eq('property_type', searchParams.type)

  const { data: properties } = await query.limit(24)
  const hasFilter = searchParams.q || searchParams.province || searchParams.type

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero with video background */}
      <section className="relative h-[580px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://www.pexels.com/download/video/3571264/?fps=25.0&h=1080&w=1920" type="video/mp4"/>
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"/>

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
            بیش از ۱۰۰ اقامتگاه تأیید شده
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            🌿 شمالستان
          </h1>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            بهترین ویلاها و کلبه‌های شمال ایران<br/>بدون واسطه، با قیمت مستقیم مالک
          </p>

          {/* Search box */}
          <form method="GET" className="bg-white rounded-2xl p-2 flex gap-2 shadow-2xl max-w-xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-gray-400 shrink-0"/>
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="شهر، روستا، نوع اقامتگاه..."
                className="flex-1 text-gray-800 text-sm outline-none bg-transparent"
              />
            </div>
            <button type="submit" className="btn-primary text-sm rounded-xl px-5 py-2.5">جستجو</button>
          </form>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 text-xs animate-bounce">
          <div className="w-px h-8 bg-white/30 rounded"/>
          اسکرول کنید
        </div>
      </section>

      {/* Province filter */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-medium text-gray-400 shrink-0 flex items-center gap-1"><MapPin size={12}/>استان:</span>
          <Link href={`/${searchParams.q ? `?q=${searchParams.q}` : ''}${searchParams.type ? `&type=${searchParams.type}` : ''}`}
            className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-all ${!searchParams.province ? 'bg-forest-600 text-white border-forest-600' : 'border-gray-200 text-gray-600 hover:border-forest-400 hover:text-forest-600'}`}>
            همه
          </Link>
          {PROVINCES.map(p => (
            <Link key={p} href={`/?province=${encodeURIComponent(p)}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.type ? `&type=${encodeURIComponent(searchParams.type)}` : ''}`}
              className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-all ${searchParams.province === p ? 'bg-forest-600 text-white border-forest-600' : 'border-gray-200 text-gray-600 hover:border-forest-400 hover:text-forest-600'}`}>
              {p}
            </Link>
          ))}
          <span className="mx-2 w-px h-5 bg-gray-200 shrink-0"/>
          <span className="text-xs font-medium text-gray-400 shrink-0 flex items-center gap-1"><Home size={12}/>نوع:</span>
          {TYPES.map(t => (
            <Link key={t} href={`/?type=${encodeURIComponent(t)}${searchParams.province ? `&province=${encodeURIComponent(searchParams.province)}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
              className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-all whitespace-nowrap ${searchParams.type === t ? 'bg-forest-600 text-white border-forest-600' : 'border-gray-200 text-gray-600 hover:border-forest-400 hover:text-forest-600'}`}>
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {hasFilter ? 'نتایج جستجو' : 'اقامتگاه‌های برتر'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{properties?.length || 0} اقامتگاه یافت شد</p>
          </div>
          {hasFilter && (
            <Link href="/" className="text-sm text-forest-600 hover:text-forest-700 flex items-center gap-1">
              پاک کردن فیلتر<ChevronLeft size={14}/>
            </Link>
          )}
        </div>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((p: Property) => <PropertyCard key={p.id} prop={p}/>)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🏕</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">اقامتگاهی پیدا نشد</h3>
            <p className="text-gray-400 text-sm mb-6">فیلترها را تغییر دهید یا جستجوی جدیدی انجام دهید</p>
            <Link href="/" className="btn-outline text-sm">نمایش همه اقامتگاه‌ها</Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌿</span>
              <div>
                <div className="text-white font-bold text-lg">شمالستان</div>
                <div className="text-xs text-gray-500">مرجع اقامتگاه‌های شمال ایران</div>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="https://t.me/shomallestan" className="hover:text-white transition-colors">تلگرام</a>
              <a href="https://www.instagram.com/shomallestan/" className="hover:text-white transition-colors">اینستاگرام</a>
              <Link href="/register" className="hover:text-white transition-colors">ثبت اقامتگاه</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-600">
            © ۱۴۰۴ شمالستان — تمامی حقوق محفوظ است
          </div>
        </div>
      </footer>
    </div>
  )
}
