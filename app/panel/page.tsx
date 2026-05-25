'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Property, formatPrice } from '@/lib/supabase'
import { Edit2, Trash2, Plus, Save, X, Home } from 'lucide-react'
import Link from 'next/link'

export default function PanelPage() {
  const [user, setUser] = useState<{name:string,phone:string,user_id:number}|null>(null)
  const [props, setProps] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number|null>(null)
  const [editData, setEditData] = useState<Partial<Property>>({})
  const router = useRouter()

  useEffect(() => {
    const u = localStorage.getItem('shomal_user')
    if (!u) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    loadProps(parsed.user_id)
  }, [])

  const loadProps = async (user_id: number) => {
    setLoading(true)
    const res = await fetch(`/api/properties?user_id=${user_id}`)
    const data = await res.json()
    setProps(data.data || [])
    setLoading(false)
  }

  const saveEdit = async (id: number) => {
    if (!user) return
    await fetch('/api/properties', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, user_id: user.user_id, ...editData })
    })
    setEditId(null)
    loadProps(user.user_id)
  }

  const deleteProp = async (id: number) => {
    if (!user || !confirm('آیا مطمئن هستید؟')) return
    await fetch('/api/properties', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, user_id: user.user_id })
    })
    loadProps(user.user_id)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">پنل میزبان</h1>
            <p className="text-sm text-gray-500 mt-1">خوش اومدی، {user.name} 🌿</p>
          </div>
          <Link href="/register" className="btn-primary text-sm"><Plus size={16}/>اقامتگاه جدید</Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>
        ) : props.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏡</div>
            <p className="text-gray-500 mb-4">هنوز اقامتگاهی ثبت نکردید</p>
            <Link href="/register" className="btn-primary">ثبت اولین اقامتگاه</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {props.map(prop => (
              <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{prop.village} — {prop.city}</h3>
                    <p className="text-sm text-gray-500">{prop.province} | {prop.property_type}</p>
                  </div>
                  <span className={`badge ${prop.status==='approved'?'badge-green':prop.status==='pending'?'badge-yellow':'badge-red'}`}>
                    {prop.status==='approved'?'✅ تایید شده':prop.status==='pending'?'⏳ در انتظار':'❌ رد شده'}
                  </span>
                </div>

                {editId === prop.id ? (
                  <div className="space-y-3 mb-3 bg-gray-50 p-4 rounded-xl">
                    <textarea className="input h-20 text-sm" value={editData.description||prop.description} onChange={e=>setEditData(d=>({...d,description:e.target.value}))} placeholder="توضیحات"/>
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input text-sm" value={editData.price_from||prop.price_from} onChange={e=>setEditData(d=>({...d,price_from:e.target.value}))} placeholder="قیمت از"/>
                      <input className="input text-sm" value={editData.price_to||prop.price_to} onChange={e=>setEditData(d=>({...d,price_to:e.target.value}))} placeholder="قیمت تا"/>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>saveEdit(prop.id)} className="btn-primary text-sm flex-1"><Save size={14}/>ذخیره</button>
                      <button onClick={()=>setEditId(null)} className="btn-outline text-sm flex-1"><X size={14}/>انصراف</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 mb-3">
                    <p>💰 از {formatPrice(prop.price_from)} تا {formatPrice(prop.price_to)}</p>
                    <p className="mt-1 text-gray-500 line-clamp-2">{prop.description}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={()=>{setEditId(prop.id);setEditData({})}} className="btn text-xs bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200"><Edit2 size={13}/>ویرایش</button>
                  <button onClick={()=>deleteProp(prop.id)} className="btn text-xs bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100"><Trash2 size={13}/>حذف</button>
                  {prop.status === 'approved' && (
                    <Link href={`/properties/${prop.id}`} className="btn text-xs bg-forest-50 text-forest-700 px-4 py-2 rounded-xl hover:bg-forest-100"><Home size={13}/>مشاهده</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
