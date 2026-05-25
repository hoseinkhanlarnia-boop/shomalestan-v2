import Link from 'next/link'
import { Property, formatPrice } from '@/lib/supabase'
import { MapPin, Users, Bed, Maximize2, Star } from 'lucide-react'

export default function PropertyCard({ prop }: { prop: Property }) {
  let firstPhoto: string | null = null
  try {
    const media = JSON.parse(prop.media || '[]')
    const photo = media.find((m: string[]) => m[0] === 'photo')
    if (photo) firstPhoto = photo[1]
  } catch {}

  const typeEmoji: Record<string, string> = {
    '🏕 کلبه': '🏕', '🏊 ویلا استخردار': '🏊', '🏔 کلبه سوئیسی': '🏔',
    '🏡 خانه روستایی': '🏡', '🛁 ویلا با جکوزی': '🛁', '🌿 ویلا ییلاقی': '🌿',
  }

  return (
    <Link href={`/properties/${prop.id}`} className="card group block">
      <div className="relative h-52 bg-gradient-to-br from-forest-100 to-forest-200 overflow-hidden">
        {firstPhoto ? (
          <img
            src={`https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${firstPhoto}`}
            alt={prop.village}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display='none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {typeEmoji[prop.property_type] || '🏡'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
        <span className="absolute top-3 right-3 bg-white/95 text-forest-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {prop.property_type}
        </span>
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-yellow-400/90 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
          <Star size={10} fill="currentColor"/>تایید شده
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{prop.village}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={13}/>
          <span>{prop.city}، {prop.province}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 bg-gray-50 rounded-xl p-2.5">
          <span className="flex items-center gap-1"><Users size={12}/>{prop.capacity} نفر</span>
          <span className="w-px h-3 bg-gray-200"/>
          <span className="flex items-center gap-1"><Bed size={12}/>{prop.rooms} خواب</span>
          <span className="w-px h-3 bg-gray-200"/>
          <span className="flex items-center gap-1"><Maximize2 size={12}/>{prop.area} متر</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">شروع قیمت از</div>
            <div className="text-forest-700 font-bold text-sm">{formatPrice(prop.price_from)}</div>
          </div>
          <span className="text-xs bg-forest-50 text-forest-700 px-3 py-1.5 rounded-lg font-medium">مشاهده</span>
        </div>
      </div>
    </Link>
  )
}
