import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Mock user data — replace with real API calls
const MOCK_USERS = {
  'demo@moneytrackr.id': {
    id: 'u1', name: 'Reza Firmansyah', email: 'demo@moneytrackr.id',
    password: 'demo123',
    plan: 'pro', // 'free' | 'starter' | 'pro'
    subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: 'RF',
  },
  'free@moneytrackr.id': {
    id: 'u2', name: 'Budi Santoso', email: 'free@moneytrackr.id',
    password: 'demo123',
    plan: 'free',
    subscriptionEnd: null,
    avatar: 'BS',
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mt_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (email, password) => {
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 800)) // simulate API
    const found = MOCK_USERS[email]
    if (!found || found.password !== password) {
      setError('Email atau password salah')
      setLoading(false)
      return false
    }
    const { password: _, ...safe } = found
    setUser(safe)
    localStorage.setItem('mt_user', JSON.stringify(safe))
    setLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mt_user')
  }

  const isPro = user?.plan === 'pro'
  const isStarter = user?.plan === 'starter' || isPro
  const daysLeft = user?.subscriptionEnd
    ? Math.max(0, Math.ceil((new Date(user.subscriptionEnd) - Date.now()) / 86400000))
    : 0

  const upgradePlan = (plan) => {
    // In real app: redirect to Xendit/Midtrans checkout
    const end = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    const updated = { ...user, plan, subscriptionEnd: end }
    setUser(updated)
    localStorage.setItem('mt_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, isPro, isStarter, daysLeft, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
