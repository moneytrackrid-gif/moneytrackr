import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const orderId = localStorage.getItem('mt_order_id')

  useEffect(() => {
    // Pre-fill email dari Midtrans
    const savedEmail = localStorage.getItem('mt_email')
    if (savedEmail) setEmail(savedEmail)
    // Kalau ga ada order_id, redirect ke landing
    if (!localStorage.getItem('mt_order_id')) navigate('/')
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Nama harus diisi'); return }
    if (password.length < 6) { setError('Password minimal 6 karakter'); return }
    setLoading(true)
    setError('')

    try {
      // Buat akun
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (signUpError) throw signUpError

      const userId = data.user?.id
      if (!userId) throw new Error('Gagal membuat akun')

      // Tunggu sebentar agar trigger Supabase selesai
      await new Promise(r => setTimeout(r, 1000))

      // Aktifkan subscription
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 3)
      await supabase.from('profiles').update({
        subscription_status: 'active',
        subscription_end_date: endDate.toISOString()
      }).eq('id', userId)

      // Bersihkan localStorage
      localStorage.removeItem('mt_order_id')
      localStorage.removeItem('mt_email')

      // Masuk dashboard
      navigate('/dashboard')

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', background: '#0d2137', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 5vw' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, background: '#00e676', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#0d2137' }}>mt</div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>money<span style={{ color: '#00e676' }}>trackr</span></span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#00e676' }}>
          ✅ Pembayaran berhasil!
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0d2137', marginBottom: 6, letterSpacing: -0.5 }}>Buat akunmu</h1>
        <p style={{ fontSize: 14, color: '#7a9ab8', marginBottom: 28 }}>Satu langkah lagi untuk masuk ke dashboard!</p>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0d2137', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Nama</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama kamu"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #eef2ff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#0d2137' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0d2137', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@kamu.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #eef2ff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#0d2137', background: email ? '#f8faff' : '#fff' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0d2137', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #eef2ff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#0d2137' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#c00' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? '#ccc' : '#0d2137', color: '#00e676', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            {loading ? 'Membuat akun...' : 'Masuk ke Dashboard →'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: '#7a9ab8', textAlign: 'center', marginTop: 16 }}>
          Sudah punya akun?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#00b85c', fontWeight: 700, cursor: 'pointer' }}>Masuk</span>
        </p>
      </div>

      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>Subscription aktif 3 bulan dari sekarang 🎉</p>
    </div>
  )
}
