import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { User, Lock, Wallet, Check } from 'lucide-react'

export default function Settings() {
  const { user, rawUser } = useAuth()
  const { wallet, updateWallet } = useData()
  const [tab, setTab] = useState('profile')
  const [name, setName] = useState(user?.name || '')
  const [walletName, setWalletName] = useState(wallet?.name || '')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (tab === 'wallet' && wallet) {
      await updateWallet({ name: walletName })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'wallet', label: 'Dompet', icon: Wallet },
    { id: 'security', label: 'Keamanan', icon: Lock },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Pengaturan</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Kelola akun dan preferensimu</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Sidebar tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
              background: tab === t.id ? 'var(--mint-dim)' : 'transparent',
              color: tab === t.id ? 'var(--mint-text)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400, textAlign: 'left',
            }}>
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14, padding: 24 }}>
          {tab === 'profile' && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Informasi Profil</h2>
              
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{user?.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{rawUser?.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Nama</label>
                  <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" />
                </div>
                <div>
                  <label style={lbl}>Email</label>
                  <input style={{ ...inp, opacity: 0.6, cursor: 'not-allowed' }} value={rawUser?.email || ''} disabled />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Email tidak bisa diubah</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'wallet' && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Pengaturan Dompet</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Nama Dompet</label>
                  <input style={inp} value={walletName} onChange={e => setWalletName(e.target.value)} placeholder="Nama dompet" />
                </div>
                <div>
                  <label style={lbl}>Saldo Saat Ini</label>
                  <input style={{ ...inp, opacity: 0.6, cursor: 'not-allowed' }} value={`Rp ${(wallet?.balance || 0).toLocaleString('id-ID')}`} disabled />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Saldo dikelola otomatis dari transaksi</p>
                </div>
                <div>
                  <label style={lbl}>Tipe Dompet</label>
                  <select style={inp} value={wallet?.type || 'Tabungan'} onChange={e => updateWallet({ type: e.target.value })}>
                    {['Tabungan', 'Giro', 'Cash', 'E-wallet', 'Investasi'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Keamanan Akun</h2>
              <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--mint-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={16} color="var(--mint-text)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Password</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Terakhir diubah: tidak diketahui</p>
                  </div>
                  <button style={{ background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    Ubah
                  </button>
                </div>
              </div>
              <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,59,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} color="#ff3b30" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#ff3b30' }}>Hapus Akun</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Semua data akan dihapus permanen</p>
                  </div>
                  <button style={{ background: 'rgba(255,59,48,0.08)', color: '#ff3b30', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab !== 'security' && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '0.5px solid var(--border)' }}>
              <button onClick={handleSave} style={{
                background: saved ? 'var(--mint-dim)' : 'var(--navy)', color: saved ? 'var(--mint-text)' : 'var(--mint)',
                border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {saved ? <><Check size={14} /> Tersimpan!</> : 'Simpan Perubahan'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inp = { width: '100%', padding: '10px 13px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text)', background: 'var(--white)', fontFamily: 'var(--font)', outline: 'none', boxSizing: 'border-box' }
