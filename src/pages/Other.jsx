import { useAuth } from '../context/AuthContext'
import ProGate from '../components/ProGate'

const comingSoon = (title) => () => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 32, marginBottom: 12 }}>🚧</p>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Halaman ini sedang dalam pengembangan</p>
    </div>
  </div>
)

export const Transactions = comingSoon('Transaksi')
export const Budget = comingSoon('Budget')
export const Wallets = comingSoon('Dompet')
export const Reports = comingSoon('Laporan')
export const Settings = comingSoon('Pengaturan')

export function Goals() {
  const { isPro } = useAuth()
  return isPro ? comingSoon('Goals')() : <ProGate feature="Goals dengan deadline" />
}

export function AiAdvisor() {
  const { isPro } = useAuth()
  return isPro ? comingSoon('AI Advisor')() : <ProGate feature="AI Financial Advisor" />
}
