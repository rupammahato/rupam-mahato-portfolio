import type { Metadata } from 'next'
import DesignPreview from './preview'

export const metadata: Metadata = {
  title: 'Component preview | Rupam Mahato',
  robots: { index: false, follow: false },
  alternates: { canonical: '/design-preview' },
}

export default function Page() { return <DesignPreview /> }
