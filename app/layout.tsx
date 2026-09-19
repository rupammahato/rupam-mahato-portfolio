import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { contact } from '@/lib/site-data'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Rupam Mahato - Portfolio',
  description: 'Rupam Mahato builds backend systems, AI/RAG pipelines, and cloud infrastructure for real-world products.',
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
  openGraph: { title: 'Rupam Mahato — Backend Engineer', description: 'Designing systems that hold their shape.', type: 'website' },
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0b0c0e', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: 'Rupam Mahato', jobTitle: 'Backend Engineer', email: contact.email, sameAs: [contact.github, contact.linkedin, contact.codeforces, contact.leetcode], address: { '@type': 'PostalAddress', addressLocality: 'Kharagpur', addressCountry: 'IN' } }
  return <html lang="en" className={`${geist.variable} ${geistMono.variable}`}><body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
