import { useState } from 'react'
import { X } from 'lucide-react'
import { useData } from '../context/DataContext'

const CATEGORIES = [
  { label: 'Makan', icon: '🍜' }, { label: 'Transportasi', icon: '🚗' },
  { label: 'Belanja', icon: '🛒' }, { label: 'Hiburan', icon: '🎬' },
  { label: 'Tagihan', icon: '⚡' }, { label: 'Kesehatan', icon: '💊' },
  { label: 'Pendidikan', icon: '📚' }, { label: 'Lainnya', icon: '📦' },
]

export default function AddTransactionModal({ onClose }) {
  const { wallet: walletData, addTransaction } = useData()
  const wallets = [walletData]
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [wallet, setWallet] = useState(wallets[0]?.name || '')
  const [category, setCategory] = useState('Makan')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleAmount = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    setAmount(raw ? parseInt(raw).toLocaleString('id-ID') : '')
  }

  const handleSubmit = () => {
    const raw = parseInt(amount.replace(/\D/g, ''))
    if (!raw) return
    const cat = CATEGORIES.find(c => c.label === category)
    addTransaction({ type, name: note || category, amount: raw, category, wallet, date, icon: cat?.icon || '📦' })
    onClose()
  }

  const tabs = [
    { key: 'expense', label: 'Pengeluaran' },
    { key: 'income', label: 'Pemasukan' },
    { key: 'transfer', label: 'Transfer' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,33,55,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-xl)', width: 420, maxWidth: '100%', border: '0.5px solid var(--border)', animation: 'scaleIn 0.2s ease' }}>
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Catat Transaksi</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'var(--white)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: '16px 20px' }}>
          {/* Type tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'var(--white)', padding: 4, borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setType(t.key)} style={{
                flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font)', transition: 'all 0.15s',
                background: type === t.key ? (t.key === 'income' ? 'var(--mint-dim)' : t.key === 'expense' ? 'var(--navy)' : 'var(--white)') : 'transparent',
                color: type === t.key ? (t.key === 'income' ? 'var(--mint-text)' : t.key === 'expense' ? 'var(--mint)' : 'var(--text)') : 'var(--text-muted)',
                boxShadow: type === t.key ? 'var(--shadow-sm)' : 'none',
              }}>{t.label}</button>
            ))}
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Jumlah</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>Rp</span>
              <input style={{ ...inp, paddingLeft: 48, fontSize: 22, fontWeight: 700 }} type="text" value={amount} onChange={handleAmount} placeholder="0" inputMode="numeric" autoFocus />
            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Keterangan</label>
            <input style={inp} type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Contoh: makan siang, bensin..." />
          </div>

          {/* Wallet + Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label style={lbl}>Dompet</label>
              <select style={inp} value={wallet} onChange={e => setWallet(e.target.value)}>
                {wallets.map(w => <option key={w.id}>{w.name}</option>)}
                <option>Cash</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Tanggal</label>
              <input style={inp} type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          {/* Category (hide for transfer) */}
          {type !== 'transfer' && (
            <div style={{ marginBottom: 4 }}>
              <label style={lbl}>Kategori</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {CATEGORIES.map(c => (
                  <button key={c.label} onClick={() => setCategory(c.label)} style={{
                    padding: '8px 4px', borderRadius: 'var(--radius-md)', border: `0.5px solid ${category === c.label ? 'var(--mint)' : 'var(--border)'}`,
                    background: category === c.label ? 'var(--mint-dim)' : 'var(--white)',
                    cursor: 'pointer', fontSize: 10, fontWeight: 500, fontFamily: 'var(--font)',
                    color: category === c.label ? 'var(--mint-text)' : 'var(--text-sub)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all 0.12s',
                  }}>
                    <span style={{ fontSize: 16 }}>{c.icon}</span>{c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px 18px', borderTop: '0.5px solid var(--border)', background: 'var(--white)', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)' }}>
          <button onClick={handleSubmit} style={{ width: '100%', padding: 13, background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            Simpan {type === 'income' ? 'Pemasukan' : type === 'transfer' ? 'Transfer' : 'Pengeluaran'}
          </button>
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inp = { width: '100%', padding: '10px 13px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text)', background: 'var(--white)', fontFamily: 'var(--font)', outline: 'none' }
