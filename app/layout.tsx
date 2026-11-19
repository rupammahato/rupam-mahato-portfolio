import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { contact } from '@/lib/site-data'
import { siteIdentity } from '@/lib/site-identity'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(siteIdentity.url),
  alternates: { canonical: '/' },
  title: siteIdentity.title,
  description: siteIdentity.description,
  // ?v= busts browsers' aggressive favicon cache; bump it when the icon changes.
  icons: { icon: [{ url: '/icon.svg?v=2', type: 'image/svg+xml' }, { url: '/icon-32.png?v=2', sizes: '32x32', type: 'image/png' }], apple: '/apple-icon.png?v=2' },
  openGraph: { title: siteIdentity.title, description: siteIdentity.description, url: '/', siteName: 'Rupam Mahato', type: 'website' },
  twitter: { card: 'summary_large_image', title: siteIdentity.title, description: siteIdentity.description },
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0b0c0e', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: 'Rupam Mahato', url: siteIdentity.url, jobTitle: 'Backend Engineer', email: contact.email, sameAs: [contact.github, contact.linkedin, contact.codeforces, contact.leetcode], address: { '@type': 'PostalAddress', addressLocality: 'Kharagpur', addressCountry: 'IN' } }
  return <html lang="en" className={`${geist.variable} ${geistMono.variable}`}><body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
