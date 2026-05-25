'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Home, Search, PlusCircle, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{name:string, phone:string} | null>(null)

  useEffect(() => {
    const u = localStorage.getItem('shomal_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.removeItem('shomal_user')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-2xl">🌿</span>
          <div>
            <span className="text-xl font-extrabold text-forest-700 tracking-tight">شمالستان</span>
            <div className="text-xs text-gray-400 -mt-1">اقامتگاه‌های شمال ایران</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/" className="btn-ghost text-sm flex items-center gap-1.5"><Home size={16}/>خانه</Link>
          <Link href="/properties" className="btn-ghost text-sm flex items-center gap-1.5"><Search size={16}/>اقامتگاه‌ها</Link>
          {user ? (
            <>
              <Link href="/panel" className="btn-ghost text-sm flex items-center gap-1.5"><User size={16}/>پنل من</Link>
              <button onClick={logout} className="btn-ghost text-sm flex items-center gap-1.5 text-red-500 hover:bg-red-50"><LogOut size={16}/>خروج</button>
            </>
          ) : (
            <Link href="/login" className="btn-ghost text-sm flex items-center gap-1.5"><User size={16}/>ورود</Link>
          )}
          <Link href="/register" className="btn-primary text-sm mr-2"><PlusCircle size={16}/>ثبت اقامتگاه</Link>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-2 bg-white">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-gray-700"><Home size={16}/>خانه</Link>
          <Link href="/properties" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-gray-700"><Search size={16}/>اقامتگاه‌ها</Link>
          {user ? (
            <>
              <Link href="/panel" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-gray-700"><User size={16}/>پنل من</Link>
              <button onClick={logout} className="flex items-center gap-2 py-2 text-red-500"><LogOut size={16}/>خروج</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-gray-700"><User size={16}/>ورود</Link>
          )}
          <Link href="/register" onClick={() => setOpen(false)} className="btn-primary text-sm text-center mt-1"><PlusCircle size={16}/>ثبت اقامتگاه</Link>
        </div>
      )}
    </nav>
  )
}
