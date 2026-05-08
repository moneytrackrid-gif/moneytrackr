import Settings from './Settings'
const comingSoon = (title) => () => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 32, marginBottom: 12 }}>🚧</p>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Halaman ini sedang dalam pengembangan</p>
    </div>
  </div>
)

export const Wallets = comingSoon('Dompet')
export { Settings as default } from './Settings'
export const SettingsPage = Settings

export function Goals() {
  return comingSoon('Goals')()
}

export function AiAdvisor() {
  return comingSoon('AI Advisor')()
}
