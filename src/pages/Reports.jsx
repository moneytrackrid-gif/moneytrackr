import { useState } from 'react'
import { useData } from '../context/DataContext'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import HealthScore from '../components/HealthScore'

const fmtFull = (n) => `Rp ${Math.abs(n).toLocaleString('id-ID')}`
const fmt = (n) => n >= 1000000 ? `${(n/1000000).toFixed(1)} jt` : n >= 1000 ? `${(n/1000).toFixed(0)} rb` : String(n)

const CAT_COLORS = ['#0d2137','#1a3a5c','#00e676','#2d6a4f','#5a9070','#0a7a50','#155724','#344a30','#7fb090']

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']

export default function Reports() {
  const { getMonthlyData, getCategoryBreakdown, totalIncome, totalExpense, wallet, transactions } = useData()
  const [activeTab, setActiveTab] = useState('pengeluaran')
  const [monthOffset, setMonthOffset] = useState(0)

  const monthly = getMonthlyData()
  const catBreakdown = getCategoryBreakdown()
  const savings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0

  const now = new Date()
  const displayMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const monthLabel = displayMonth.toLocaleString('id-ID', { month: 'long', year: 'numeric' })

  const maxBar = Math.max(totalIncome, totalExpense, 1)

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '20px 16px 24px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Laporan</h1>

        {/* Month navigator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 12 }}>
          <button onClick={() => setMonthOffset(o => o - 1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 32, height: 32, color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, minWidth: 140, textAlign: 'center' }}>{monthLabel}</span>
          <button onClick={() => setMonthOffset(o => Math.min(0, o + 1))} style={{ background: monthOffset === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 32, height: 32, color: monthOffset === 0 ? 'rgba(255,255,255,0.3)' : '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>

        {/* Ringkasan */}
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Pemasukan</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#00e676' }}>{fmtFull(totalIncome)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Pengeluaran</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#ff6b6b' }}>{fmtFull(totalExpense)}</p>
            </div>
          </div>

          {/* Bar visual */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ height: '100%', width: `${(totalIncome/maxBar)*100}%`, background: '#00e676', borderRadius: 4 }} />
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(totalExpense/maxBar)*100}%`, background: '#ff6b6b', borderRadius: 4 }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Pemasukan Bersih</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: savings >= 0 ? '#00e676' : '#ff6b6b' }}>
              {savings >= 0 ? '+' : '-'}{fmtFull(savings)}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Health Score */}
        <HealthScore />

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16, marginTop: 16 }}>
          {[
            { label: 'Selisih', value: fmtFull(Math.abs(savings)), sub: savings >= 0 ? 'surplus' : 'defisit', color: savings >= 0 ? 'var(--mint-text)' : '#ff6b6b', bg: savings >= 0 ? 'var(--mint-dim)' : '#fff0f0' },
            { label: 'Saving Rate', value: `${savingsRate}%`, sub: savingsRate >= 20 ? '✅ Sehat' : '⚠️ Kurang', color: savingsRate >= 20 ? 'var(--mint-text)' : 'var(--warn)', bg: savingsRate >= 20 ? 'var(--mint-dim)' : 'var(--warn-bg)' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: '0.5px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tab Pemasukan / Pengeluaran */}
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)' }}>
            {['pengeluaran', 'pemasukan'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: activeTab === tab ? 'var(--navy)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--navy)' : '2px solid transparent', fontFamily: 'var(--font)' }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ padding: '16px' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Total {activeTab}</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: activeTab === 'pengeluaran' ? '#ff6b6b' : 'var(--mint-text)', marginBottom: 16 }}>
              {fmtFull(activeTab === 'pengeluaran' ? totalExpense : totalIncome)}
            </p>

            {/* Pie chart */}
            {catBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={catBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={2} label={false} labelLine={false}>
                      {catBreakdown.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => fmtFull(v)} contentStyle={{ fontSize: 11, borderRadius: 8, border: '0.5px solid var(--border)' }} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {catBreakdown.map((c, i) => {
                    const pct = totalExpense > 0 ? Math.round((c.value / totalExpense) * 100) : 0
                    return (
                      <div key={c.name} style={{ padding: '10px 0', borderBottom: i < catBreakdown.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 2, background: CAT_COLORS[i % CAT_COLORS.length], flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', flex: 1 }}>{c.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 8 }}>{pct}%</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{fmtFull(c.value)}</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--bg)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: CAT_COLORS[i % CAT_COLORS.length], borderRadius: 2 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>Belum ada data</p>
            )}
          </div>
        </div>

        {/* Trend 6 bulan */}
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Tren 6 Bulan Terakhir</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#00e676' }} /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pemasukan</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#0d2137' }} /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pengeluaran</span></div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthly} margin={{ top: 5, right: 5, bottom: 20, left: -15 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={38} />
                <Tooltip formatter={(v, n) => [fmtFull(v), n]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="income" name="Pemasukan" fill="#00e676" radius={[3,3,0,0]} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#0d2137" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>

        </div>

      </div>
    </div>
  )
}
