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
  const [step, setStep] = useState('email') // email | set-password | login

  const handleCheckEmail = async () => {
    if (!email.trim()) { setError('Email harus diisi'); return }
    setLoading(true)
    setError('')

    try {
      // Cek apakah akun sudah dibuat oleh webhook
      const { data, error: fnError } = await supabase.functions.invoke('check-payment', {
        body: { email },
        headers: { 'Content-Type': 'application/json' }
      })

      const result = typeof data === 'string' ? JSON.parse(data) : data

      if (fnError || !result?.paid) {
        setError('Email ini belum melakukan pembayaran. Silakan bayar dulu di moneytrackr.id')
        setLoading(false)
        return
      }

      // paid = true
      if (result.isNewUser) {
        // Akun dibuat webhook, belum ada password → set password baru
        setStep('set-password')
      } else {
        // Sudah punya akun sebelumnya → login biasa
        setStep('login')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.')
    }
    setLoading(false)
  }

  const handleSetPassword = async () => {
    if (!password || password.length < 6) { setError('Password minimal 6 karakter'); return }
    setLoading(true)
    setError('')

    try {
      // Update password user yang sudah dibuat webhook
      const { error: updateError } = await supabase.auth.admin
      
      // Pakai OTP flow — minta OTP dulu untuk verifikasi email
      const { error: otpError } = await supabase.auth.signInWithOtp({ email })
      if (otpError) throw otpError

      // Simpan password sementara, tunggu user verifikasi OTP
      // Alternatif: langsung update via resetPasswordForEmail
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-password?email=${encodeURIComponent(email)}`
      })
      if (resetError) throw resetError

      setStep('check-email')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!password || password.length < 6) { setError('Password minimal 6 karakter'); return }
    setLoading(true)
    setError('')

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) throw new Error('Password salah. Coba lagi.')
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const getTitle = () => {
    if (step === 'email') return 'Aktivasi Akun'
    if (step === 'set-password') return 'Selamat Datang! 🎉'
    if (step === 'login') return 'Masuk ke Akun'
    return 'Cek Email Kamu'
  }

  const getSubtitle = () => {
    if (step === 'email') return 'Masukkan email yang kamu pakai saat pembayaran'
    if (step === 'set-password') return 'Pembayaran berhasil! Buat password untuk masuk ke dashboard.'
    if (step === 'login') return 'Masukkan password akunmu untuk lanjut ke dashboard.'
    return 'Kami sudah kirim link untuk set password ke emailmu.'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="moneytrackr" style={{ height: 48, objectFit: 'contain', margin: '0 auto 16px', display: 'block' }} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d2137', letterSpacing: -0.5, marginBottom: 6 }}>{getTitle()}</h1>
          <p style={{ color: '#999', fontSize: 14 }}>{getSubtitle()}</p>
        </div>

        {step === 'check-email' ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <p style={{ fontSize: 14, color: '#0d2137', fontWeight: 600, marginBottom: 8 }}>Link sudah dikirim!</p>
            <p style={{ fontSize: 13, color: '#999' }}>Cek inbox email <strong>{email}</strong> dan klik link untuk set password.</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setStep('email'); setError('') }}
                placeholder="Email yang dipakai saat bayar"
                disabled={step !== 'email'}
                style={{ width: '100%', padding: '13px 14px 13px 42px', border: 'none', borderRadius: 12, fontSize: 14, color: '#0d2137', background: step !== 'email' ? '#f0f0f0' : '#f5f5f5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', cursor: step !== 'email' ? 'not-allowed' : 'text' }}
              />
            </div>

            {(step === 'set-password' || step === 'login') && (
              <>
                {step === 'set-password' && (
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
                    onKeyDown={e => e.key === 'Enter' && (step === 'set-password' ? handleSetPassword() : handleLogin())}
                    placeholder={step === 'set-password' ? 'Buat password (min. 6 karakter)' : 'Password'}
                    style={{ width: '100%', padding: '13px 14px 13px 42px', border: 'none', borderRadius: 12, fontSize: 14, color: '#0d2137', background: '#f5f5f5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </>
            )}

            {error && <p style={{ fontSize: 12, color: '#e53935', marginBottom: 12 }}>{error}</p>}

            <button
              onClick={step === 'email' ? handleCheckEmail : step === 'set-password' ? handleSetPassword : handleLogin}
              disabled={loading}
              style={{ width: '100%', padding: 14, background: '#0d2137', color: '#00e676', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Memproses...' : step === 'email' ? 'Lanjut' : step === 'set-password' ? 'Buat Password & Masuk →' : 'Masuk ke Dashboard →'}
            </button>

            {step !== 'email' && (
              <button onClick={() => { setStep('email'); setPassword(''); setError('') }}
                style={{ width: '100%', marginTop: 10, padding: '10px', background: 'none', border: 'none', fontSize: 12, color: '#999', cursor: 'pointer' }}>
                ← Ganti email
              </button>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 16 }}>
          Sudah punya akun?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#0d2137', fontWeight: 700, cursor: 'pointer' }}>Masuk</span>
        </p>
      </div>
    </div>
  )
}
