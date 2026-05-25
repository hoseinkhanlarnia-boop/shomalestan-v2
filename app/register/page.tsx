'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Check } from 'lucide-react'

const PROVINCES: Record<string,string[]> = {
  'مازندران':['ساری','آمل','بابل','نوشهر','چالوس','رامسر','تنکابن','بابلسر','محمودآباد','نور'],
  'گیلان':['رشت','بندر انزلی','لاهیجان','لنگرود','آستانه اشرفیه','رودبار','فومن','صومعه‌سرا','ماسال','تالش'],
  'گلستان':['گرگان','گنبد کاووس','علی‌آباد کتول','بندر ترکمن','کردکوی','بندر گز','رامیان','آزادشهر','مینودشت','گالیکش'],
}
const TYPES = ['🏕 کلبه','🏊 ویلا استخردار','🏔 کلبه سوئیسی','🏡 خانه روستایی','🛁 ویلا با جکوزی','🌿 ویلا ییلاقی']
const AMENITIES = ['🚗 پارکینگ','🔥 سیستم گرمایشی','❄️ سیستم سرمایشی','📺 تلویزیون','🛋 مبلمان','💧 آب لوله‌کشی','💡 برق','🧊 یخچال','🍳 اجاق گاز','🚿 حمام','🌐 اینترنت','👕 ماشین لباسشویی','🏊 استخر','🛁 جکوزی','🧖 سونا','🎱 میز بیلیارد']
const PRICE_OPTS = ['زیر ۱ میلیون','۱ میلیون','۲ میلیون','۳ میلیون','۴ میلیون','۵ میلیون','۶ میلیون','۷ میلیون','۸ میلیون','۹ میلیون','۱۰ میلیون','۱۲ میلیون','۱۵ میلیون','۲۰ میلیون']

