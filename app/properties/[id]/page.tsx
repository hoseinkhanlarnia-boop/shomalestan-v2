import { supabase, formatPrice, Property } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'
import { MapPin, Users, Bed, Maximize2, Phone, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const { data: prop } = await supabase
    .from('properties').select('*').eq('id', params.id).eq('status', 'approved').single()
  if (!prop) notFound()

  let mediaList: string[][] = []
  try { mediaList = JSON.parse(prop.media || '[]') } catch {}
  const photos = mediaList.filter(m => m[0] === 'photo')
  const amenities = prop.amenities ? prop.amenities.split(' | ').filter(Boolean) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-forest-600">خانه</Link>
          <ChevronRight size={14}/>
          <Link href="/properties" className="hover:text-forest-600">اقامتگاه‌ها</Link>
          <ChevronRight size={14}/>
          <span className="text-gray-800">{prop.village}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Photos */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
                {photos.slice(0,4).map((m,i) => (
                  <div key={i} className={`${i===0 && photos.length>1 ? 'col-span-2' : ''} ${i===0 ? 'h-64' : 'h-40'} bg-gray-200 overflow-hidden`}>
                    <img
                      src={`https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${m[1]}`}
                      alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 bg-gradient-to-br from-forest-100 to-forest-200 rounded-2xl flex items-center justify-center text-8xl">🏡</div>
            )}

            {/* Title */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <span className="badge-green mb-3">{prop.property_type}</span>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{prop.village}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <MapPin size={14} className="text-forest-500"/>
                {prop.province} — {prop.city}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Users size={20}/>, label:'ظرفیت', value:`${prop.capacity} نفر` },
                { icon: <Bed size={20}/>, label:'خواب', value:`${prop.rooms} اتاق` },
                { icon: <Maximize2 size={20}/>, label:'متراژ', value:`${prop.area} متر` },
              ].map((s,i) => (
                <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                  <div className="text-forest-500 flex justify-center mb-2">{s.icon}</div>
                  <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                  <div className="font-bold text-gray-800 text-sm">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">📝 توضیحات</h2>
              <p className="text-gray-600 leading-8 text-sm">{prop.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">✨ امکانات</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a,i) => (
                    <span key={i} className="bg-forest-50 text-forest-700 text-xs px-3 py-2 rounded-xl font-medium border border-forest-100">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center mb-5">
                <div className="text-xs text-gray-400 mb-1">قیمت هر شب</div>
                <div className="text-2xl font-extrabold text-forest-700">{formatPrice(prop.price_from)}</div>
                {prop.price_to && prop.price_to !== prop.price_from && (
                  <div className="text-sm text-gray-400 mt-1">تا {formatPrice(prop.price_to)}</div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="text-sm font-medium text-gray-700 mb-1">مالک: {prop.name}</div>
                <a
                  href={`tel:${prop.phone}`}
                  className="btn-primary w-full text-center mt-3 flex items-center justify-center gap-2"
                >
                  <Phone size={16}/>
                  {prop.phone}
                </a>
                <a
                  href={`https://wa.me/${prop.phone?.replace(/[^0-9]/g,'')}`}
                  target="_blank"
                  className="btn-outline w-full text-center mt-2 flex items-center justify-center gap-2 text-sm"
                >
                  واتساپ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
