import { useState, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { Search, Trash2, Plus } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'

const fmt = (n) => `Rp ${n.toLocaleString('id-ID')}`

const INCOME_CATS = ['Gaji', 'Freelance', 'Bisnis', 'Investasi', 'Hadiah', 'Bonus', 'Dividen', 'Saldo Awal', 'Lainnya']
const EXPENSE_CATS = ['Makan', 'Transportasi', 'Belanja', 'Hiburan', 'Tagihan', 'Kesehatan', 'Pendidikan', 'Tabungan', 'Lainnya']

export default function Transactions() {
  const { transactions, deleteTransaction, totalIncome, totalExpense } = useData()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('Semua')
  const [filterCat, setFilterCat] = useState('Semua')
  const [showModal, setShowModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const activeCats = filterType === 'Pemasukan' ? ['Semua', ...INCOME_CATS] : filterType === 'Pengeluaran' ? ['Semua', ...EXPENSE_CATS] : ['Semua']

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === 'Semua' || (filterType === 'Pemasukan' ? t.type === 'income' : t.type === 'expense')
      const matchCat = filterCat === 'Semua' || t.category === filterCat
      return matchSearch && matchType && matchCat
    })
  }, [transactions, search, filterType, filterCat])

  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(t => {
      const day = new Date(t.date).toDateString()
      if (!groups[day]) groups[day] = []
      groups[day].push(t)
    })
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
  }, [filtered])

  const handleDelete = (id) => { deleteTransaction(id); setConfirmDelete(null) }

  const handleFilterType = (t) => { setFilterType(t); setFilterCat('Semua') }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 40px' }}>
      <style>{`@media(max-width:768px){.tx-page{padding:16px 14px 100px !important}.tx-summary{grid-template-columns:1fr 1fr !important}}`}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Transaksi</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{transactions.length} transaksi tercatat</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--mint)', color: 'var(--navy)', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
          <Plus size={15} /> Catat
        </button>
      </div>

      {/* Summary */}
      <div className="tx-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Pemasukan', value: totalIncome, color: 'var(--mint-text)', bg: 'var(--mint-dim)' },
          { label: 'Pengeluaran', value: totalExpense, color: 'var(--text)', bg: 'var(--white)' },
          { label: 'Selisih', value: totalIncome - totalExpense, color: totalIncome - totalExpense >= 0 ? 'var(--mint-text)' : 'var(--danger)', bg: 'var(--card)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{fmt(Math.abs(s.value))}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari transaksi..." style={{ width: '100%', padding: '9px 12px 9px 36px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text)', background: 'var(--card)', fontFamily: 'var(--font)', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {['Semua', 'Pemasukan', 'Pengeluaran'].map(t => (
          <button key={t} onClick={() => handleFilterType(t)} style={{ padding: '7px 16px', borderRadius: 20, border: `0.5px solid ${filterType === t ? 'var(--mint)' : 'var(--border)'}`, background: filterType === t ? 'var(--mint-dim)' : 'var(--card)', color: filterType === t ? 'var(--mint-text)' : 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Category filter — tampil kalau filter type bukan Semua */}
      {filterType !== 'Semua' && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {activeCats.map(c => (
            <button key={c} onClick={() => setFilterCat(c)} style={{ padding: '5px 14px', borderRadius: 20, border: `0.5px solid ${filterCat === c ? 'var(--navy)' : 'var(--border)'}`, background: filterCat === c ? 'var(--navy)' : 'var(--card)', color: filterCat === c ? 'var(--mint)' : 'var(--text-muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font)' }}>
              {c}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {grouped.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Tidak ada transaksi</p>
          <p style={{ fontSize: 13 }}>Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : grouped.map(([day, txs]) => (
        <div key={day} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {new Date(day).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
          </div>
          <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {txs.map((tx, i) => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < txs.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.type === 'income' ? 'var(--mint-dim)' : 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{tx.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{tx.category}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: tx.type === 'income' ? 'var(--mint-text)' : 'var(--text)', flexShrink: 0 }}>
                  {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                </span>
                <button onClick={() => setConfirmDelete(tx.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--border)', padding: 4, display: 'flex', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--border)'}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,33,55,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setConfirmDelete(null)}>
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-xl)', padding: 28, width: 320, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 28, marginBottom: 12 }}>🗑️</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Hapus transaksi?</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Saldo dompet akan dikembalikan</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: 11, border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--white)', color: 'var(--text-sub)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>Batal</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: 11, border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--danger)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
