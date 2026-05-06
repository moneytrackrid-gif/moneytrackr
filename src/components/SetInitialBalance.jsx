import { useState } from 'react'
import { useData } from '../context/DataContext'

export default function SetInitialBalance({ onClose }) {
  const { addTransaction } = useData()
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAmount = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    setAmount(raw ? parseInt(raw).toLocaleString('id-ID') : '')
  }

  const handleSave = async () => {
    const raw = parseInt(amount.replace(/\D/g, '') || '0')
    if (!raw) { onClose(); return }
    setSaving(true)
    await addTransaction({
      type: 'income',
      name: 'Saldo Awal',
      amount: raw,
      category: 'Saldo Awal',
      icon: '🏦',
      date: new Date().toISOString(),
    })
    setSaving(false)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 400, border: '0.5px solid var(--border)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--mint-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>🏦</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Set Saldo Awal</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5 }}>Masukkan jumlah uang yang kamu punya sekarang. Ini akan dicatat sebagai pemasukan awal.</p>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Saldo saat ini</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-muted)', fontWeight: 700 }}>Rp</span>
            <input type="text" value={amount} onChange={handleAmount} placeholder="0" inputMode="numeric" autoFocus
              style={{ width: '100%', padding: '14px 14px 14px 48px', border: '1px solid var(--border)', borderRadius: 12, fontSize: 26, fontWeight: 800, color: 'var(--text)', background: 'var(--white)', fontFamily: 'var(--font)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: 14, background: 'var(--mint)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', color: 'var(--navy)', fontFamily: 'var(--font)' }}>
            {saving ? 'Menyimpan...' : 'Simpan Saldo'}
          </button>
          <button onClick={onClose} style={{ padding: '14px 18px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font)' }}>Lewati</button>
        </div>
      </div>
    </div>
  )
}
