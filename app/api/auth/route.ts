import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { phone } = await req.json()
  if (!phone) return NextResponse.json({ error: 'شماره تلفن الزامی است' }, { status: 400 })

  // جستجو با فرمت‌های مختلف شماره
  const cleaned = phone.replace(/[^0-9]/g, '')
  const formats = [phone, `+98${cleaned.slice(1)}`, `0${cleaned.slice(-10)}`, cleaned]

  let user = null
  for (const fmt of formats) {
    const { data } = await supabaseAdmin.from('properties').select('name,phone,user_id').eq('phone', fmt).limit(1).single()
    if (data) { user = data; break }
  }

  if (!user) return NextResponse.json({ error: 'شماره‌ای با این مشخصات یافت نشد.\nلطفاً از طریق ربات تلگرام ثبت‌نام کنید.' }, { status: 404 })

  return NextResponse.json({ user: { name: user.name, phone: user.phone, user_id: user.user_id } })
}
