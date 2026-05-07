import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Send, RefreshCw } from 'lucide-react'

const fmtFull = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function AiAdvisor() {
  const { user } = useAuth()
  const { transactions, totalIncome, totalExpense, budgets, getBudgetUsed, wallet } = useData()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const buildContext = () => {
    const now = new Date()
    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    const catBreakdown = {}
    thisMonthTx.filter(t => t.type === 'expense').forEach(t => {
      catBreakdown[t.category] = (catBreakdown[t.category] || 0) + t.amount
    })

    const budgetStatus = budgets.map(b => {
      const used = getBudgetUsed(b.category)
      const pct = b.limit > 0 ? Math.round((used / b.limit) * 100) : 0
      return `${b.category}: dipakai ${fmtFull(used)} dari ${fmtFull(b.limit)} (${pct}%)`
    }).join('\n')

    const topExpenses = Object.entries(catBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amt]) => `${cat}: ${fmtFull(amt)}`)
      .join('\n')

    const recentTx = transactions.slice(0, 10).map(t =>
      `${t.type === 'income' ? '+' : '-'} ${fmtFull(t.amount)} (${t.category}) - ${t.name}`
    ).join('\n')

    return `Kamu adalah AI Financial Advisor untuk aplikasi MoneyTrackr. Kamu membantu user Indonesia mengelola keuangan pribadi mereka dengan ramah, praktis, dan to the point. Gunakan bahasa Indonesia yang casual tapi profesional.

DATA KEUANGAN USER (${user?.name || 'User'}):
- Saldo saat ini: ${fmtFull(wallet?.balance || 0)}
- Pemasukan bulan ini: ${fmtFull(totalIncome)}
- Pengeluaran bulan ini: ${fmtFull(totalExpense)}
- Selisih: ${fmtFull(totalIncome - totalExpense)} (${totalIncome >= totalExpense ? 'surplus' : 'defisit'})
- Saving rate: ${totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%

PENGELUARAN PER KATEGORI BULAN INI:
${topExpenses || 'Belum ada pengeluaran'}

STATUS BUDGET:
${budgetStatus || 'Belum ada budget yang diset'}

10 TRANSAKSI TERAKHIR:
${recentTx || 'Belum ada transaksi'}

Berikan analisis dan saran yang spesifik berdasarkan data di atas. Jangan terlalu panjang, fokus pada insight yang actionable. Gunakan emoji secukupnya untuk membuat respons lebih menarik.`
  }

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const systemPrompt = buildContext()
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Maaf, terjadi kesalahan.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Coba lagi.' }])
    }
    setLoading(false)
  }

  const analyzeNow = () => {
    setAnalyzed(true)
    sendMessage('Analisis kondisi keuangan saya sekarang dan berikan 3 saran utama yang paling penting.')
  }

  const quickQuestions = [
    'Di mana saya paling boros bulan ini?',
    'Berapa yang seharusnya saya tabung?',
    'Bagaimana cara menghemat pengeluaran?',
    'Apakah keuangan saya sehat?',
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px 28px 16px', borderBottom: '0.5px solid var(--border)', background: 'var(--card)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mint-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="var(--mint-text)" />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>AI Advisor</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Analisis keuangan personal powered by Claude</p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Halo, {user?.name?.split(' ')[0]}!</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6, maxWidth: 400, margin: '0 auto 28px' }}>
              Aku bisa analisis kondisi keuanganmu dan kasih saran yang spesifik berdasarkan data transaksi kamu.
            </p>

            {/* Auto analyze button */}
            <button onClick={analyzeNow} style={{
              background: 'var(--mint)', color: 'var(--navy)', border: 'none', borderRadius: 12,
              padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font)', display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: 28, boxShadow: '0 4px 16px rgba(0,230,118,0.25)',
            }}>
              <Sparkles size={16} /> Analisis Keuanganku Sekarang
            </button>

            {/* Quick questions */}
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Atau tanya langsung</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {quickQuestions.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} style={{
                    background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 20,
                    padding: '8px 16px', fontSize: 12, color: 'var(--text)', cursor: 'pointer',
                    fontFamily: 'var(--font)', fontWeight: 500,
                  }}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--mint-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 10, marginTop: 2 }}>
                <Sparkles size={13} color="var(--mint-text)" />
              </div>
            )}
            <div style={{
              maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
              background: msg.role === 'user' ? 'var(--navy)' : 'var(--card)',
              border: msg.role === 'user' ? 'none' : '0.5px solid var(--border)',
              fontSize: 13, color: msg.role === 'user' ? '#fff' : 'var(--text)',
              lineHeight: 1.6, whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--mint-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={13} color="var(--mint-text)" />
            </div>
            <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mint)', animation: `bounce 1s ease ${i * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {/* Quick questions after first message */}
        {messages.length > 0 && !loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {quickQuestions.filter(q => !messages.find(m => m.content === q)).slice(0, 3).map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 20,
                padding: '6px 14px', fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer',
                fontFamily: 'var(--font)', fontWeight: 500,
              }}>{q}</button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '14px 28px 20px', borderTop: '0.5px solid var(--border)', background: 'var(--card)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Tanya tentang keuanganmu..."
            style={{
              flex: 1, padding: '11px 16px', border: '0.5px solid var(--border)', borderRadius: 12,
              fontSize: 13, color: 'var(--text)', background: 'var(--white)',
              fontFamily: 'var(--font)', outline: 'none',
            }}
          />
          <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{
            width: 42, height: 42, borderRadius: 12, border: 'none',
            background: input.trim() ? 'var(--mint)' : 'var(--white)',
            color: input.trim() ? 'var(--navy)' : 'var(--text-muted)',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.15s',
          }}>
            <Send size={16} />
          </button>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
          Powered by Claude · Data keuanganmu aman dan tidak disimpan
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
