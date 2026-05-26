import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const file_id = req.nextUrl.searchParams.get('file_id')
  if (!file_id) return NextResponse.json({ error: 'no file_id' }, { status: 400 })

  const token = process.env.TELEGRAM_BOT_TOKEN
  const res = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`)
  const data = await res.json()
  
  if (!data.ok) return NextResponse.json({ error: 'not found' }, { status: 404 })
  
  const fileUrl = `https://api.telegram.org/file/bot${token}/${data.result.file_path}`
  const imageRes = await fetch(fileUrl)
  const buffer = await imageRes.arrayBuffer()
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
    }
  })
}
