'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Property, formatPrice } from '@/lib/supabase'
import { Check, X, Edit2, Save, RefreshCw, LogOut } from 'lucide-react'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<'pending'|'approved'|'rejected'>('pending')
  const [items, setItems] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<number|null>(null)
  const [editData, setEditData] = useState<Partial<Property>>({})
  const router = useRouter()

  const login = async () => {
    const res = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password}) })
    if (res.ok) setAuthed(true)
    else alert('رمز اشتباه است')
  }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin?status=${tab}`)
    const data = await res.json()
    setItems(data.data || [])
    setLoading(false)
  }, [tab])

  useEffect(() => { if (authed) load() }, [authed, load])

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/admin', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id,status}) })
    load()
  }

  const saveEdit = async (id: number) => {
    await fetch('/api/admin', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id,...editData}) })
    setEditId(null)
    load()
  }

  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-sm border p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🌿</div>
        <h1 className="text-xl font-bold mb-6">پنل مدیریت</h1>
        <input type="password" className="input mb-3" placeholder="رمز عبور" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/>
        <button onClick={login} className="btn-primary w-full">ورود</button>
      </div>
    </div>
  )

  const counts = { pending: items.filter(i=>i.status==='pending').length }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <h1 className="font-bold text-lg">پنل مدیریت شمالستان</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="btn-ghost text-sm"><RefreshCw size={15}/>بروزرسانی</button>
          <a href="/" className="btn-ghost text-sm"><LogOut size={15}/>سایت</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {(['pending','approved','rejected'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-sm px-5 py-2.5 rounded-xl font-medium transition-all ${tab===t ? 'bg-forest-600 text-white shadow-sm' : 'bg-white text-gray-600 border hover:border-forest-300'}`}>
              {t==='pending' ? '⏳ در انتظار' : t==='approved' ? '✅ تایید شده' : '❌ رد شده'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">موردی وجود ندارد</div>
        ) : (
          <div className="space-y-4">
            {items.map(prop => (
              <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{prop.village} — {prop.city}</h3>
                    <p className="text-sm text-gray-500">{prop.province} | {prop.property_type}</p>
                  </div>
                  <span className={`badge ${prop.status==='approved'?'badge-green':prop.status==='pending'?'badge-yellow':'badge-red'}`}>
                    {prop.status==='approved'?'تایید شده':prop.status==='pending'?'در انتظار':'رد شده'}
                  </span>
                </div>

                {editId === prop.id ? (
                  <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-xl">
                    <textarea className="input h-20 text-sm" value={editData.description||prop.description} onChange={e=>setEditData(d=>({...d,description:e.target.value}))} placeholder="توضیحات"/>
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input text-sm" value={editData.price_from||prop.price_from} onChange={e=>setEditData(d=>({...d,price_from:e.target.value}))} placeholder="قیمت از"/>
                      <input className="input text-sm" value={editData.price_to||prop.price_to} onChange={e=>setEditData(d=>({...d,price_to:e.target.value}))} placeholder="قیمت تا"/>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input className="input text-sm" value={editData.capacity||prop.capacity} onChange={e=>setEditData(d=>({...d,capacity:e.target.value}))} placeholder="ظرفیت"/>
                      <input className="input text-sm" value={editData.rooms||prop.rooms} onChange={e=>setEditData(d=>({...d,rooms:e.target.value}))} placeholder="خواب"/>
                      <input className="input text-sm" value={editData.area||prop.area} onChange={e=>setEditData(d=>({...d,area:e.target.value}))} placeholder="متراژ"/>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>saveEdit(prop.id)} className="btn-primary text-sm flex-1"><Save size={14}/>ذخیره</button>
                      <button onClick={()=>setEditId(null)} className="btn-outline text-sm flex-1"><X size={14}/>انصراف</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>👤 {prop.name} | 📞 {prop.phone}</p>
                    <p>👥 {prop.capacity} نفر | 🛏 {prop.rooms} خواب | 📐 {prop.area} متر</p>
                    <p>💰 از {formatPrice(prop.price_from)} تا {formatPrice(prop.price_to)}</p>
                    <p className="text-gray-500 mt-2">{prop.description}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {prop.status !== 'approved' && <button onClick={()=>updateStatus(prop.id,'approved')} className="btn text-xs bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"><Check size={14}/>تایید</button>}
                  {prop.status !== 'rejected' && <button onClick={()=>updateStatus(prop.id,'rejected')} className="btn text-xs bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"><X size={14}/>رد</button>}
                  {prop.status !== 'pending' && <button onClick={()=>updateStatus(prop.id,'pending')} className="btn text-xs bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600">معلق</button>}
                  <button onClick={()=>{setEditId(prop.id);setEditData({})}} className="btn text-xs bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200"><Edit2 size={14}/>ویرایش</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
