import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Lock } from 'lucide-react'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Supabase otomatis handle token dari URL hash
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User sudah terverifikasi, siap set password baru
      }
    })
  }, [])

  const handleReset = async () => {
    if (!password || password.length < 6) { setError('Password minimal 6 karakter'); return }
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => { window.location.href = '/dashboard' }, 2000)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="moneytrackr" style={{ height: 48, objectFit: 'contain', margin: '0 auto 16px', display: 'block' }} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d2137', letterSpacing: -0.5, marginBottom: 6 }}>
            {done ? 'Password Berhasil Diubah! 🎉' : 'Buat Password Baru'}
          </h1>
          <p style={{ color: '#999', fontSize: 14 }}>
            {done ? 'Mengalihkan ke dashboard...' : 'Masukkan password baru untuk akunmu'}
          </p>
        </div>

        {!done && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReset()}
                placeholder="Password baru (min. 6 karakter)"
                style={{ width: '100%', padding: '13px 14px 13px 42px', border: 'none', borderRadius: 12, fontSize: 14, color: '#0d2137', background: '#f5f5f5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && <p style={{ fontSize: 12, color: '#e53935', marginBottom: 12 }}>{error}</p>}
            <button
              onClick={handleReset}
              disabled={loading}
              style={{ width: '100%', padding: 14, background: '#0d2137', color: '#00e676', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Password →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
