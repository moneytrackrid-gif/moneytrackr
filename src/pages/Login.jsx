import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User } from 'lucide-react'

export default function Login() {
  const { login, register, loading, error, setError } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
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

  const switchMode = () => { setMode(m => m === 'login' ? 'register' : 'login'); setError('') }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, background: 'var(--mint)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 26, color: 'var(--navy)', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,230,118,0.3)' }}>mt</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0d1b2a', letterSpacing: -0.5, marginBottom: 6 }}>moneytrackr.</h1>
          <p style={{ color: '#999', fontSize: 14 }}>Kontrol keuanganmu dari satu tempat.</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          {mode === 'register' && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Nama lengkap" required
                style={inp}
              />
            </div>
          )}

          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Alamat Email" required
              style={inp}
            />
          </div>

          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" required
              style={inp}
            />
          </div>

          {mode === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, marginTop: -8 }}>
              <span style={{ fontSize: 13, color: '#999', cursor: 'pointer', fontWeight: 500 }}>Lupa Password?</span>
            </div>
          )}

          {error && (
            <div style={{ background: '#fff0f0', color: '#e53935', fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '14px', background: 'var(--mint)', color: 'var(--navy)',
            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif',
            opacity: loading ? 0.7 : 1, marginBottom: 16,
          }}>
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#999' }}>
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <span onClick={switchMode} style={{ color: '#0d1b2a', fontWeight: 700, cursor: 'pointer' }}>
              {mode === 'login' ? 'Daftar' : 'Masuk'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

const inp = {
  width: '100%', padding: '13px 14px 13px 42px',
  border: 'none', borderRadius: 12, fontSize: 14,
  color: '#0d1b2a', background: '#f5f5f5',
  fontFamily: 'Inter, sans-serif', outline: 'none',
  boxSizing: 'border-box',
}
