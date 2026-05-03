import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@moneytrackr.id')
  const [password, setPassword] = useState('demo123')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'var(--mint)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'var(--navy)' }}>mt</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>money<span style={{ color: 'var(--mint)' }}>trackr</span></span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 10 }}>Kontrol keuanganmu dari satu tempat</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-xl)', padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>Masuk ke akunmu</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Coba: demo@moneytrackr.id / demo123</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@kamu.com" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 13, padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? 'var(--border)' : 'var(--navy)', color: loading ? 'var(--text-muted)' : 'var(--mint)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s', fontFamily: 'var(--font)' }}>
              {loading ? 'Masuk...' : 'Masuk →'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '14px', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Demo accounts</p>
            <p style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 3 }}>🟢 PRO: demo@moneytrackr.id</p>
            <p style={{ fontSize: 12, color: 'var(--text-sub)' }}>⚪ Free: free@moneytrackr.id</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Password semua: demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--text)', background: 'var(--white)', fontFamily: 'var(--font)', outline: 'none', transition: 'border-color 0.15s' }
