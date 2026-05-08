import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { Plus, TrendingUp, TrendingDown, Minus, Camera } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'
import BudgetAlert from '../components/BudgetAlert'
import ReceiptScanner from '../components/ReceiptScanner'
import SetInitialBalance from '../components/SetInitialBalance'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const fmt = (n) => n >= 1000000 ? `Rp ${(n/1000000).toFixed(1)} jt` : n >= 1000 ? `Rp ${(n/1000).toFixed(0)} rb` : `Rp ${n.toLocaleString('id-ID')}`
const fmtFull = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function Dashboard() {
  const { user } = useAuth()
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
  const selisih = totalIncome - totalExpense

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 120px' }}>
      <style>{`
        @media (max-width: 768px) {
          .db-page { padding: 16px 14px 120px !important; }
          .db-chart-budget { grid-template-columns: 1fr !important; }
          .db-tx-wallet { grid-template-columns: 1fr !important; }
          .db-balance { font-size: 28px !important; }
          .db-fab { bottom: 78px !important; right: 14px !important; }
          .db-scan { display: none !important; }
          .db-wallet-section { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 3 }}>{timeGreet}, {user?.name?.split(' ')[0]} 👋</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Dashboard</h1>
        </div>
        <button className="db-scan" onClick={() => setShowScanner(true)} style={{
          padding: '8px 16px', borderRadius: 20, border: '0.5px solid var(--border)',
          background: 'var(--card)', fontSize: 12, color: 'var(--text)', fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)',
        }}>
          <Camera size={13} /> Scan Struk
        </button>
      </div>

      <BudgetAlert />

      {/* Balance card */}
      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '28px 28px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'rgba(0,230,118,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -50, right: 80, width: 100, height: 100, background: 'rgba(0,230,118,0.04)', borderRadius: '50%' }} />
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, position: 'relative', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 500 }}>Total Saldo</p>
        <p className="db-balance" style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: -2, marginBottom: 20, position: 'relative', lineHeight: 1 }}>{fmtFull(totalBalance)}</p>
        <div style={{ display: 'flex', gap: 10, position: 'relative', flexWrap: 'wrap' }}>
          {[
            { label: 'Pemasukan', value: totalIncome, dot: '#00e676' },
            { label: 'Pengeluaran', value: totalExpense, dot: 'rgba(255,255,255,0.25)' },
          ].map(p => (
            <div key={p.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(4px)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{p.label} {fmt(p.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Pemasukan', value: totalIncome, icon: TrendingUp, color: '#00c853', bg: 'rgba(0,200,83,0.08)', desc: 'bulan ini' },
          { label: 'Pengeluaran', value: totalExpense, icon: TrendingDown, color: 'var(--text-sub)', bg: 'var(--white)', desc: 'bulan ini' },
          { label: 'Selisih', value: Math.abs(selisih), icon: Minus, color: selisih >= 0 ? '#00c853' : '#ff5252', bg: selisih >= 0 ? 'rgba(0,200,83,0.08)' : 'rgba(255,82,82,0.08)', desc: selisih >= 0 ? 'surplus' : 'defisit' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <s.icon size={16} color={s.color} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>{s.label}</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: -0.5, marginBottom: 2 }}>{fmt(s.value)}</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Chart + Budget */}
      <div className="db-chart-budget" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 12, marginBottom: 12 }}>
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Pengeluaran 7 Hari</p>
          {chartData.every(d => d.expense === 0) ? (
            <div style={{ height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <p style={{ fontSize: 28 }}>📊</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Belum ada data minggu ini</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gMint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e676" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v) => [fmtFull(v), 'Pengeluaran']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontFamily: 'Inter, sans-serif' }} />
                <Area type="monotone" dataKey="expense" stroke="#00e676" strokeWidth={2} fill="url(#gMint)" dot={false} activeDot={{ r: 4, fill: '#00e676' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14 }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: '0.5px solid var(--border)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Budget</p>
          </div>
          <div style={{ padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {budgets.length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                <p style={{ fontSize: 20, marginBottom: 6 }}>🎯</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Belum ada budget</p>
              </div>
            ) : budgets.slice(0, 4).map(b => {
              const used = getBudgetUsed(b.category)
              const pct = Math.min(100, Math.round((used / b.limit) * 100))
              const color = pct >= 100 ? '#ff5252' : pct >= 80 ? '#ffb300' : '#00e676'
              return (
                <div key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{b.category}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--white)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Transactions + Wallets */}
      <div className="db-tx-wallet" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 12 }}>
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14 }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: '0.5px solid var(--border)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Transaksi Terakhir</p>
          </div>
          {recentTx.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 36, marginBottom: 10 }}>💸</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Belum ada transaksi</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Mulai catat pemasukan atau pengeluaranmu</p>
              <button onClick={() => setShowModal(true)} style={{
                background: 'var(--mint)', color: 'var(--navy)', border: 'none', borderRadius: 10,
                padding: '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)',
              }}>+ Catat Transaksi</button>
            </div>
          ) : recentTx.map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: i < recentTx.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.type === 'income' ? 'rgba(0,200,83,0.1)' : 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{tx.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{tx.category}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: tx.type === 'income' ? '#00c853' : '#e53935', flexShrink: 0 }}>
                {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>

        <div className="db-wallet-section" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14 }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: '0.5px solid var(--border)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Dompet</p>
          </div>
          {wallets.map(w => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(0,200,83,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{w.icon || '💰'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{w.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.type}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{fmt(w.balance)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button className="db-fab" onClick={() => setShowModal(true)} style={{
        position: 'fixed', bottom: 28, right: 28, background: 'var(--mint)', color: 'var(--navy)',
        border: 'none', borderRadius: 28, padding: '13px 24px', fontSize: 13, fontWeight: 700,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 4px 24px rgba(0,230,118,0.3)', fontFamily: 'var(--font)', zIndex: 150,
      }}>
        <Plus size={16} /> Catat Transaksi
      </button>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
      {showScanner && <ReceiptScanner onClose={() => setShowScanner(false)} />}
      {showInitialBalance && wallet && wallet.balance === 0 && transactions.length === 0 && <SetInitialBalance onClose={handleInitialBalanceClose} />}
    </div>
  )
}
