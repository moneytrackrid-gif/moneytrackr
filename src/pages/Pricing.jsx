import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Check, X, Crown, Zap, Star } from 'lucide-react'

const PLANS = [
  {
    id: 'starter', name: 'Starter', icon: Star, price: 99000, priceOld: 199000,
    color: 'var(--navy-mid)', colorLight: 'var(--white)',
    desc: 'Untuk kamu yang baru mau mulai ngatur keuangan',
    features: [
      { text: 'Kelola banyak dompet', ok: true },
      { text: 'Percentage / fixed budgeting', ok: true },
      { text: 'Catat pemasukan & pengeluaran', ok: true },
      { text: 'Laporan & analitik lanjutan', ok: true },
      { text: 'Mode gelap', ok: true },
      { text: 'Goals dengan deadline', ok: false },
      { text: 'AI Advisor', ok: false },
      { text: 'Scan struk transaksi', ok: false },
    ],
  },
  {
    id: 'pro', name: 'PRO', icon: Zap, price: 149000, priceOld: 299000,
    color: 'var(--mint)', colorLight: 'var(--mint-dim)',
    popular: true,
    desc: 'Semua yang kamu butuhkan untuk kontrol penuh',
    features: [
      { text: 'Semua fitur Starter', ok: true },
      { text: 'Goals dengan deadline', ok: true },
      { text: 'Lacak aset & net worth', ok: true },
      { text: 'Financial Health Score (0–100)', ok: true },
      { text: 'AI Financial Advisor', ok: true },
      { text: 'Scan struk transaksi', ok: true },
      { text: 'AI Report Analyzer', ok: true },
      { text: '350 AI credits gratis saat daftar', ok: true },
    ],
  },
]

export default function Pricing() {
  const { user, isPro, upgradePlan } = useAuth()
  const [loading, setLoading] = useState('')
  const [success, setSuccess] = useState('')

  const handleUpgrade = async (planId) => {
    setLoading(planId)
    // Simulate Xendit checkout redirect
    await new Promise(r => setTimeout(r, 1500))
    upgradePlan(planId)
    setLoading('')
    setSuccess(planId)
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--mint-dim)', border: '0.5px solid var(--mint)', borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
            <Crown size={12} color="var(--mint-text)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--mint-text)' }}>INVESTASI KECIL, DAMPAK BESAR</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', letterSpacing: -1, marginBottom: 10 }}>Pilih paket yang tepat untukmu</h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>Kurang dari Rp 300/hari — lebih murah dari segelas es teh 🧋</p>
        </div>

        {success && (
          <div style={{ background: 'var(--mint-dim)', border: '1px solid var(--mint)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Check size={18} color="var(--mint-text)" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--mint-text)' }}>Upgrade berhasil! 🎉</p>
              <p style={{ fontSize: 12, color: 'var(--text-sub)' }}>Selamat datang di plan {success.toUpperCase()}. Semua fitur sudah aktif.</p>
            </div>
          </div>
        )}

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          {PLANS.map(plan => {
            const isActive = user?.plan === plan.id
            const isPlanPro = plan.id === 'pro'
            return (
              <div key={plan.id} style={{
                background: isPlanPro ? 'var(--navy)' : 'var(--card)',
                border: `${isPlanPro ? '2px' : '0.5px'} solid ${isPlanPro ? 'var(--mint)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-xl)', padding: '28px 26px', position: 'relative',
              }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--mint)', color: 'var(--navy)', borderRadius: 20, padding: '4px 16px', fontSize: 10, fontWeight: 800, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                    PALING POPULER
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 34, height: 34, background: isPlanPro ? 'rgba(0,230,118,0.15)' : 'var(--white)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <plan.icon size={16} color={isPlanPro ? 'var(--mint)' : 'var(--navy-mid)'} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: isPlanPro ? '#fff' : 'var(--text)' }}>{plan.name}</span>
                  {isActive && <span style={{ fontSize: 9, fontWeight: 700, background: 'var(--mint)', color: 'var(--navy)', padding: '2px 8px', borderRadius: 10 }}>AKTIF</span>}
                </div>

                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: isPlanPro ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)', textDecoration: 'line-through', marginRight: 8 }}>Rp {plan.priceOld.toLocaleString('id-ID')}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: isPlanPro ? 'rgba(255,87,34,0.2)' : 'var(--danger-bg)', color: isPlanPro ? '#ff8a65' : 'var(--danger)', padding: '2px 8px', borderRadius: 6 }}>−50%</span>
                </div>
                <p style={{ fontSize: 30, fontWeight: 800, color: isPlanPro ? '#fff' : 'var(--text)', letterSpacing: -1, marginBottom: 4 }}>
                  Rp {plan.price.toLocaleString('id-ID')}<span style={{ fontSize: 13, fontWeight: 500, color: isPlanPro ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>/tahun</span>
                </p>
                {isPlanPro && <p style={{ fontSize: 12, color: 'var(--mint)', fontWeight: 600, marginBottom: 20 }}>Termasuk 350 AI credits gratis</p>}

                <div style={{ borderTop: `0.5px solid ${isPlanPro ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, paddingTop: 20, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {f.ok
                        ? <Check size={14} color={isPlanPro ? 'var(--mint)' : 'var(--mint-text)'} />
                        : <X size={14} color={isPlanPro ? 'rgba(255,255,255,0.2)' : 'var(--border)'} />
                      }
                      <span style={{ fontSize: 13, color: f.ok ? (isPlanPro ? '#fff' : 'var(--text)') : (isPlanPro ? 'rgba(255,255,255,0.3)' : 'var(--text-muted)') }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => !isActive && handleUpgrade(plan.id)}
                  disabled={isActive || loading === plan.id}
                  style={{
                    width: '100%', padding: 14, borderRadius: 'var(--radius-md)', border: 'none', cursor: isActive ? 'default' : 'pointer',
                    background: isActive ? (isPlanPro ? 'rgba(255,255,255,0.1)' : 'var(--white)') : (isPlanPro ? 'var(--mint)' : 'var(--navy)'),
                    color: isActive ? (isPlanPro ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)') : (isPlanPro ? 'var(--navy)' : 'var(--mint)'),
                    fontSize: 14, fontWeight: 700, fontFamily: 'var(--font)', transition: 'opacity 0.15s',
                    opacity: loading === plan.id ? 0.7 : 1,
                  }}>
                  {loading === plan.id ? 'Memproses...' : isActive ? 'Plan Aktif' : `Mulai dengan ${plan.name} →`}
                </button>
                <p style={{ fontSize: 11, color: isPlanPro ? 'rgba(255,255,255,0.35)' : 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                  Rp {plan.price.toLocaleString('id-ID')}/tahun · Aktif 365 hari
                </p>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          Sudah punya Starter dan mau upgrade ke PRO? Kamu cuma bayar selisihnya — dihitung proporsional dari sisa hari berlangganan.
        </p>

        {/* Powered by note */}
        <div style={{ textAlign: 'center', marginTop: 24, padding: '16px', background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Pembayaran aman diproses oleh</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Xendit · Midtrans</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Transfer Bank · QRIS · GoPay · OVO · Kartu Kredit</p>
        </div>
      </div>
    </div>
  )
}
