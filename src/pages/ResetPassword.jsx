import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Lock } from 'lucide-react'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Handle token dari URL hash
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        }).then(({ error }) => {
          if (error) {
            setError('Link tidak valid atau sudah expired. Minta reset password lagi.')
          } else {
            setReady(true)
          }
        })
      }
    }

    // Juga listen auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })

    return () => subscription.unsubscribe()
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
            {done ? 'Password Berhasil! 🎉' : 'Buat Password Baru'}
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
              disabled={loading || !ready}
              style={{ width: '100%', padding: 14, background: ready ? '#0d2137' : '#ccc', color: '#00e676', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: (loading || !ready) ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? 'Menyimpan...' : !ready ? 'Memverifikasi...' : 'Simpan Password →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
