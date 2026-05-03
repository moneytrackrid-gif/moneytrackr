import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register, loading, error, setError } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    let ok
    if (mode === 'login') {
      ok = await login(email, password)
      if (ok) navigate('/dashboard')
    } else {
      if (!name.trim()) { setError('Nama harus diisi'); return }
      if (password.length < 6) { setError('Password minimal 6 karakter'); return }
      ok = await register(email, password, name)
      if (ok) navigate('/dashboard')
    }
  }

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login')
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'var(--mint)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'var(--navy)' }}>mt</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>money<span style={{ color: 'var(--mint)' }}>trackr</span></span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 8 }}>Kontrol keuanganmu dari satu tempat</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--card)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: 'var(--text)' }}>
            {mode === 'login' ? 'Masuk ke akunmu' : 'Buat akun baru'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <span onClick={switchMode} style={{ color: 'var(--navy)', fontWeight: 700, cursor: 'pointer' }}>
              {mode === 'login' ? 'Daftar gratis' : 'Masuk'}
            </span>
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Nama Lengkap</label>
                <input style={inp} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu" required />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Email</label>
              <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@kamu.com" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Password</label>
              <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: 13, background: loading ? 'var(--border)' : 'var(--navy)', color: loading ? 'var(--text-muted)' : 'var(--mint)', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)' }}>
              {loading ? 'Memproses...' : mode === 'login' ? 'Masuk →' : 'Daftar Gratis →'}
            </button>
          </form>

          {mode === 'register' && (
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
              Dengan mendaftar, kamu setuju dengan syarat & ketentuan moneytrackr.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inp = { width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text)', background: 'var(--white)', fontFamily: 'var(--font)', outline: 'none' }
