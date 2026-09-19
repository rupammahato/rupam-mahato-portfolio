import { ImageResponse } from 'next/og'

export const alt = 'Rupam Mahato — Backend Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', background: '#0b0c0e', color: '#eceae4', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 28, letterSpacing: '-0.02em', color: '#ff5a2c', marginBottom: 24 }}>RUPAM MAHATO</div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
          <span>Designing <span style={{ color: '#ff5a2c' }}>systems</span></span>
          <span>that hold their shape.</span>
        </div>
        <div style={{ fontSize: 26, color: '#a3a8b1', marginTop: 32 }}>Backend Engineer · AI Systems · Kharagpur, IN</div>
      </div>
    ),
    { ...size }
  )
}
