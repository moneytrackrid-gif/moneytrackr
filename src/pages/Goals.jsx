import { useState } from 'react'
import { useData } from '../context/DataContext'
import { Plus, Trash2, Target } from 'lucide-react'

const fmt = (n) => `Rp ${n.toLocaleString('id-ID')}`
const fmtShort = (n) => n >= 1000000 ? `Rp ${(n/1000000).toFixed(1)} jt` : `Rp ${(n/1000).toFixed(0)} rb`

const ICONS = ['🛡️','🏖️','💻','🏠','🚗','✈️','💍','📚','💪','🎓','🏥','🎮','📱','🎸','🌏']
const COLORS = ['#0d2137','#1a3a5c','#00e676','#064a22','#1b4332','#0a2a2a','#2d6a4f','#155724']

export default function Goals() {
  const { goals, addGoal, deleteGoal, topUpGoal, wallet } = useData()
  const [showAdd, setShowAdd] = useState(false)
  const [showTopUp, setShowTopUp] = useState(null)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [form, setForm] = useState({ name: '', icon: '🎯', target: '', deadline: '', color: COLORS[0] })

  const handleAdd = () => {
    const target = parseInt(form.target.replace(/\D/g, ''))
    if (!form.name || !target) return
    addGoal({ name: form.name, icon: form.icon, target, deadline: form.deadline, color: form.color, saved: 0 })
    setShowAdd(false)
    setForm({ name: '', icon: '🎯', target: '', deadline: '', color: COLORS[0] })
  }

  const handleTopUp = (goalId) => {
    const amount = parseInt(topUpAmount.replace(/\D/g, ''))
    if (!amount || amount <= 0) return
    topUpGoal(goalId, amount)
    setShowTopUp(null)
    setTopUpAmount('')
  }

  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0)

  const getDaysLeft = (deadline) => {
    if (!deadline) return null
    const diff = Math.ceil((new Date(deadline) - Date.now()) / 86400000)
    return diff
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Goals</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Target tabungan dengan deadline</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--mint)', color: 'var(--navy)', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
          <Plus size={15} /> Goal Baru
        </button>
      </div>

      {/* Summary */}
      <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-xl)', padding: '22px 26px', marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[
          { label: 'Total Target', value: totalTarget },
          { label: 'Sudah Tersimpan', value: totalSaved },
          { label: 'Sisa Menabung', value: totalTarget - totalSaved },
        ].map((s, i) => (
          <div key={s.label}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: i === 1 ? 'var(--mint)' : '#fff', letterSpacing: -0.5 }}>{fmtShort(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🎯</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Belum ada goals</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Buat goal pertamamu dan mulai menabung!</p>
          <button onClick={() => setShowAdd(true)} style={{ background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 'var(--radius-md)', padding: '11px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>+ Buat Goal</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {goals.map(g => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100))
            const daysLeft = getDaysLeft(g.deadline)
            const done = pct >= 100
            const urgent = daysLeft !== null && daysLeft <= 30 && !done
            return (
              <div key={g.id} style={{ background: 'var(--card)', border: `0.5px solid ${done ? 'var(--mint)' : urgent ? 'var(--warn)' : 'var(--border)'}`, borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                {/* Card top */}
                <div style={{ background: g.color || 'var(--navy)', padding: '20px 20px 16px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 32 }}>{g.icon}</span>
                    <button onClick={() => deleteGoal(g.id)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 10, marginBottom: 2 }}>{g.name}</p>
                  {g.deadline && (
                    <p style={{ fontSize: 11, color: daysLeft !== null && daysLeft < 0 ? '#ff6b6b' : 'rgba(255,255,255,0.55)' }}>
                      {daysLeft !== null && daysLeft < 0 ? '⚠️ Deadline lewat' : daysLeft !== null ? `${daysLeft} hari lagi` : ''}
                      {g.deadline && ` · ${new Date(g.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </p>
                  )}
                </div>
                {/* Card body */}
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{fmtShort(g.saved)}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>dari {fmtShort(g.target)}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--white)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: done ? 'var(--mint)' : (g.color || 'var(--navy)'), borderRadius: 4, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: done ? 'var(--mint-text)' : 'var(--text-sub)' }}>
                      {done ? '✅ Tercapai!' : `${pct}% tercapai`}
                    </span>
                    {!done && (
                      <button onClick={() => setShowTopUp(g.id)} style={{ background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        + Nabung
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,33,55,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-xl)', width: 440, maxWidth: '100%', animation: 'scaleIn 0.2s ease' }}>
            <div style={{ padding: '18px 22px', borderBottom: '0.5px solid var(--border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Buat Goal Baru</h3>
            </div>
            <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>Nama Goal</label>
                <input style={inp} value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Contoh: Dana Darurat, Liburan..." />
              </div>
              <div>
                <label style={lbl}>Pilih Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ICONS.map(ic => (
                    <button key={ic} onClick={() => setForm(p => ({...p, icon: ic}))} style={{ width: 36, height: 36, borderRadius: 9, border: `1.5px solid ${form.icon === ic ? 'var(--mint)' : 'var(--border)'}`, background: form.icon === ic ? 'var(--mint-dim)' : 'var(--white)', fontSize: 18, cursor: 'pointer' }}>{ic}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={lbl}>Target Nominal</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--text-muted)' }}>Rp</span>
                    <input style={{ ...inp, paddingLeft: 32 }} value={form.target} onChange={e => { const r = e.target.value.replace(/\D/g,''); setForm(p => ({...p, target: r ? parseInt(r).toLocaleString('id-ID') : ''})) }} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Deadline</label>
                  <input style={inp} type="date" value={form.deadline} onChange={e => setForm(p => ({...p, deadline: e.target.value}))} />
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 22px 18px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 11, border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--white)', color: 'var(--text-sub)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>Batal</button>
              <button onClick={handleAdd} style={{ flex: 2, padding: 11, background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>Buat Goal →</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,33,55,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-xl)', width: 360, animation: 'scaleIn 0.2s ease' }}>
            <div style={{ padding: '18px 22px', borderBottom: '0.5px solid var(--border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Tambah Tabungan</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Saldo dompet: {fmt(wallet.balance)}</p>
            </div>
            <div style={{ padding: '18px 22px' }}>
              <label style={lbl}>Jumlah</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>Rp</span>
                <input autoFocus style={{ ...inp, paddingLeft: 48, fontSize: 22, fontWeight: 700 }} value={topUpAmount} onChange={e => { const r = e.target.value.replace(/\D/g,''); setTopUpAmount(r ? parseInt(r).toLocaleString('id-ID') : '') }} placeholder="0" />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {[50000, 100000, 200000, 500000].map(v => (
                  <button key={v} onClick={() => setTopUpAmount(v.toLocaleString('id-ID'))} style={{ flex: 1, padding: '6px 0', border: '0.5px solid var(--border)', borderRadius: 8, background: 'var(--white)', color: 'var(--text-sub)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    {fmtShort(v)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '12px 22px 18px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowTopUp(null); setTopUpAmount('') }} style={{ flex: 1, padding: 11, border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--white)', color: 'var(--text-sub)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>Batal</button>
              <button onClick={() => handleTopUp(showTopUp)} style={{ flex: 2, padding: 11, background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>+ Simpan ke Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const lbl = { display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inp = { width: '100%', padding: '10px 13px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text)', background: 'var(--white)', fontFamily: 'var(--font)', outline: 'none' }
