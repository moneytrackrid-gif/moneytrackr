import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

const INIT_WALLET = { id: 'w1', name: 'BCA Tabungan', type: 'Bank', balance: 3847200, icon: '🏦' }

const INIT_TRANSACTIONS = [
  { id: 't1', type: 'expense', name: 'Alfamart', amount: 87500, category: 'Belanja', date: new Date().toISOString(), icon: '🛒' },
  { id: 't2', type: 'expense', name: 'Grab', amount: 35000, category: 'Transportasi', date: new Date(Date.now() - 3600000).toISOString(), icon: '🚗' },
  { id: 't3', type: 'income', name: 'Gaji Mei', amount: 5500000, category: 'Pemasukan', date: new Date(Date.now() - 86400000).toISOString(), icon: '💼' },
  { id: 't4', type: 'expense', name: 'Warteg Bu Yati', amount: 18000, category: 'Makan', date: new Date(Date.now() - 2 * 86400000).toISOString(), icon: '🍜' },
  { id: 't5', type: 'expense', name: 'Netflix', amount: 54000, category: 'Hiburan', date: new Date(Date.now() - 3 * 86400000).toISOString(), icon: '📱' },
  { id: 't6', type: 'expense', name: 'PLN Token', amount: 150000, category: 'Tagihan', date: new Date(Date.now() - 4 * 86400000).toISOString(), icon: '⚡' },
  { id: 't7', type: 'expense', name: 'Indomaret', amount: 45000, category: 'Belanja', date: new Date(Date.now() - 5 * 86400000).toISOString(), icon: '🛒' },
  { id: 't8', type: 'expense', name: 'Gojek', amount: 22000, category: 'Transportasi', date: new Date(Date.now() - 6 * 86400000).toISOString(), icon: '🚗' },
  { id: 't9', type: 'expense', name: 'Ayam Geprek', amount: 25000, category: 'Makan', date: new Date(Date.now() - 7 * 86400000).toISOString(), icon: '🍜' },
  { id: 't10', type: 'income', name: 'Freelance Design', amount: 800000, category: 'Pemasukan', date: new Date(Date.now() - 8 * 86400000).toISOString(), icon: '💻' },
  { id: 't11', type: 'expense', name: 'Spotify', amount: 54000, category: 'Hiburan', date: new Date(Date.now() - 9 * 86400000).toISOString(), icon: '🎵' },
  { id: 't12', type: 'expense', name: 'PDAM', amount: 85000, category: 'Tagihan', date: new Date(Date.now() - 10 * 86400000).toISOString(), icon: '⚡' },
]

const INIT_BUDGETS = [
  { id: 'b1', category: 'Makan', limit: 600000, icon: '🍜' },
  { id: 'b2', category: 'Transportasi', limit: 200000, icon: '🚗' },
  { id: 'b3', category: 'Hiburan', limit: 150000, icon: '🎬' },
  { id: 'b4', category: 'Belanja', limit: 300000, icon: '🛒' },
  { id: 'b5', category: 'Tagihan', limit: 500000, icon: '⚡' },
]

const INIT_GOALS = [
  { id: 'g1', name: 'Dana Darurat', icon: '🛡️', target: 10000000, saved: 3500000, deadline: '2025-12-31' },
  { id: 'g2', name: 'Liburan Bali', icon: '🏖️', target: 5000000, saved: 1200000, deadline: '2025-08-01' },
  { id: 'g3', name: 'Laptop Baru', icon: '💻', target: 15000000, saved: 4000000, deadline: '2026-03-01' },
]

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

export function DataProvider({ children }) {
  const [wallet, setWallet] = useState(() => load('mt_wallet', INIT_WALLET))
  const [transactions, setTransactions] = useState(() => load('mt_transactions', INIT_TRANSACTIONS))
  const [budgets, setBudgets] = useState(() => load('mt_budgets', INIT_BUDGETS))
  const [goals, setGoals] = useState(() => load('mt_goals', INIT_GOALS))

  useEffect(() => { localStorage.setItem('mt_wallet', JSON.stringify(wallet)) }, [wallet])
  useEffect(() => { localStorage.setItem('mt_transactions', JSON.stringify(transactions)) }, [transactions])
  useEffect(() => { localStorage.setItem('mt_budgets', JSON.stringify(budgets)) }, [budgets])
  useEffect(() => { localStorage.setItem('mt_goals', JSON.stringify(goals)) }, [goals])

  const now = new Date()
  const thisMonthTx = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const totalIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = thisMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const getBudgetUsed = (category) =>
    thisMonthTx.filter(t => t.category === category && t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const addTransaction = (tx) => {
    const newTx = { ...tx, id: 't' + Date.now() }
    setTransactions(prev => [newTx, ...prev])
    setWallet(prev => ({ ...prev, balance: prev.balance + (tx.type === 'income' ? tx.amount : -tx.amount) }))
  }

  const deleteTransaction = (id) => {
    const tx = transactions.find(t => t.id === id)
    if (!tx) return
    setTransactions(prev => prev.filter(t => t.id !== id))
    setWallet(prev => ({ ...prev, balance: prev.balance + (tx.type === 'income' ? -tx.amount : tx.amount) }))
  }

  const updateWallet = (data) => setWallet(prev => ({ ...prev, ...data }))
  const saveBudgets = (newBudgets) => setBudgets(newBudgets)

  const addGoal = (goal) => setGoals(prev => [...prev, { ...goal, id: 'g' + Date.now(), saved: 0 }])
  const updateGoal = (id, data) => setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id))
  const topUpGoal = (id, amount) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return
    setGoals(prev => prev.map(g => g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g))
    addTransaction({ type: 'expense', name: `Tabungan: ${goal.name}`, amount, category: 'Tabungan', date: new Date().toISOString(), icon: '🎯' })
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

  return (
    <DataContext.Provider value={{
      wallet, updateWallet,
      transactions, addTransaction, deleteTransaction,
      budgets, saveBudgets, getBudgetUsed,
      goals, addGoal, updateGoal, deleteGoal, topUpGoal,
      totalIncome, totalExpense, thisMonthTx,
      getMonthlyData, getCategoryBreakdown,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
