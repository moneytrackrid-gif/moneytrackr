import { useState } from 'react'
import { useData } from '../context/DataContext'
import { AlertTriangle, X } from 'lucide-react'

export default function BudgetAlert() {
  const { budgetWarnings } = useData()
  const [dismissed, setDismissed] = useState([])

  const visible = budgetWarnings.filter(b => !dismissed.includes(b.id))
  if (!visible.length) return null

  return (
    <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {visible.map(b => {
        const isOver = b.pct >= 100
        return (
          <div key={b.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            background: isOver ? 'rgba(255,59,48,0.08)' : 'rgba(255,165,0,0.08)',
            border: `1px solid ${isOver ? 'rgba(255,59,48,0.25)' : 'rgba(255,165,0,0.25)'}`,
            borderRadius: 10,
          }}>
            <AlertTriangle size={14} color={isOver ? '#ff3b30' : '#ff9500'} style={{ flexShrink: 0 }} />
            <p style={{ flex: 1, fontSize: 12, color: 'var(--text)', lineHeight: 1.4 }}>
              {isOver
                ? <><strong>{b.icon} {b.category}</strong> sudah melebihi budget bulan ini ({b.pct}%)</>
                : <><strong>{b.icon} {b.category}</strong> sudah {b.pct}% dari budget — hampir habis!</>
              }
            </p>
            <button onClick={() => setDismissed(d => [...d, b.id])} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-muted)', flexShrink: 0,
            }}>
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
