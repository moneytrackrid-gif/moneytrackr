import HealthScore from '../components/HealthScore'
import { useData } from '../context/DataContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const fmt = (n) => n >= 1000000 ? `${(n/1000000).toFixed(1)} jt` : n >= 1000 ? `${(n/1000).toFixed(0)} rb` : n
const fmtFull = (n) => `Rp ${n.toLocaleString('id-ID')}`

const CAT_COLORS = ['#0d2137','#1a3a5c','#00e676','#2d6a4f','#5a9070','#0a7a50','#155724','#344a30','#7fb090']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>{p.name}: {fmtFull(p.value)}</p>
      ))}
    </div>
  )
}

export default function Reports() {
  const { getMonthlyData, getCategoryBreakdown, totalIncome, totalExpense, wallet } = useData()
  const monthly = getMonthlyData()
  const catBreakdown = getCategoryBreakdown()
  const savings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0
  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '20px 16px 80px' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Laporan</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Ringkasan keuangan {currentMonth}</p>
      </div>

      <HealthScore />

      {/* KPI cards - 2 kolom di mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Pemasukan', value: fmtFull(totalIncome), sub: 'bulan ini', color: 'var(--mint-text)', bg: 'var(--mint-dim)' },
          { label: 'Pengeluaran', value: fmtFull(totalExpense), sub: 'bulan ini', color: 'var(--navy)', bg: 'var(--white)' },
          { label: 'Selisih', value: fmtFull(Math.abs(savings)), sub: savings >= 0 ? 'surplus' : 'defisit', color: savings >= 0 ? 'var(--mint-text)' : 'var(--danger)', bg: savings >= 0 ? 'var(--mint-dim)' : 'var(--danger-bg)' },
          { label: 'Saving Rate', value: `${savingsRate}%`, sub: savingsRate >= 20 ? '✅ Sehat' : '⚠️ Kurang', color: savingsRate >= 20 ? 'var(--mint-text)' : 'var(--warn)', bg: savingsRate >= 20 ? 'var(--mint-dim)' : 'var(--warn-bg)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: s.color, letterSpacing: -0.5, marginBottom: 2, wordBreak: 'break-word' }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Pemasukan vs Pengeluaran — 6 Bulan</p>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={monthly} barGap={4} barCategoryGap="35%" margin={{ top: 5, right: 5, bottom: 25, left: -10 }}>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Pemasukan" fill="var(--mint)" radius={[4,4,0,0]} />
            <Bar dataKey="expense" name="Pengeluaran" fill="var(--navy)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--mint)' }} /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pemasukan</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--navy)' }} /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pengeluaran</span></div>
        </div>
      </div>

      {/* Trend */}
      <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Tren Pengeluaran</p>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={monthly} margin={{ top: 5, right: 5, bottom: 25, left: -10 }}>
            <defs>
              <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d2137" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0d2137" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="var(--navy)" strokeWidth={2} fill="url(#gExp)" dot={false} activeDot={{ r: 4, fill: 'var(--navy)' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie */}
      <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Pengeluaran per Kategori</p>
        {catBreakdown.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 40 }}>Belum ada data</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={catBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                {catBreakdown.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => fmtFull(v)} contentStyle={{ fontSize: 11, borderRadius: 8, border: '0.5px solid var(--border)' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Detail kategori */}
      <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Detail per Kategori</p>
        </div>
        {catBreakdown.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>Belum ada pengeluaran bulan ini</p>
        ) : catBreakdown.map((c, i) => {
          const pct = totalExpense > 0 ? Math.round((c.value / totalExpense) * 100) : 0
          return (
            <div key={c.name} style={{ padding: '10px 16px', borderBottom: i < catBreakdown.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: CAT_COLORS[i % CAT_COLORS.length], flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{fmtFull(c.value)}</span>
              </div>
              <div style={{ height: 4, background: 'var(--white)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: CAT_COLORS[i % CAT_COLORS.length], borderRadius: 2 }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
