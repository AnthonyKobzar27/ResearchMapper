import type { Metadata } from 'next'
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display', weight: ['400','700','900'] })

export const metadata: Metadata = {
  title: 'Research Map - ArXiv Paper Explorer',
  description: 'Interactive visualization and exploration of research papers from arXiv',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}