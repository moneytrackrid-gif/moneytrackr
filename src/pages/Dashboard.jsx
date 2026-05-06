import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { Plus, TrendingUp, TrendingDown, PiggyBank, Crown, Camera } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'
import BudgetAlert from '../components/BudgetAlert'
import ReceiptScanner from '../components/ReceiptScanner'
import SetInitialBalance from '../components/SetInitialBalance'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const fmt = (n) => n >= 1000000 ? `Rp ${(n/1000000).toFixed(1)} jt` : n >= 1000 ? `Rp ${(n/1000).toFixed(0)} rb` : `Rp ${n.toLocaleString('id-ID')}`
const fmtFull = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function Dashboard() {
  const { user, isPro } = useAuth()
  const { wallet, totalIncome, totalExpense, transactions, budgets, getBudgetUsed } = useData()
  const totalBalance = wallet?.balance || 0
  const wallets = wallet ? [wallet] : []
  const [showModal, setShowModal] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showInitialBalance, setShowInitialBalance] = useState(() => !localStorage.getItem('mt-balance-set'))
  const handleInitialBalanceClose = () => { localStorage.setItem('mt-balance-set', '1'); setShowInitialBalance(false) }

  const chartData = (() => {
    const days = []
    for (let i = 7; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.getDate().toString()
      const dayTx = transactions.filter(t => new Date(t.date).toDateString() === d.toDateString())
      days.push({
        day: label,
        income: dayTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      })
    }
    return days
  })()

  const recentTx = transactions.slice(0, 5)
  const now = new Date()
  const timeGreet = now.getHours() < 12 ? 'Selamat pagi' : now.getHours() < 17 ? 'Selamat siang' : 'Selamat malam'

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 120px' }}>
      <style>{`
        @media (max-width: 768px) {
          .db-wrap { padding: 16px 14px 120px !important; }
          .db-chart-budget { grid-template-columns: 1fr !important; }
          .db-tx-wallet { grid-template-columns: 1fr !important; }
          .db-balance { font-size: 26px !important; letter-spacing: -1px !important; }
          .db-fab { bottom: 78px !important; right: 14px !important; font-size: 12px !important; padding: 11px 16px !important; }
          .db-scan { display: none !important; }
          .db-wallet-section { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{timeGreet}, {user?.name?.split(' ')[0]} 👋</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Dashboard</h1>
        </div>
        <button className="db-scan" onClick={() => setShowScanner(true)} style={{
          padding: '7px 14px', borderRadius: 20, border: '0.5px solid var(--border)',
          background: 'var(--card)', fontSize: 12, color: 'var(--text)', fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)',
        }}>
          <Camera size={13} /> Scan Struk
        </button>
      </div>

      <BudgetAlert />

      {/* Balance card */}
      <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-xl)', padding: '20px 22px', marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, background: 'rgba(0,230,118,0.07)', borderRadius: '50%' }} />
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4, position: 'relative' }}>Total Saldo</p>
        <p className="db-balance" style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: -1.5, marginBottom: 12, position: 'relative' }}>{fmtFull(totalBalance)}</p>
        <div style={{ display: 'flex', gap: 8, position: 'relative', flexWrap: 'wrap' }}>
          {[
            { label: 'Pemasukan', value: totalIncome, dot: 'var(--mint)' },
            { label: 'Pengeluaran', value: totalExpense, dot: 'rgba(255,255,255,0.3)' },
          ].map(p => (
            <div key={p.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{p.label} {fmt(p.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Pemasukan', value: totalIncome, icon: TrendingUp, bg: 'var(--mint-dim)', iconColor: 'var(--mint-text)' },
          { label: 'Pengeluaran', value: totalExpense, icon: TrendingDown, bg: 'var(--white)', iconColor: 'var(--text-sub)' },
          { label: 'Selisih', value: Math.abs(totalIncome - totalExpense), icon: PiggyBank, bg: totalIncome >= totalExpense ? 'var(--mint-dim)' : 'var(--warn-bg)', iconColor: totalIncome >= totalExpense ? 'var(--mint-text)' : 'var(--warn)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 10px' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <s.icon size={13} color={s.iconColor} />
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{fmt(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Chart + Budget */}
      <div className="db-chart-budget" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 12, marginBottom: 12 }}>
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Pengeluaran 7 Hari</p>
          {chartData.every(d => d.expense === 0) ? (
            <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Belum ada transaksi</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gMint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e676" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v) => [fmtFull(v), 'Pengeluaran']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid var(--border)', background: 'var(--card)', color: 'var(--text)' }} />
                <Area type="monotone" dataKey="expense" stroke="var(--mint)" strokeWidth={2} fill="url(#gMint)" dot={false} activeDot={{ r: 3, fill: 'var(--mint)' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: '12px 14px 8px', borderBottom: '0.5px solid var(--border)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Budget</p>
          </div>
          <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {budgets.length === 0 ? (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>Belum ada budget</p>
            ) : budgets.slice(0, 4).map(b => {
              const used = getBudgetUsed(b.category)
              const pct = Math.min(100, Math.round((used / b.limit) * 100))
              const color = pct >= 100 ? 'var(--danger)' : pct >= 80 ? 'var(--warn)' : 'var(--mint)'
              return (
                <div key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text)' }}>{b.category}</span>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--white)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Transactions + Wallets */}
      <div className="db-tx-wallet" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 12 }}>
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: '12px 14px 8px', borderBottom: '0.5px solid var(--border)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Transaksi Terakhir</p>
          </div>
          {recentTx.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Belum ada transaksi</p>
          ) : recentTx.map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderBottom: i < recentTx.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: tx.type === 'income' ? 'var(--mint-dim)' : 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{tx.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tx.category}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: tx.type === 'income' ? 'var(--mint-text)' : 'var(--text)', flexShrink: 0 }}>
                {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>

        <div className="db-wallet-section" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: '12px 14px 8px', borderBottom: '0.5px solid var(--border)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Dompet</p>
          </div>
          {wallets.map(w => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--mint-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{w.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{w.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{w.type}</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{fmt(w.balance)}</span>
            </div>
          ))}
          {!isPro && (
            <div style={{ margin: '8px 10px 10px', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <Crown size={11} color="var(--mint)" />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--mint)' }}>Upgrade PRO</span>
              </div>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 6, lineHeight: 1.4 }}>AI Advisor, Goals, dan semua fitur premium</p>
              <button style={{ background: 'var(--mint)', color: 'var(--navy)', border: 'none', borderRadius: 5, padding: '4px 10px', fontSize: 9, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>Lihat →</button>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button className="db-fab" onClick={() => setShowModal(true)} style={{
        position: 'fixed', bottom: 28, right: 28, background: 'var(--mint)', color: 'var(--navy)',
        border: 'none', borderRadius: 28, padding: '12px 22px', fontSize: 13, fontWeight: 800,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 4px 20px rgba(0,230,118,0.35)', fontFamily: 'var(--font)', zIndex: 150,
      }}>
        <Plus size={16} /> Catat Transaksi
      </button>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
      {showScanner && <ReceiptScanner onClose={() => setShowScanner(false)} />}
      {showInitialBalance && wallet && wallet.balance === 0 && transactions.length === 0 && <SetInitialBalance onClose={handleInitialBalanceClose} />}
    </div>
  )
}
