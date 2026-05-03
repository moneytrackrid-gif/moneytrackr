import { useNavigate } from 'react-router-dom'
import { Crown } from 'lucide-react'

export default function ProGate({ feature = 'fitur ini' }) {
  const navigate = useNavigate()
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{ width: 64, height: 64, background: 'var(--mint-dim)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Crown size={28} color="var(--mint-text)" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 10, letterSpacing: -0.5 }}>Fitur PRO</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
          {feature} hanya tersedia untuk pengguna PRO. Upgrade sekarang dan dapatkan akses penuh ke semua fitur.
        </p>
        <button onClick={() => navigate('/pricing')} style={{ background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 'var(--radius-md)', padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
          Lihat Paket PRO →
        </button>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>Mulai dari Rp 99.000/tahun</p>
      </div>
    </div>
  )
}
