import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { supabase } from '../lib/supabase'
import { User, Lock, Wallet, Check, Eye, EyeOff } from 'lucide-react'

export default function Settings() {
  const { user, rawUser } = useAuth()
  const { wallet, updateWallet } = useData()
  const [tab, setTab] = useState('profile')

  // Profile
  const [name, setName] = useState(user?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Wallet
  const [walletName, setWalletName] = useState(wallet?.name || '')
  const [walletType, setWalletType] = useState(wallet?.type || 'Tabungan')
  const [savingWallet, setSavingWallet] = useState(false)
  const [walletSaved, setWalletSaved] = useState(false)

  // Password
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [savingPass, setSavingPass] = useState(false)
  const [passSaved, setPassSaved] = useState(false)
  const [passError, setPassError] = useState('')

  const handleSaveProfile = async () => {
    if (!name.trim()) return
    setSavingProfile(true)
    setProfileError('')
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', rawUser.id)
      if (error) throw error
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2000)
    } catch (e) {
      setProfileError('Gagal menyimpan. Coba lagi.')
    }
    setSavingProfile(false)
  }

  const handleSaveWallet = async () => {
    setSavingWallet(true)
    await updateWallet({ name: walletName, type: walletType })
    setWalletSaved(true)
    setTimeout(() => setWalletSaved(false), 2000)
    setSavingWallet(false)
  }

  const handleChangePassword = async () => {
    setPassError('')
    if (newPass.length < 6) { setPassError('Password minimal 6 karakter'); return }
    if (newPass !== confirmPass) { setPassError('Konfirmasi password tidak cocok'); return }
    setSavingPass(true)
    const { error } = await supabase.auth.updateUser({ password: newPass })
    if (error) {
      setPassError('Gagal mengubah password. Coba lagi.')
    } else {
      setPassSaved(true)
      setCurrentPass(''); setNewPass(''); setConfirmPass('')
      setTimeout(() => setPassSaved(false), 2000)
    }
    setSavingPass(false)
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
              background: tab === t.id ? 'var(--mint-dim)' : 'transparent',
              color: tab === t.id ? 'var(--mint-text)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400, textAlign: 'left',
            }}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14, padding: 24 }}>
          {tab === 'profile' && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Informasi Profil</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>
                  {name?.[0]?.toUpperCase()}
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
              {profileError && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 12 }}>{profileError}</p>}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--border)' }}>
                <button onClick={handleSaveProfile} disabled={savingProfile} style={{
                  background: profileSaved ? 'var(--mint-dim)' : 'var(--navy)', color: profileSaved ? 'var(--mint-text)' : 'var(--mint)',
                  border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {profileSaved ? <><Check size={14} /> Tersimpan!</> : savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
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
                  <select style={inp} value={walletType} onChange={e => setWalletType(e.target.value)}>
                    {['Tabungan', 'Giro', 'Cash', 'E-wallet', 'Investasi'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--border)' }}>
                <button onClick={handleSaveWallet} disabled={savingWallet} style={{
                  background: walletSaved ? 'var(--mint-dim)' : 'var(--navy)', color: walletSaved ? 'var(--mint-text)' : 'var(--mint)',
                  border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {walletSaved ? <><Check size={14} /> Tersimpan!</> : savingWallet ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Ganti Password</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={lbl}>Password Baru</label>
                  <div style={{ position: 'relative' }}>
                    <input style={{ ...inp, paddingRight: 40 }} type={showPass ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min. 6 karakter" />
                    <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={lbl}>Konfirmasi Password Baru</label>
                  <input style={inp} type={showPass ? 'text' : 'password'} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Ulangi password baru" />
                </div>
              </div>
              {passError && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 12 }}>{passError}</p>}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={handleChangePassword} disabled={savingPass} style={{
                  background: passSaved ? 'var(--mint-dim)' : 'var(--navy)', color: passSaved ? 'var(--mint-text)' : 'var(--mint)',
                  border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
                }}>
                  {passSaved ? <><Check size={14} /> Password Diubah!</> : savingPass ? 'Menyimpan...' : 'Ubah Password'}
                </button>
                <div style={{ background: 'rgba(255,59,48,0.06)', border: '0.5px solid rgba(255,59,48,0.2)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#ff3b30' }}>Hapus Akun</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Semua data akan dihapus permanen</p>
                  </div>
                  <button style={{ background: 'rgba(255,59,48,0.1)', color: '#ff3b30', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inp = { width: '100%', padding: '10px 13px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text)', background: 'var(--white)', fontFamily: 'var(--font)', outline: 'none', boxSizing: 'border-box' }
