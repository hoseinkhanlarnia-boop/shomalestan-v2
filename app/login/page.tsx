'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Phone, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const login = async () => {
    if (!phone.trim()) { setError('شماره تلفن را وارد کنید'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        localStorage.setItem('shomal_user', JSON.stringify(data.user))
        router.push('/panel')
      } else {
        setError(data.error || 'شماره‌ای با این مشخصات یافت نشد')
      }
    } catch {
      setError('خطای اتصال. دوباره امتحان کنید.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌿</div>
            <h1 className="text-xl font-extrabold text-gray-900 mb-1">ورود به پنل میزبان</h1>
            <p className="text-sm text-gray-500">شماره تلفنی که با ربات ثبت کردید را وارد کنید</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">شماره تلفن</label>
              <div className="relative">
                <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input
                  type="tel"
                  className="input pr-9"
                  placeholder="09xxxxxxxxx"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && login()}
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <button onClick={login} disabled={loading} className="btn-primary w-full">
              {loading ? 'در حال بررسی...' : (<><ArrowLeft size={16}/>ورود به پنل</>)}
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            هنوز اقامتگاهی ثبت نکردید؟{' '}
            <a href="/register" className="text-forest-600 font-medium hover:underline">ثبت اقامتگاه</a>
          </div>
        </div>
      </div>
    </div>
  )
}
