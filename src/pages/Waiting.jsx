import { useNavigate } from 'react-router-dom'

export default function Waiting() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#0d2137', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>⏳</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: -0.5 }}>Menunggu Aktivasi</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
          Akunmu sudah dibuat! Setelah pembayaran di Scalev dikonfirmasi, akses dashboardmu akan aktif otomatis dalam beberapa menit.
        </p>
        <button onClick={() => navigate('/login')} style={{
          background: '#00e676', color: '#0d2137', border: 'none', borderRadius: 12,
          padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
        }}>
          Coba Masuk
        </button>
      </div>
    </div>
  )
}
