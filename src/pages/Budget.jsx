import { useState } from 'react'
import { useData } from '../context/DataContext'
import { Trash2, Check } from 'lucide-react'

const fmt = (n) => n >= 1000000 ? `Rp ${(n/1000000).toFixed(1)} jt` : `Rp ${(n/1000).toFixed(0)} rb`
const fmtFull = (n) => `Rp ${n.toLocaleString('id-ID')}`

const ALL_CATS = [
  { label: 'Makan', icon: '🍜' }, { label: 'Transportasi', icon: '🚗' },
  { label: 'Belanja', icon: '🛒' }, { label: 'Hiburan', icon: '🎬' },
  { label: 'Tagihan', icon: '⚡' }, { label: 'Kesehatan', icon: '💊' },
  { label: 'Pendidikan', icon: '📚' }, { label: 'Tabungan', icon: '🎯' },
  { label: 'Lainnya', icon: '📦' },
]

const PCTS = { Makan: 0.3, Transportasi: 0.1, Belanja: 0.1, Hiburan: 0.05, Tagihan: 0.15, Kesehatan: 0.05, Pendidikan: 0.05, Tabungan: 0.1, Lainnya: 0.1 }

export default function Budget() {
  const { budgets, saveBudgets, getBudgetUsed } = useData()
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [income, setIncome] = useState('')
  const [method, setMethod] = useState('custom')
  const [draft, setDraft] = useState([])

  const openWizard = () => {
    // Custom: mulai dari 0 semua. Percentage: mulai dari semua cats dengan 0
    setDraft(ALL_CATS.map((c, i) => ({ id: 'b' + i, category: c.label, icon: c.icon, limit: 0 })))
    setWizardStep(0)
    setShowWizard(true)
  }

  const applyPercentage = () => {
    const inc = parseInt(income.replace(/\D/g, '')) || 0
    setDraft(ALL_CATS.map((c, i) => ({ id: 'b' + i, category: c.label, icon: c.icon, limit: Math.round(inc * (PCTS[c.label] || 0.05)) })))
  }

  const updateDraftLimit = (idx, val) => {
    const raw = parseInt(val.replace(/\D/g, '')) || 0
    setDraft(prev => prev.map((b, i) => i === idx ? { ...b, limit: raw } : b))
  }

  const removeDraft = (idx) => setDraft(prev => prev.filter((_, i) => i !== idx))

  const addDraftCat = (cat) => {
    if (draft.find(b => b.category === cat.label)) return
    setDraft(prev => [...prev, { id: 'b' + Date.now(), category: cat.label, icon: cat.icon, limit: 0 }])
  }

  const finishWizard = () => {
    saveBudgets(draft.filter(b => b.limit > 0))
    setShowWizard(false)
  }

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const totalUsed = budgets.reduce((s, b) => s + getBudgetUsed(b.category), 0)

  // Sisa budget dari draft (untuk tampilan real-time di wizard)
  const draftTotal = draft.reduce((s, b) => s + b.limit, 0)

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Budget</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Kontrol pengeluaran per kategori</p>
        </div>
        <button onClick={openWizard} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
          ⚙️ Setup Budget
        </button>
      </div>

      <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-xl)', padding: '22px 26px', marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Budget', value: totalBudget, color: '#fff' },
          { label: 'Sudah Dipakai', value: totalUsed, color: totalUsed > totalBudget ? '#ff6b6b' : 'var(--mint)' },
          { label: 'Sisa Budget', value: Math.max(0, totalBudget - totalUsed), color: 'rgba(255,255,255,0.7)' },
        ].map(s => (
          <div key={s.label}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{fmt(s.value)}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {budgets.map(b => {
          const used = getBudgetUsed(b.category)
          const pct = b.limit > 0 ? Math.min(100, Math.round((used / b.limit) * 100)) : 0
          const isOver = pct >= 100
          const isWarn = pct >= 80 && !isOver
          const barColor = isOver ? 'var(--danger)' : isWarn ? 'var(--warn)' : 'var(--mint)'
          return (
            <div key={b.id} style={{ background: 'var(--card)', border: `0.5px solid ${isOver ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, background: isOver ? 'var(--danger-bg)' : 'var(--white)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{b.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{b.category}</p>
                  <p style={{ fontSize: 11, color: isOver ? 'var(--danger)' : 'var(--text-muted)' }}>{fmtFull(used)} / {fmtFull(b.limit)}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: barColor }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--white)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 3, transition: 'width 0.6s ease' }} />
              </div>
              {isOver && <p style={{ fontSize: 11, color: 'var(--danger)', marginTop: 8, fontWeight: 600 }}>⚠️ Over budget {fmtFull(used - b.limit)}</p>}
              {isWarn && <p style={{ fontSize: 11, color: 'var(--warn)', marginTop: 8, fontWeight: 600 }}>Hampir habis, sisa {fmtFull(b.limit - used)}</p>}
            </div>
          )
        })}
      </div>

      {showWizard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,33,55,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-xl)', width: 500, maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            {/* Steps */}
            <div style={{ padding: '20px 24px', borderBottom: '0.5px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Metode', 'Penghasilan', 'Atur Limit'].map((s, i) => (
                  <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: wizardStep >= i ? 'var(--navy)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: wizardStep >= i ? 'var(--mint)' : 'var(--text-muted)' }}>
                      {wizardStep > i ? <Check size={12} /> : i + 1}
                    </div>
                    <span style={{ fontSize: 10, color: wizardStep >= i ? 'var(--text)' : 'var(--text-muted)', fontWeight: 600 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
              {/* Step 0: Method */}
              {wizardStep === 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Pilih metode budgeting</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Kamu bisa pakai persentase otomatis atau atur manual.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { id: 'percentage', icon: '📊', title: 'Persentase otomatis', desc: 'Budget dihitung dari penghasilan kamu' },
                      { id: 'custom', icon: '✏️', title: 'Atur Manual', desc: 'Tentukan sendiri limit tiap kategori dari nol' },
                    ].map(m => (
                      <div key={m.id} onClick={() => setMethod(m.id)} style={{ padding: '16px', border: `1.5px solid ${method === m.id ? 'var(--mint)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: method === m.id ? 'var(--mint-dim)' : 'var(--white)', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 22 }}>{m.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{m.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.desc}</p>
                        </div>
                        {method === m.id && <Check size={16} color="var(--mint-text)" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Income */}
              {wizardStep === 1 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                    {method === 'percentage' ? 'Berapa penghasilan bulananmu?' : 'Penghasilan bulanan (opsional)'}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                    {method === 'percentage' ? 'Budget otomatis dihitung dari penghasilan kamu.' : 'Dipakai untuk menampilkan sisa budget yang bisa dialokasikan.'}
                  </p>
                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>Rp</span>
                    <input type="text" value={income} onChange={e => { const raw = e.target.value.replace(/\D/g,''); setIncome(raw ? parseInt(raw).toLocaleString('id-ID') : '') }}
                      placeholder="0" autoFocus style={{ width: '100%', padding: '12px 14px 12px 48px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 22, fontWeight: 700, color: 'var(--text)', background: 'var(--white)', fontFamily: 'var(--font)', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  {income && (
                    <div style={{ padding: 14, background: 'var(--mint-dim)', borderRadius: 'var(--radius-md)', border: '0.5px solid rgba(0,230,118,0.3)' }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--mint-text)', marginBottom: 8 }}>
                        {method === 'percentage' ? 'Preview budget otomatis:' : 'Sisa budget yang bisa dialokasikan:'}
                      </p>
                      {method === 'percentage' ? (
                        ALL_CATS.map(c => {
                          const inc = parseInt(income.replace(/\D/g,'')) || 0
                          return <p key={c.label} style={{ fontSize: 12, color: 'var(--mint-text)', marginBottom: 3 }}>{c.icon} {c.label}: {fmtFull(Math.round(inc * (PCTS[c.label] || 0.05)))}</p>
                        })
                      ) : (
                        <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--mint-text)' }}>
                          {fmtFull(parseInt(income.replace(/\D/g,'')) || 0)} tersedia untuk dialokasikan
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Edit limits */}
              {wizardStep === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Atur limit tiap kategori</h3>
                    {income && (
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Sisa dari penghasilan</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: (parseInt(income.replace(/\D/g,'')) - draftTotal) >= 0 ? 'var(--mint-text)' : 'var(--danger)' }}>
                          {fmtFull(Math.abs(parseInt(income.replace(/\D/g,'')) - draftTotal))}
                          {(parseInt(income.replace(/\D/g,'')) - draftTotal) < 0 ? ' (over)' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Total dialokasikan: <strong style={{ color: 'var(--text)' }}>{fmtFull(draftTotal)}</strong></p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {draft.map((b, idx) => (
                      <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{b.category}</span>
                        <div style={{ position: 'relative', width: 150 }}>
                          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--text-muted)' }}>Rp</span>
                          <input type="text" value={b.limit > 0 ? b.limit.toLocaleString('id-ID') : ''} placeholder="0" onChange={e => updateDraftLimit(idx, e.target.value)}
                            style={{ width: '100%', padding: '7px 10px 7px 30px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', background: 'var(--card)', fontFamily: 'var(--font)', outline: 'none' }} />
                        </div>
                        <button onClick={() => removeDraft(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--border)', padding: 4 }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--border)'}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>+ Tambah kategori</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {ALL_CATS.filter(c => !draft.find(b => b.category === c.label)).map(c => (
                      <button key={c.label} onClick={() => addDraftCat(c)} style={{ padding: '5px 12px', borderRadius: 20, border: '0.5px solid var(--border)', background: 'var(--white)', color: 'var(--text-sub)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        {c.icon} {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 10 }}>
              {wizardStep > 0 && <button onClick={() => setWizardStep(s => s - 1)} style={{ padding: '11px 20px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--white)', color: 'var(--text-sub)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>← Kembali</button>}
              <button onClick={() => setShowWizard(false)} style={{ padding: '11px 20px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>Batal</button>
              <button onClick={() => {
                if (wizardStep === 1 && method === 'percentage') applyPercentage()
                if (wizardStep < 2) setWizardStep(s => s + 1)
                else finishWizard()
              }} style={{ flex: 1, padding: 11, background: 'var(--navy)', color: 'var(--mint)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                {wizardStep < 2 ? 'Lanjut →' : '✓ Simpan Budget'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
