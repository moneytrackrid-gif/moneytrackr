import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { rawUser } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [recurringList, setRecurringList] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (rawUser) {
      fetchAll(rawUser.id)
    } else {
      setWallet(null); setTransactions([]); setBudgets([]); setGoals([]); setRecurringList([]); setLoadingData(false)
    }
  }, [rawUser])

  const fetchAll = async (userId) => {
    setLoadingData(true)
    const [w, t, b, g, r] = await Promise.all([
      supabase.from('wallets').select('*').eq('user_id', userId).single(),
      supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('budgets').select('*').eq('user_id', userId),
      supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      supabase.from('recurring').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    ])
    setWallet(w.data)
    setTransactions(t.data || [])
    setBudgets(b.data || [])
    setGoals(g.data || [])
    setRecurringList(r.data || [])
    setLoadingData(false)
  }

  const now = new Date()
  const thisMonthTx = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const totalIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = thisMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const getBudgetUsed = (category) =>
    thisMonthTx.filter(t => t.category === category && t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  // Budget warnings — categories at >= 80%
  const budgetWarnings = budgets
    .map(b => {
      const used = getBudgetUsed(b.category)
      const limit = b.limit_amount || b.limit || 0
      const pct = limit > 0 ? Math.round((used / limit) * 100) : 0
      return { ...b, used, limit, pct }
    })
    .filter(b => b.pct >= 80 && b.category !== 'Tabungan')

  const addTransaction = async (tx) => {
    if (!rawUser || !wallet) return
    const newTx = {
      user_id: rawUser.id,
      type: tx.type,
      name: tx.name,
      amount: tx.amount,
      category: tx.category,
      icon: tx.icon,
      date: tx.date || new Date().toISOString(),
    }
    const { data } = await supabase.from('transactions').insert(newTx).select().single()
    if (data) setTransactions(prev => [data, ...prev])
    const newBalance = wallet.balance + (tx.type === 'income' ? tx.amount : -tx.amount)
    await supabase.from('wallets').update({ balance: newBalance }).eq('id', wallet.id)
    setWallet(prev => ({ ...prev, balance: newBalance }))
  }

  const deleteTransaction = async (id) => {
    const tx = transactions.find(t => t.id === id)
    if (!tx || !wallet) return
    await supabase.from('transactions').delete().eq('id', id)
    setTransactions(prev => prev.filter(t => t.id !== id))
    const newBalance = wallet.balance + (tx.type === 'income' ? -tx.amount : tx.amount)
    await supabase.from('wallets').update({ balance: newBalance }).eq('id', wallet.id)
    setWallet(prev => ({ ...prev, balance: newBalance }))
  }

  const updateWallet = async (data) => {
    if (!wallet) return
    await supabase.from('wallets').update(data).eq('id', wallet.id)
    setWallet(prev => ({ ...prev, ...data }))
  }

  const saveBudgets = async (newBudgets) => {
    if (!rawUser) return
    await supabase.from('budgets').delete().eq('user_id', rawUser.id)
    const toInsert = newBudgets.map(b => ({
      user_id: rawUser.id,
      category: b.category,
      icon: b.icon,
      limit_amount: b.limit || b.limit_amount,
    }))
    const { data } = await supabase.from('budgets').insert(toInsert).select()
    if (data) setBudgets(data)
  }

  const addGoal = async (goal) => {
    if (!rawUser) return
    const { data } = await supabase.from('goals').insert({
      user_id: rawUser.id, name: goal.name, icon: goal.icon,
      target: goal.target, saved: 0, deadline: goal.deadline || null,
    }).select().single()
    if (data) setGoals(prev => [...prev, data])
  }

  const updateGoal = async (id, data) => {
    await supabase.from('goals').update(data).eq('id', id)
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
  }

  const deleteGoal = async (id) => {
    await supabase.from('goals').delete().eq('id', id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const topUpGoal = async (id, amount) => {
    const goal = goals.find(g => g.id === id)
    if (!goal || !wallet) return
    const newSaved = Math.min(goal.target, goal.saved + amount)
    await supabase.from('goals').update({ saved: newSaved }).eq('id', id)
    setGoals(prev => prev.map(g => g.id === id ? { ...g, saved: newSaved } : g))
    await addTransaction({ type: 'expense', name: `Tabungan: ${goal.name}`, amount, category: 'Tabungan', icon: '🎯', date: new Date().toISOString() })
  }

  // --- Recurring ---
  const addRecurring = async (item) => {
    if (!rawUser) return
    const { data } = await supabase.from('recurring').insert({
      user_id: rawUser.id,
      name: item.name,
      icon: item.icon,
      amount: item.amount,
      category: item.category,
      billing_date: item.billing_date, // day of month 1-31
      active: true,
    }).select().single()
    if (data) setRecurringList(prev => [...prev, data])
  }

  const updateRecurring = async (id, updates) => {
    await supabase.from('recurring').update(updates).eq('id', id)
    setRecurringList(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const deleteRecurring = async (id) => {
    await supabase.from('recurring').delete().eq('id', id)
    setRecurringList(prev => prev.filter(r => r.id !== id))
  }

  const getMonthlyData = () => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString('id-ID', { month: 'short' })
      const txs = transactions.filter(t => {
        const td = new Date(t.date)
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
      })
      months.push({
        month: label,
        income: txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      })
    }
    return months
  }

  const getCategoryBreakdown = () => {
    const cats = {}
    thisMonthTx.filter(t => t.type === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount
    })
    return Object.entries(cats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }

  const normalizedBudgets = budgets.map(b => ({ ...b, limit: b.limit_amount }))

  return (
    <DataContext.Provider value={{
      wallet, updateWallet, loadingData,
      transactions, addTransaction, deleteTransaction,
      budgets: normalizedBudgets, saveBudgets, getBudgetUsed,
      goals, addGoal, updateGoal, deleteGoal, topUpGoal,
      recurringList, addRecurring, updateRecurring, deleteRecurring,
      totalIncome, totalExpense, thisMonthTx,
      getMonthlyData, getCategoryBreakdown,
      budgetWarnings,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
