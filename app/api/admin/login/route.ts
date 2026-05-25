import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: 'رمز اشتباه است' }, { status: 401 })
  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_auth', password, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
  return res
}
