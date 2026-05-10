import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, Lock, User } from 'lucide-react'

export default function Aktivasi() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isNewUser, setIsNewUser] = useState(null) // null = belum cek, true = baru, false = sudah ada

  const handleCheckEmail = async () => {
    if (!email.trim()) { setError('Email harus diisi'); return }
    setLoading(true)
    setError('')

    try {
      // Cek apakah email sudah bayar (ada di profiles dengan status active)
      const { data, error: fnError } = await supabase.functions.invoke('check-payment', {
        body: { email },
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('check-payment result:', data, fnError)

      if (fnError || !data?.paid) {
        setError('Email ini belum melakukan pembayaran. Silakan bayar dulu di moneytrackr.id')
        setLoading(false)
        return
      }

      setIsNewUser(data.isNewUser)
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.')
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!password || password.length < 6) { setError('Password minimal 6 karakter'); return }
    if (isNewUser && !name.trim()) { setError('Nama harus diisi'); return }
    setLoading(true)
    setError('')

    try {
      if (isNewUser) {
        // Daftar akun baru
        const { error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        })
        if (signUpError) throw signUpError
        await new Promise(r => setTimeout(r, 1500))
        // Login langsung
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw loginError
      } else {
        // Login akun yang sudah ada
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw new Error('Password salah. Coba lagi.')
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, background: '#00e676', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 26, color: '#0d2137', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,230,118,0.3)' }}>mt</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d2137', letterSpacing: -0.5, marginBottom: 6 }}>
            {isNewUser === null ? 'Aktivasi Akun' : isNewUser ? 'Buat Password' : 'Masuk'}
          </h1>
          <p style={{ color: '#999', fontSize: 14 }}>
            {isNewUser === null ? 'Masukkan email yang dipakai saat bayar di Scalev' : isNewUser ? 'Satu langkah lagi untuk masuk ke dashboard!' : 'Masukkan password akunmu'}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {/* Email field - selalu tampil */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
            <input
              type="email" value={email}
              onChange={e => { setEmail(e.target.value); setIsNewUser(null); setError('') }}
              placeholder="Email yang dipakai di Scalev"
              disabled={isNewUser !== null}
              style={{ width: '100%', padding: '13px 14px 13px 42px', border: 'none', borderRadius: 12, fontSize: 14, color: '#0d2137', background: isNewUser !== null ? '#f0f0f0' : '#f5f5f5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', cursor: isNewUser !== null ? 'not-allowed' : 'text' }}
            />
          </div>

          {/* Step 2: nama + password setelah email dicek */}
          {isNewUser !== null && (
            <>
              {isNewUser && (
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Nama lengkap"
                    style={{ width: '100%', padding: '13px 14px 13px 42px', border: 'none', borderRadius: 12, fontSize: 14, color: '#0d2137', background: '#f5f5f5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              )}
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder={isNewUser ? 'Buat password baru (min. 6 karakter)' : 'Password'}
                  style={{ width: '100%', padding: '13px 14px 13px 42px', border: 'none', borderRadius: 12, fontSize: 14, color: '#0d2137', background: '#f5f5f5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </>
          )}

          {error && <p style={{ fontSize: 12, color: '#e53935', marginBottom: 12 }}>{error}</p>}

          <button
            onClick={isNewUser !== null ? handleSubmit : handleCheckEmail}
            disabled={loading}
            style={{
              width: '100%', padding: 14, background: '#0d2137', color: '#00e676',
              border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Memproses...' : isNewUser !== null ? 'Masuk ke Dashboard →' : 'Lanjut'}
          </button>

          {isNewUser !== null && (
            <button onClick={() => { setIsNewUser(null); setPassword(''); setError('') }}
              style={{ width: '100%', marginTop: 10, padding: '10px', background: 'none', border: 'none', fontSize: 12, color: '#999', cursor: 'pointer' }}>
              ← Ganti email
            </button>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 16 }}>
          Sudah punya akun?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#0d2137', fontWeight: 700, cursor: 'pointer' }}>Masuk</span>
        </p>
      </div>
    </div>
  )
}
