import { useData } from '../context/DataContext'

const fmtFull = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function HealthScore() {
  const { totalIncome, totalExpense, budgets, getBudgetUsed, goals, transactions } = useData()

  const savings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0

  // Over budget categories
  const overBudget = budgets.filter(b => {
    const used = getBudgetUsed(b.category)
    return b.limit > 0 && used > b.limit
  }).length

  // Goals progress
  const goalsProgress = goals.length > 0
    ? Math.round(goals.reduce((s, g) => s + Math.min(100, (g.saved / g.target) * 100), 0) / goals.length)
    : 0

  // Transaction consistency (has transactions this week)
  const now = new Date()
  const thisWeekTx = transactions.filter(t => {
    const d = new Date(t.date)
    return (now - d) / 86400000 <= 7
  }).length
  const consistent = thisWeekTx >= 3

  // Score calculation
  let score = 0
  let breakdown = []

  // Saving rate (40 pts)
  const savingScore = Math.min(40, Math.round(savingsRate * 1.5))
  score += savingScore
  breakdown.push({
    label: 'Saving Rate',
    score: savingScore,
    max: 40,
    desc: savingsRate >= 20 ? `${savingsRate}% — Excellent!` : savingsRate > 0 ? `${savingsRate}% — Bisa lebih baik` : 'Belum ada pemasukan',
    good: savingsRate >= 20,
  })

  // Budget control (30 pts)
  const budgetScore = budgets.length === 0 ? 15 : Math.max(0, 30 - (overBudget * 10))
  score += budgetScore
  breakdown.push({
    label: 'Budget Control',
    score: budgetScore,
    max: 30,
    desc: budgets.length === 0 ? 'Belum set budget' : overBudget === 0 ? 'Semua budget terkontrol!' : `${overBudget} kategori over budget`,
    good: overBudget === 0 && budgets.length > 0,
  })

  // Goals (20 pts)
  const goalScore = goals.length === 0 ? 0 : Math.round((goalsProgress / 100) * 20)
  score += goalScore
  breakdown.push({
    label: 'Goals Progress',
    score: goalScore,
    max: 20,
    desc: goals.length === 0 ? 'Belum ada goals' : `${goalsProgress}% rata-rata tercapai`,
    good: goalsProgress >= 50,
  })

  // Consistency (10 pts)
  const consistencyScore = consistent ? 10 : thisWeekTx > 0 ? 5 : 0
  score += consistencyScore
  breakdown.push({
    label: 'Konsistensi',
    score: consistencyScore,
    max: 10,
    desc: consistent ? 'Rajin mencatat minggu ini!' : thisWeekTx > 0 ? 'Catat lebih rutin' : 'Belum catat minggu ini',
    good: consistent,
  })

  const getGrade = (s) => {
    if (s >= 85) return { label: 'Excellent', color: '#00c853', emoji: '🏆' }
    if (s >= 70) return { label: 'Good', color: '#00e676', emoji: '✅' }
    if (s >= 50) return { label: 'Fair', color: '#ffb300', emoji: '⚠️' }
    return { label: 'Needs Work', color: '#ff5252', emoji: '📉' }
  }

  const grade = getGrade(score)

  const circumference = 2 * Math.PI * 54
  const strokeDash = (score / 100) * circumference

  return (
    <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '20px 22px', marginBottom: 14 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Financial Health Score</p>

      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, alignItems: 'center' }}>
        {/* Circle score */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto' }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="54" fill="none" stroke="var(--white)" strokeWidth="10" />
              <circle cx="65" cy="65" r="54" fill="none" stroke={grade.color} strokeWidth="10"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: grade.color, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>/ 100</span>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: grade.color }}>{grade.emoji} {grade.label}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {breakdown.map(b => (
            <div key={b.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{b.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.score}/{b.max}</span>
              </div>
              <div style={{ height: 5, background: 'var(--white)', borderRadius: 3, overflow: 'hidden', marginBottom: 3 }}>
                <div style={{ width: `${(b.score / b.max) * 100}%`, height: '100%', background: b.good ? '#00c853' : b.score > 0 ? '#ffb300' : '#ff5252', borderRadius: 3, transition: 'width 0.6s ease' }} />
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
