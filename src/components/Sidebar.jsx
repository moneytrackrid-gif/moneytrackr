import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, ArrowUpDown, Target, Wallet, Flag, Sparkles, BarChart2, Settings, LogOut, Crown } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowUpDown, label: 'Transaksi' },
  { to: '/budget', icon: Target, label: 'Budget' },
  { to: '/wallets', icon: Wallet, label: 'Dompet' },
  { to: '/goals', icon: Flag, label: 'Goals', pro: true },
]

const bottomItems = [
  { to: '/ai-advisor', icon: Sparkles, label: 'AI Advisor', pro: true },
  { to: '/reports', icon: BarChart2, label: 'Laporan' },
  { to: '/settings', icon: Settings, label: 'Pengaturan' },
]

export default function Sidebar() {
  const { user, logout, isPro, daysLeft } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside style={{ width: 220, flexShrink: 0, background: 'var(--navy)', display: 'flex', flexDirection: 'column', padding: '20px 0', height: '100vh', position: 'sticky', top: 0 }}>
      {/* Logo */}
      <div style={{ padding: '0 18px 24px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 30, height: 30, background: 'var(--mint)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--navy)', flexShrink: 0 }}>mt</div>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>money<span style={{ color: 'var(--mint)' }}>trackr</span></span>
      </div>

      {/* Nav */}
      <nav style={{ padding: '0 10px', flex: 1, overflow: 'hidden auto' }}>
        <NavSection label="Menu" items={navItems} isPro={isPro} />
        <NavSection label="Lainnya" items={bottomItems} isPro={isPro} />
      </nav>

      {/* Pro banner if not pro */}
      {!isPro && (
        <div style={{ margin: '0 10px 12px', background: 'rgba(0,230,118,0.1)', border: '0.5px solid rgba(0,230,118,0.25)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Crown size={13} color="var(--mint)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--mint)' }}>Upgrade ke PRO</span>
          </div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 8, lineHeight: 1.4 }}>Unlock AI Advisor, Goals, dan semua fitur premium</p>
          <NavLink to="/pricing" style={{ display: 'block', background: 'var(--mint)', color: 'var(--navy)', borderRadius: 6, padding: '6px 0', fontSize: 11, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
            Lihat Harga →
          </NavLink>
        </div>
      )}

      {/* User */}
      <div style={{ padding: '12px 10px 0', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
        {isPro && daysLeft <= 30 && (
          <div style={{ padding: '6px 10px', background: 'rgba(0,230,118,0.08)', borderRadius: 6, marginBottom: 8 }}>
            <p style={{ fontSize: 10, color: 'var(--mint)', opacity: 0.8 }}>PRO aktif · {daysLeft} hari lagi</p>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--navy)', flexShrink: 0 }}>
            {user?.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: 'var(--mint)', opacity: 0.8 }}>{user?.plan?.toUpperCase()}</div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavSection({ label, items, isPro }) {
  return (
    <>
      <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.2, padding: '0 8px', margin: '16px 0 4px' }}>{label}</p>
      {items.map(({ to, icon: Icon, label, pro }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
          borderRadius: 'var(--radius-sm)', marginBottom: 1, textDecoration: 'none',
          fontSize: 13, fontWeight: isActive ? 600 : 400,
          background: isActive ? 'rgba(0,230,118,0.15)' : 'transparent',
          color: isActive ? 'var(--mint)' : 'rgba(255,255,255,0.5)',
          transition: 'all 0.15s',
        })}>
          <Icon size={15} />
          <span style={{ flex: 1 }}>{label}</span>
          {pro && !isPro && <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(0,230,118,0.2)', color: 'var(--mint)', padding: '1px 6px', borderRadius: 4 }}>PRO</span>}
        </NavLink>
      ))}
    </>
  )
}
