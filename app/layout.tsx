import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Rupam Mahato — Backend Engineer',
  description: 'Rupam Mahato builds backend systems, AI/RAG pipelines, and cloud infrastructure for real-world products.',
  generator: 'v0.app',
  openGraph: { title: 'Rupam Mahato — Backend Engineer', description: 'Designing systems that hold their shape.', type: 'website' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f5f1e8', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: 'Rupam Mahato', jobTitle: 'Backend Engineer', email: 'rupammahato593@gmail.com', address: { '@type': 'PostalAddress', addressLocality: 'Kharagpur', addressCountry: 'IN' } }
  return <html lang="en" className="bg-[var(--paper)]"><body className={`${inter.variable} antialiased`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
