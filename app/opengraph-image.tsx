import { ImageResponse } from 'next/og'

export const alt = 'Rupam Mahato — Backend Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', background: '#f5f1e8', color: '#111827', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 28, letterSpacing: '-0.02em', color: '#f24822', marginBottom: 24 }}>RUPAM MAHATO</div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          <span>Designing <span style={{ color: '#1648d8' }}>systems</span></span>
          <span>that hold their shape.</span>
        </div>
        <div style={{ fontSize: 26, color: '#536077', marginTop: 32 }}>Backend Engineer · AI Systems · Kharagpur, IN</div>
      </div>
    ),
    { ...size }
  )
}
