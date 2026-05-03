import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  const login = async (email, password) => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email atau password salah'); setLoading(false); return false }
    return true
  }

  const register = async (email, password, name) => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return false }

    const userId = data.user.id
    await supabase.from('profiles').insert({ id: userId, name, plan: 'free' })
    await supabase.from('wallets').insert({ user_id: userId, name: 'Dompet Utama', type: 'Bank', balance: 0, icon: '🏦' })
    await supabase.from('budgets').insert([
      { user_id: userId, category: 'Makan', icon: '🍜', limit_amount: 600000 },
      { user_id: userId, category: 'Transportasi', icon: '🚗', limit_amount: 200000 },
      { user_id: userId, category: 'Hiburan', icon: '🎬', limit_amount: 150000 },
      { user_id: userId, category: 'Belanja', icon: '🛒', limit_amount: 300000 },
      { user_id: userId, category: 'Tagihan', icon: '⚡', limit_amount: 500000 },
    ])

    setLoading(false)
    return true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const upgradePlan = async (plan) => {
    const end = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    await supabase.from('profiles').update({ plan, subscription_end: end }).eq('id', user.id)
    setProfile(prev => ({ ...prev, plan, subscription_end: end }))
  }

  const isPro = profile?.plan === 'pro'
  const isStarter = profile?.plan === 'starter' || isPro
  const daysLeft = profile?.subscription_end
    ? Math.max(0, Math.ceil((new Date(profile.subscription_end) - Date.now()) / 86400000))
    : 0

  const displayUser = user ? {
    id: user.id,
    email: user.email,
    name: profile?.name || user.email?.split('@')[0],
    avatar: (profile?.name || user.email || 'U').slice(0, 2).toUpperCase(),
    plan: profile?.plan || 'free',
  } : null

  return (
    <AuthContext.Provider value={{ user: displayUser, rawUser: user, login, register, logout, loading, error, setError, isPro, isStarter, daysLeft, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