function priceToNum(label: string): number {
  if (label.includes('زیر')) return 999999
  const m = label.match(/\d+/)
  return m ? parseInt(m[0]) * 1000000 : 0
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'',phone:'',province:'',city:'',village:'',property_type:'',description:'',capacity:'',rooms:'',area:'',price_from:'',price_to:'',amenities:[] as string[] })

  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}))
  const toggleA = (a: string) => setForm(f => ({...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x=>x!==a) : [...f.amenities,a]}))

  const submit = async () => {
    setLoading(true)
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('shomal_user')||'{}') : {}
    await fetch('/api/properties', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ ...form, user_id: user.user_id||0, amenities: form.amenities.join(' | '), status:'pending' })
    })
    setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div className="min-h-screen bg-gray-50"><Navbar/>
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={36} className="text-forest-600"/></div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">ثبت شد!</h1>
        <p className="text-gray-500 mb-6">اقامتگاه شما پس از بررسی منتشر می‌شود.</p>
        <a href="/" className="btn-primary">بازگشت به خانه</a>
      </div>
    </div>
  )

  const steps = ['اطلاعات مالک','مشخصات','جزئیات','قیمت و امکانات']
  const pf = priceToNum(form.price_from)

  return (
    <div className="min-h-screen bg-gray-50"><Navbar/>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">ثبت اقامتگاه</h1>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((s,i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full mb-1 ${step>i?'bg-forest-500':'bg-gray-200'}`}/>
              <div className="text-xs text-gray-400 hidden sm:block">{s}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {step===1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-gray-800 mb-4">اطلاعات مالک</h2>
              <div><label className="label">نام و نام خانوادگی</label><input className="input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="علی محمدی"/></div>
              <div><label className="label">شماره تلفن</label><input className="input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="09xxxxxxxxx" dir="ltr"/></div>
              <button onClick={()=>setStep(2)} disabled={!form.name||!form.phone} className="btn-primary w-full mt-2">مرحله بعد</button>
            </div>
          )}

          {step===2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-gray-800 mb-4">مشخصات اقامتگاه</h2>
              <div><label className="label">استان</label>
                <select className="input" value={form.province} onChange={e=>{set('province',e.target.value);set('city','')}}>
                  <option value="">انتخاب کنید</option>
                  {Object.keys(PROVINCES).map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div><label className="label">شهر</label>
                <select className="input" value={form.city} onChange={e=>set('city',e.target.value)} disabled={!form.province}>
                  <option value="">انتخاب کنید</option>
                  {(PROVINCES[form.province]||[]).map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="label">روستا / محل</label><input className="input" value={form.village} onChange={e=>set('village',e.target.value)} placeholder="نام دقیق روستا"/></div>
              <div><label className="label">نوع اقامتگاه</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {TYPES.map(t=>(
                    <button key={t} onClick={()=>set('property_type',t)}
                      className={`py-2.5 px-3 rounded-xl border text-sm text-right transition-all ${form.property_type===t?'border-forest-500 bg-forest-50 text-forest-700 font-medium':'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2"><button onClick={()=>setStep(1)} className="btn-outline flex-1">قبلی</button><button onClick={()=>setStep(3)} disabled={!form.province||!form.city||!form.village||!form.property_type} className="btn-primary flex-1">بعدی</button></div>
            </div>
          )}

          {step===3 && (
            <div className="space-y-4">
              <h2 className="font-bold text-gray-800 mb-4">جزئیات</h2>
              <div><label className="label">توضیحات</label><textarea className="input h-24" value={form.description} onChange={e=>set('description',e.target.value)} placeholder="توضیح کوتاهی از اقامتگاه..."/></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="label">ظرفیت (نفر)</label><input className="input" type="number" value={form.capacity} onChange={e=>set('capacity',e.target.value)} placeholder="8"/></div>
                <div><label className="label">خواب</label><input className="input" type="number" value={form.rooms} onChange={e=>set('rooms',e.target.value)} placeholder="2"/></div>
                <div><label className="label">متراژ (متر)</label><input className="input" type="number" value={form.area} onChange={e=>set('area',e.target.value)} placeholder="120"/></div>
              </div>
              <div className="flex gap-2"><button onClick={()=>setStep(2)} className="btn-outline flex-1">قبلی</button><button onClick={()=>setStep(4)} disabled={!form.description||!form.capacity} className="btn-primary flex-1">بعدی</button></div>
            </div>
          )}

          {step===4 && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-800 mb-4">قیمت و امکانات</h2>
              <div>
                <label className="label">💰 شروع قیمت از (هر شب)</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {PRICE_OPTS.map(p=>(
                    <button key={p} onClick={()=>{set('price_from',String(priceToNum(p)));set('price_to','')}}
                      className={`py-2 px-2 rounded-xl border text-xs transition-all ${form.price_from===String(priceToNum(p))?'border-forest-500 bg-forest-50 text-forest-700 font-medium':'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{p}</button>
                  ))}
                </div>
              </div>
              {form.price_from && (
                <div>
                  <label className="label">💰 پایان قیمت تا (هر شب)</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {PRICE_OPTS.filter(p=>priceToNum(p)>pf).map(p=>(
                      <button key={p} onClick={()=>set('price_to',String(priceToNum(p)))}
                        className={`py-2 px-2 rounded-xl border text-xs transition-all ${form.price_to===String(priceToNum(p))?'border-forest-500 bg-forest-50 text-forest-700 font-medium':'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{p}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="label">✨ امکانات</label>
                <p className="text-xs text-gray-400 mb-2">یک بار بزنید اضافه — دوباره بزنید حذف</p>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map(a=>(
                    <button key={a} onClick={()=>toggleA(a)}
                      className={`text-xs px-3 py-2 rounded-xl border transition-all ${form.amenities.includes(a)?'bg-forest-500 text-white border-forest-500':'border-gray-200 text-gray-600 hover:border-forest-300'}`}>{a}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setStep(3)} className="btn-outline flex-1">قبلی</button>
                <button onClick={submit} disabled={loading||!form.price_from||!form.price_to} className="btn-primary flex-1">{loading?'در حال ثبت...':'✅ ثبت اقامتگاه'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
