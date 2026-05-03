import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { Plus, TrendingUp, TrendingDown, PiggyBank, ChevronRight, Crown } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const fmt = (n) => n >= 1000000 ? `Rp ${(n/1000000).toFixed(1)} jt` : n >= 1000 ? `Rp ${(n/1000).toFixed(0)} rb` : `Rp ${n.toLocaleString('id-ID')}`
const fmtFull = (n) => `Rp ${n.toLocaleString('id-ID')}`


export default function Dashboard() {
  const { user, isPro } = useAuth()
  const { wallet, totalIncome, totalExpense, transactions, budgets, getBudgetUsed } = useData()
  const totalBalance = wallet?.balance || 0
  const wallets = wallet ? [wallet] : []
  const [showModal, setShowModal] = useState(false)

  const chartData = (() => {
  const days = []
  for (let i = 7; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const label = d.getDate().toString()
    const dayTx = transactions.filter(t => new Date(t.date).toDateString() === d.toDateString())
    days.push({ day: label, income: dayTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), expense: dayTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) })
  }
  return days
})()
  const recentTx = transactions.slice(0, 5)
  const now = new Date()
  const timeGreet = now.getHours() < 12 ? 'Selamat pagi' : now.getHours() < 17 ? 'Selamat siang' : 'Selamat malam'

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{timeGreet}, {user?.name?.split(' ')[0]} 👋</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ padding: '7px 14px', borderRadius: 20, border: '0.5px solid var(--border)', background: 'var(--card)', fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
            ← Mei 2025 →
          </div>
        </div>
      </div>

      {/* Balance card */}
      <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-xl)', padding: '24px 26px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, background: 'rgba(0,230,118,0.07)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -40, right: 60, width: 90, height: 90, background: 'rgba(0,230,118,0.04)', borderRadius: '50%' }} />
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 6, position: 'relative' }}>Total Saldo Semua Dompet</p>
        <p style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: -1.5, marginBottom: 16, position: 'relative' }}>{fmtFull(totalBalance)}</p>
        <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
          {[
            { label: 'Pemasukan', value: totalIncome, dot: 'var(--mint)' },
            { label: 'Pengeluaran', value: totalExpense, dot: 'rgba(255,255,255,0.3)' },
          ].map(p => (
            <div key={p.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{p.label} {fmt(p.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Pemasukan', value: totalIncome, icon: TrendingUp, badge: '+12%', up: true, bg: 'var(--mint-dim)', iconColor: 'var(--mint-text)' },
          { label: 'Pengeluaran', value: totalExpense, icon: TrendingDown, badge: '−8%', up: false, bg: 'var(--white)', iconColor: 'var(--text-sub)' },
          { label: 'Ditabung', value: 500000, icon: PiggyBank, badge: '+5%', up: true, bg: 'var(--mint-dim)', iconColor: 'var(--mint-text)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={15} color={s.iconColor} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: s.up ? 'var(--mint-dim)' : 'var(--warn-bg)', color: s.up ? 'var(--mint-text)' : 'var(--warn)' }}>{s.badge}</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{s.label}</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: -0.5 }}>{fmt(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Chart + Budget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 14, marginBottom: 14 }}>
        {/* Chart */}
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Pengeluaran 7 Hari</p>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gMint" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e676" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={v => fmtFull(v)} contentStyle={{ fontSize: 11, borderRadius: 8, border: '0.5px solid var(--border)', background: 'var(--card)' }} />
              <Area type="monotone" dataKey="expense" stroke="var(--mint)" strokeWidth={2} fill="url(#gMint)" dot={false} activeDot={{ r: 4, fill: 'var(--mint)' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Budget */}
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Budget</p>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>Atur →</span>
          </div>
          <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {budgets.map(b => {
              const used = getBudgetUsed(b.category)
              const pct = Math.min(100, Math.round((used / b.limit) * 100))
              const color = pct >= 100 ? 'var(--danger)' : pct >= 80 ? 'var(--warn)' : 'var(--mint)'
              return (
                <div key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{b.category}</span>
                    <span style={{ fontSize: 10, color: pct >= 100 ? 'var(--danger)' : 'var(--text-muted)' }}>{fmt(used)} / {fmt(b.limit)}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--white)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Transactions + Wallets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 14 }}>
        {/* Recent tx */}
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Transaksi Terakhir</p>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>Lihat semua →</span>
          </div>
          {recentTx.map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 16px', borderBottom: i < recentTx.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: tx.type === 'income' ? 'var(--mint-dim)' : 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{tx.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tx.category} · {tx.wallet}</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: tx.type === 'income' ? 'var(--mint-text)' : 'var(--navy-mid)', flexShrink: 0 }}>
                {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Wallets */}
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Dompet Saya</p>
            <span style={{ fontSize: 11, color: 'var(--mint)', cursor: 'pointer', fontWeight: 600 }}>+ Tambah</span>
          </div>
          {wallets.map((w, i) => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 16px', borderBottom: i < wallets.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{w.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{w.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{w.type}</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{fmt(w.balance)}</span>
            </div>
          ))}

          {/* Pro upsell */}
          {!isPro && (
            <div style={{ margin: '10px 12px', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Crown size={12} color="var(--mint)" />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--mint)' }}>Fitur PRO</span>
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Lacak aset & net worth, Financial Health Score</p>
              <button style={{ background: 'var(--mint)', color: 'var(--navy)', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>Upgrade PRO →</button>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => setShowModal(true)} style={{
        position: 'fixed', bottom: 28, right: 28, background: 'var(--mint)', color: 'var(--navy)',
        border: 'none', borderRadius: 28, padding: '12px 22px', fontSize: 13, fontWeight: 800,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 4px 20px rgba(0,230,118,0.35)', transition: 'transform 0.15s',
        fontFamily: 'var(--font)', zIndex: 100,
      }} onMouseEnter={e => e.target.style.transform='scale(1.05)'} onMouseLeave={e => e.target.style.transform='scale(1)'}>
        <Plus size={16} /> Catat Transaksi
      </button>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
