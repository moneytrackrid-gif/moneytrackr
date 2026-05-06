import { useState } from 'react'
import { useData } from '../context/DataContext'
import { Plus, Trash2, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react'

const fmt = (n) => `Rp ${n.toLocaleString('id-ID')}`

const CATEGORIES = [
  { label: 'Langganan', icon: '📺' },
  { label: 'Tagihan', icon: '⚡' },
  { label: 'Asuransi', icon: '🛡️' },
  { label: 'Cicilan', icon: '🏦' },
  { label: 'Lainnya', icon: '📋' },
]

const PRESETS = [
  { name: 'Netflix', icon: '📺', category: 'Langganan', amount: 54000 },
  { name: 'Spotify', icon: '🎵', category: 'Langganan', amount: 29000 },
  { name: 'YouTube Premium', icon: '▶️', category: 'Langganan', amount: 32000 },
  { name: 'PLN Listrik', icon: '⚡', category: 'Tagihan', amount: 0 },
  { name: 'PDAM Air', icon: '💧', category: 'Tagihan', amount: 0 },
  { name: 'Internet', icon: '🌐', category: 'Tagihan', amount: 0 },
  { name: 'Gym', icon: '💪', category: 'Langganan', amount: 0 },
]

export default function Recurring() {
  const { recurringList, addRecurring, updateRecurring, deleteRecurring, addTransaction } = useData()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', icon: '📋', amount: '', category: 'Langganan', billing_date: 1 })
  const [saving, setSaving] = useState(false)

  const totalMonthly = recurringList.filter(r => r.active).reduce((s, r) => s + r.amount, 0)

  const handleSave = async () => {
    if (!form.name || !form.amount) return
    setSaving(true)
    await addRecurring({ ...form, amount: Number(form.amount) })
    setForm({ name: '', icon: '📋', amount: '', category: 'Langganan', billing_date: 1 })
    setSaving(false)
    setShowModal(false)
  }

  const handlePayNow = async (item) => {
    await addTransaction({
      type: 'expense',
      name: item.name,
      amount: item.amount,
      category: item.category,
      icon: item.icon,
      date: new Date().toISOString(),
    })
    await updateRecurring(item.id, { last_paid: new Date().toISOString() })
    alert(`✅ ${item.name} dicatat sebagai pengeluaran!`)
  }

  const applyPreset = (p) => {
    setForm(f => ({ ...f, name: p.name, icon: p.icon, category: p.category, amount: p.amount || '' }))
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>Tagihan & Langganan</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Recurring</h1>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: 'var(--mint)', color: 'var(--navy)', border: 'none', borderRadius: 10,
          padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)',
        }}>
          <Plus size={14} /> Tambah
        </button>
      </div>

      {/* Summary card */}
      <div style={{
        background: 'var(--navy)', borderRadius: 16, padding: '20px 24px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Total tagihan aktif / bulan</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>{fmt(totalMonthly)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Aktif</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--mint)' }}>{recurringList.filter(r => r.active).length}</p>
        </div>
      </div>

      {/* List */}
      {recurringList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: 14, fontWeight: 600 }}>Belum ada tagihan rutin</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Tambahkan Netflix, listrik, internet, dll.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recurringList.map(item => {
            const today = new Date().getDate()
            const daysLeft = item.billing_date >= today ? item.billing_date - today : (30 - today + item.billing_date)
            const isDueSoon = daysLeft <= 3
            return (
              <div key={item.id} style={{
                background: 'var(--card)', border: `1px solid ${isDueSoon && item.active ? 'rgba(255,165,0,0.3)' : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: item.active ? 1 : 0.5,
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{item.name}</p>
                    {isDueSoon && item.active && <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(255,165,0,0.15)', color: '#ff9500', padding: '2px 7px', borderRadius: 20 }}>JATUH TEMPO {daysLeft === 0 ? 'HARI INI' : `${daysLeft}hr lagi`}</span>}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {item.category} · Tgl {item.billing_date} tiap bulan
                    {item.last_paid && ` · Terakhir bayar ${new Date(item.last_paid).toLocaleDateString('id-ID')}`}
                  </p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', flexShrink: 0 }}>{fmt(item.amount)}</p>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {item.active && (
                    <button onClick={() => handlePayNow(item)} style={{
                      background: 'var(--mint-dim)', color: 'var(--mint-text)', border: 'none',
                      borderRadius: 7, padding: '5px 10px', fontSize: 10, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'var(--font)',
                    }}>Bayar</button>
                  )}
                  <button onClick={() => updateRecurring(item.id, { active: !item.active })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {item.active ? <ToggleRight size={20} color="var(--mint)" /> : <ToggleLeft size={20} />}
                  </button>
                  <button onClick={() => deleteRecurring(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--card)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 440 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Tambah Tagihan Rutin</h2>

            {/* Presets */}
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Pilih cepat</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => applyPreset(p)} style={{
                  background: form.name === p.name ? 'var(--mint-dim)' : 'var(--white)',
                  border: `1px solid ${form.name === p.name ? 'var(--mint)' : 'var(--border)'}`,
                  borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', color: 'var(--text)', fontFamily: 'var(--font)',
                }}>
                  {p.icon} {p.name}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 8 }}>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px', fontSize: 20, textAlign: 'center', color: 'var(--text)', fontFamily: 'var(--font)' }} />
                <input placeholder="Nama tagihan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)' }} />
              </div>
              <input placeholder="Jumlah (Rp)" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)' }}>
                  {CATEGORIES.map(c => <option key={c.label}>{c.label}</option>)}
                </select>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Tanggal jatuh tempo</label>
                  <input type="number" min={1} max={31} value={form.billing_date} onChange={e => setForm(f => ({ ...f, billing_date: Number(e.target.value) }))}
                    style={{ width: '100%', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text)', fontFamily: 'var(--font)' }}>Batal</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: 'var(--mint)', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--navy)', fontFamily: 'var(--font)' }}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
