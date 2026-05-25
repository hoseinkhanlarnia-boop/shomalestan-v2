import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('properties').insert({ ...body, status: 'pending' }).select().single()
  if (error) return NextResponse.json({ error }, { status: 400 })

  const token = process.env.TELEGRAM_BOT_TOKEN
  const adminId = process.env.ADMIN_ID
  if (token && adminId) {
    const msg = `🏡 اقامتگاه جدید از سایت:\n\n👤 ${body.name}\n📞 ${body.phone}\n📍 ${body.province} — ${body.city}\n🏡 ${body.village}\n🏠 ${body.property_type}\n📝 ${body.description}\n💰 از ${body.price_from} تا ${body.price_to} تومان`
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminId, text: msg,
        reply_markup: { inline_keyboard: [[
          { text: '✅ تایید', callback_data: `approve_${data.id}_0` },
          { text: '❌ رد', callback_data: `reject_${data.id}_0` },
        ]]}
      })
    })
  }
  return NextResponse.json({ success: true, id: data.id })
}

export async function PATCH(req: NextRequest) {
  const { id, user_id, ...data } = await req.json()
  const { error } = await supabaseAdmin.from('properties').update(data).eq('id', id).eq('user_id', user_id)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { id, user_id } = await req.json()
  const { error } = await supabaseAdmin.from('properties').delete().eq('id', id).eq('user_id', user_id)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true })
}
