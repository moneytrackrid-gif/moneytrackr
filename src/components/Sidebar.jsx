import { useTheme } from '../context/ThemeContext'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, ArrowUpDown, Target, Wallet, Flag, Sparkles, BarChart2, Settings, LogOut, RefreshCw } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowUpDown, label: 'Transaksi' },
  { to: '/budget', icon: Target, label: 'Budget' },
  { to: '/goals', icon: Flag, label: 'Goals' },
  { to: '/reports', icon: BarChart2, label: 'Laporan' },
]

const sidebarItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowUpDown, label: 'Transaksi' },
  { to: '/budget', icon: Target, label: 'Budget' },
  { to: '/wallets', icon: Wallet, label: 'Dompet' },
  { to: '/goals', icon: Flag, label: 'Goals' },
]

const sidebarBottom = [
  { to: '/ai-advisor', icon: Sparkles, label: 'AI Advisor' },
  { to: '/reports', icon: BarChart2, label: 'Laporan' },
  { to: '/recurring', icon: RefreshCw, label: 'Recurring' },
  { to: '/settings', icon: Settings, label: 'Pengaturan' },
]

export default function Sidebar() {
  const { dark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside style={{
        width: 220, flexShrink: 0, background: 'var(--navy)',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
        height: '100vh', position: 'sticky', top: 0,
      }} className="desktop-sidebar">
        {/* Logo */}
        <div style={{ padding: '0 18px 24px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, background: 'var(--mint)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'var(--navy)', flexShrink: 0 }}>mt</div>
          <span style={{ fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>money<span style={{ color: 'var(--mint)' }}>trackr</span></span>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 10px', flex: 1, overflow: 'hidden auto' }}>
          <NavSection label="Menu" items={sidebarItems} />
          <NavSection label="Lainnya" items={sidebarBottom} />
        </nav>

        {/* User */}
        <div style={{ padding: '12px 10px 0', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--navy)', flexShrink: 0 }}>
              {user?.avatar || user?.name?.[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            </div>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} title="Dark mode">{dark ? '☀️' : '🌙'}</button>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="mobile-topbar" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--navy)', padding: '12px 16px',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: 'var(--mint)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--navy)' }}>mt</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>money<span style={{ color: 'var(--mint)' }}>trackr</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>{dark ? '☀️' : '🌙'}</button>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="mobile-bottomnav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--navy)', borderTop: '0.5px solid rgba(255,255,255,0.08)',
        padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
        flexDirection: 'row',
      }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '4px 0', textDecoration: 'none',
            color: isActive ? 'var(--mint)' : 'rgba(255,255,255,0.4)',
          })}>
            <Icon size={20} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .mobile-bottomnav { display: flex !important; }
        }
      `}</style>
    </>
  )
}

function NavSection({ label, items }) {
  return (
    <>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.2, padding: '0 8px', margin: '10px 0 3px' }}>{label}</p>
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
          borderRadius: 'var(--radius-sm)', marginBottom: 1, textDecoration: 'none',
          fontSize: 17, fontWeight: isActive ? 600 : 400,
          background: isActive ? 'rgba(0,230,118,0.15)' : 'transparent',
          color: isActive ? 'var(--mint)' : 'rgba(255,255,255,0.5)',
          transition: 'all 0.15s',
        })}>
          <Icon size={15} />
          <span style={{ flex: 1 }}>{label}</span>
        </NavLink>
      ))}
    </>
  )
}
