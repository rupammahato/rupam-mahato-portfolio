import { ImageResponse } from 'next/og'
import { siteIdentity } from '@/lib/site-identity'

export const alt = siteIdentity.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 64px', background: '#0b0c0e', color: '#eceae4', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}><span style={{ display: 'flex', fontSize: 32, fontWeight: 700 }}>RM<span style={{ color: '#ff5a2c' }}>.</span></span><span style={{ fontSize: 20 }}>Rupam Mahato</span></div>
          <span style={{ fontSize: 18, color: '#9299a3' }}>ENGINEERING / PRODUCT</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 620 }}>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 64, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 1.05 }}>
              <span>Designing</span><span style={{ display: 'flex', gap: 14 }}><span style={{ color: '#ff5a2c' }}>systems</span>that</span><span>hold their shape.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 22, color: '#a3a8b1', marginTop: 24, lineHeight: 1.5 }}><span>Backend &amp; AI engineering</span><span>with product ownership.</span></div>
          </div>
          <svg width="340" height="320" viewBox="0 0 360 340" fill="none">
            <g stroke="#6f8cff" strokeWidth="1.5" strokeLinejoin="round">
              <path d="m20 242 160-80 160 80-160 80Z" fill="#111316" />
              <path d="m20 158 160-80 160 80-160 80Z" fill="#111316" />
              <path d="m20 74 160-64 160 64-160 80Z" fill="#171a1e" />
              <path d="m97 48 83-33 83 33v48l-83 42-83-42Z" fill="#171a1e" />
              <path d="m97 48 83 42 83-42m-83 42v48m-65-78 41 21m-41-9 26 13" />
              {[112, 180, 248].map((x, i) => <g key={x} transform={`translate(${x} ${169 + (i === 1 ? 19 : -12)})`}>
                <path d="m-24 0 24-12L24 0v-30L0-42l-24 12Zm0-30L0-18l24-12M0-18v30" fill="#171a1e" />
                <circle cx="11" cy="-5" r="2.5" fill="#ff5a2c" stroke="none" />
              </g>)}
              {[112, 180, 248].map((x, i) => <g key={x} transform={`translate(${x} ${259 + (i === 1 ? 19 : -12)})`}>
                <path d="M-21-12v25c0 15 42 15 42 0v-25" fill="#171a1e" /><ellipse cy="-12" rx="21" ry="8" fill="#171a1e" /><path d="M-21 0c0 15 42 15 42 0" />
              </g>)}
            </g>
            <path d="M180 117v26m0 64v27" stroke="#ff5a2c" strokeWidth="2" strokeDasharray="4 5" />
            <circle cx="180" cy="132" r="3" fill="#ff5a2c" /><circle cx="180" cy="222" r="3" fill="#ff5a2c" />
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #383b40', paddingTop: 22, fontSize: 18, color: '#9299a3' }}><span>Product experience / Reliable services / Isolated knowledge</span><span>Kharagpur, IN</span></div>
      </div>
    ),
    { ...size }
  )
}
