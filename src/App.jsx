import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { supabase } from './lib/supabase'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Goals from './pages/Goals'
import Reports from './pages/Reports'
import ProGate from './components/ProGate'
import { Settings } from './pages/Other'
import Syarat from './pages/Syarat'
import Privasi from './pages/Privasi'
import Register from './pages/Register'
import './index.css'

function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Outlet />
    </div>
  )
}

function RequireAuth() {
  const { user, loading } = useAuth()
  const [subLoading, setSubLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (!user) { setSubLoading(false); return }
    supabase.from('profiles')
      .select('subscription_status, subscription_end_date')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const active = data?.subscription_status === 'active' &&
          data?.subscription_end_date &&
          new Date(data.subscription_end_date) > new Date()
        setIsSubscribed(active)
        setSubLoading(false)
      })
  }, [user])

  if (loading || subLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, background: 'var(--mint)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'var(--navy)', margin: '0 auto 16px' }}>mt</div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Memuat...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (!isSubscribed) return <Navigate to="/pricing" replace />
  return <Outlet />
}

function AiAdvisor() {
  const { isPro } = useAuth()
  return isPro
    ? <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><p style={{ color:'var(--text-muted)' }}>AI Advisor — coming soon</p></div>
    : <ProGate feature="AI Financial Advisor" />
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/wallets" element={<Navigate to="/dashboard" replace />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/ai-advisor" element={<AiAdvisor />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/pricing" element={<Pricing />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/syarat" element={<Syarat />} />
            <Route path="/privasi" element={<Privasi />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
