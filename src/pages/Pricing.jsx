import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [error, setError] = useState(null)

  const handleBayar = () => {
    window.open('https://moneytrackr.myr.id/m/moneytrackr-3-month', '_blank')
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', background: '#f8faff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 5vw', color: '#0d2137' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48, cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, background: '#0d2137', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#00e676' }}>mt</div>
        <span style={{ fontSize: 16, fontWeight: 800 }}>money<span style={{ color: '#00e676' }}>trackr</span></span>
      </div>

      <div style={{ background: '#00e676', borderRadius: 24, padding: '40px 36px', maxWidth: 440, width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#0d2137', color: '#00e676', fontSize: 10, fontWeight: 800, padding: '5px 16px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: 1 }}>☕ LEBIH MURAH DARI ES KOPSU</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#064a22', marginBottom: 4 }}>moneytrackr</div>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#0d2137', letterSpacing: -2, lineHeight: 1 }}>Rp 147.000</div>
        <div style={{ fontSize: 14, color: '#064a22', marginBottom: 4 }}>untuk 6 bulan penuh</div>
        <div style={{ fontSize: 12, color: '#064a22', opacity: 0.7, marginBottom: 24 }}>= Rp 820/hari · Lebih murah dari es kopsu</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, textAlign: 'left' }}>
          {['Budget otomatis', 'Goals dengan deadline', 'Laporan bulanan', 'Scan struk otomatis', 'Financial Health Score', 'Data privat & aman', 'Akses semua platform', 'AI Report Analyzer'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#0d2137', fontSize: 14, fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: 13, color: '#0d2137', fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(13,33,55,0.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0d2137', marginBottom: 4 }}>🛡️ Garansi 7 Hari</div>
          <div style={{ fontSize: 12, color: '#064a22', lineHeight: 1.6 }}>Kalau ga bermanfaat dalam 7 hari, refund penuh. Tidak ada pertanyaan.</div>
        </div>
        {error && <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#c00' }}>{error}</div>}
        <button onClick={handleBayar}  style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
          {loading ? 'Memproses...' : 'Bayar Sekarang — Rp 147.000 →'}
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#7a9ab8', marginTop: 20 }}>Ga perlu kartu kredit · QRIS, Transfer Bank, GoPay, OVO tersedia</p>
    </div>
  )
}
