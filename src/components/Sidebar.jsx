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
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <>
      <aside style={{
        width: 220, flexShrink: 0, background: 'var(--navy)',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
        height: '100vh', position: 'sticky', top: 0,
      }} className="desktop-sidebar">
        {/* Logo */}
        <div style={{ padding: '0 18px 28px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, background: 'var(--mint)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--navy)', flexShrink: 0 }}>mt</div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>money<span style={{ color: 'var(--mint)' }}>trackr</span></span>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 10px', flex: 1, overflow: 'hidden auto' }}>
          <NavSection label="Menu" items={sidebarItems} />
          <NavSection label="Lainnya" items={sidebarBottom} />
        </nav>

        {/* User */}
        <div style={{ padding: '12px 10px 0', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)' }}>
            {/* Avatar + Nama + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--navy)', flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || ''}</div>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} title="Logout">
                <LogOut size={13} />
              </button>
            </div>
            {/* Dark mode toggle */}
            <button onClick={toggleTheme} style={{
              width: '100%', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: 'rgba(0,0,0,0.4)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 3px rgba(0,0,0,0.4)',
              padding: 3, display: 'flex', position: 'relative', marginTop: 4,
            }}>
              <div style={{
                position: 'absolute', top: 3, bottom: 3, width: '50%',
                background: '#fff', borderRadius: 16, transition: 'left 0.2s',
                left: dark ? '50%' : '0%',
                boxShadow: '0 3px 8px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
              }} />
              <div style={{ flex: 1, padding: '5px 0', fontSize: 10, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.25)' : '#0d1b2a', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'color 0.2s' }}>
                {!dark && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
                Light
              </div>
              <div style={{ flex: 1, padding: '5px 0', fontSize: 10, fontWeight: 600, color: dark ? '#0d1b2a' : 'rgba(255,255,255,0.25)', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'color 0.2s' }}>
                {dark && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
                Dark
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="mobile-topbar" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--navy)', padding: '12px 16px',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: 'var(--mint)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'var(--navy)' }}>mt</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>money<span style={{ color: 'var(--mint)' }}>trackr</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggleTheme} style={{
            width: 32, height: 18, borderRadius: 18, border: 'none', cursor: 'pointer',
            background: dark ? 'var(--mint)' : 'rgba(255,255,255,0.15)',
            position: 'relative', transition: 'background 0.2s', padding: 0,
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3, transition: 'left 0.2s',
              left: dark ? 17 : 3,
            }} />
          </button>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
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
            <span style={{ fontSize: 9, fontWeight: 600 }}>{label}</span>
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
      <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 1.4, padding: '0 10px', margin: '20px 0 6px' }}>{label}</p>
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px',
          borderRadius: 8, marginBottom: 2, textDecoration: 'none',
          fontSize: 13, fontWeight: isActive ? 600 : 400,
          background: isActive ? 'rgba(0,230,118,0.12)' : 'transparent',
          color: isActive ? 'var(--mint)' : 'rgba(255,255,255,0.55)',
          transition: 'all 0.15s',
        })}>
          <Icon size={15} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{label}</span>
        </NavLink>
      ))}
    </>
  )
}
