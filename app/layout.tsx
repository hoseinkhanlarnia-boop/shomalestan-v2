import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'شمالستان — بهترین اقامتگاه‌های شمال ایران',
  description: 'ویلا، کلبه و اقامتگاه در مازندران، گیلان و گلستان — بدون واسطه',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
