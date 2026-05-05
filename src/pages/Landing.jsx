import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const features = [
  { icon: '🎯', title: 'Goals dengan Deadline', desc: 'Set target nabung — liburan, laptop, dana darurat. Pantau progress tiap bulan, otomatis.' },
  { icon: '📊', title: 'Budget Otomatis', desc: 'Setup budget sekali, moneytrackr yang remind kalau kamu udah mau over. Ga perlu spreadsheet.' },
  { icon: '📸', title: 'Scan Struk', desc: 'Foto struk belanja, langsung tercatat otomatis. Ga perlu ketik manual satu-satu.' },
  { icon: '📈', title: 'Laporan Bulanan', desc: 'Lihat ke mana duit kamu pergi tiap bulan. Grafik yang gampang dibaca, bukan tabel membingungkan.' },
  { icon: '🔒', title: 'Data Kamu, Privasi Kamu', desc: 'Tidak ada iklan. Tidak ada penjualan data. Mode privasi untuk sembunyikan saldo.' },
  { icon: '📱', title: 'Semua Device', desc: 'Install dari browser di HP atau laptop. Tidak perlu App Store. Data selalu sinkron.' },
]

const testimonials = [
  { name: 'Ayu R.', job: 'Fresh Graduate', text: 'Baru 2 minggu pakai, udah sadar kemana aja duit gajian gue selama ini. Ternyata kebanyakan jajan 😅', avatar: '🧕' },
  { name: 'Rafi M.', job: 'Freelancer', text: 'Penghasilan ga tetap jadi susah ngatur. Sejak pakai moneytrackr, akhirnya bisa nabung tiap bulan.', avatar: '👨‍💻' },
  { name: 'Sinta K.', job: 'Karyawan Swasta', text: 'Goals-nya keren banget. Nabung buat liburan Bali jadi berasa ada tujuannya, ga cuma "sisain duit"', avatar: '👩‍💼' },
]

const faqs = [
  { q: 'Apakah data keuanganku aman?', a: 'Ya. Data kamu dienkripsi dan disimpan di server aman. Kami tidak pernah menjual data ke pihak ketiga.' },
  { q: 'Apakah bisa dipakai di HP?', a: 'Bisa! moneytrackr bisa diinstall langsung dari browser di HP kamu, tanpa perlu download dari App Store.' },
  { q: 'Kalau tidak bermanfaat, bisa refund?', a: 'Ada garansi 7 hari. Kalau kamu merasa moneytrackr tidak bermanfaat dalam 7 hari pertama, refund penuh — tidak ada pertanyaan, tidak ada ribet.' },
  { q: 'Harus bayar berapa?', a: 'Rp 99.000 untuk 3 bulan penuh. Semua fitur langsung aktif — Goals, Budget, Laporan, Scan Struk, semuanya.' },
  { q: 'Bisa cancel kapan aja?', a: 'Bisa. Tidak ada kontrak, tidak ada biaya tersembunyi. Cancel kapan aja kamu mau.' },
]

const DashboardMockup = () => (
  <div style={{ background: '#f0f4f8', borderRadius: 16, padding: 12, boxShadow: '0 24px 80px rgba(13,33,55,0.18)', width: '100%', maxWidth: 520 }}>
    {/* Topbar */}
    <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 22, height: 22, background: '#0d2137', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#00e676' }}>mt</div>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#0d2137' }}>money<span style={{ color: '#00e676' }}>trackr</span></span>
      </div>
      <span style={{ fontSize: 10, color: '#7a9ab8' }}>Dashboard</span>
    </div>
    {/* Balance card */}
    <div style={{ background: '#0d2137', borderRadius: 10, padding: '14px 16px', marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -16, right: -16, width: 70, height: 70, background: 'rgba(0,230,118,0.1)', borderRadius: '50%' }} />
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>Total Saldo</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5, marginBottom: 8 }}>Rp 3.847.200</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 10px', fontSize: 9, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00e676' }} />Pemasukan Rp 5,5 jt
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 10px', fontSize: 9, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />Keluar Rp 1,65 jt
        </div>
      </div>
    </div>
    {/* Stats row */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
      {[
        { label: 'Pemasukan', val: 'Rp 5,5 jt', up: true },
        { label: 'Pengeluaran', val: 'Rp 1,65 jt', up: false },
        { label: 'Ditabung', val: 'Rp 500 rb', up: true },
      ].map(s => (
        <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '10px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 8, color: '#7a9ab8', marginBottom: 3 }}>{s.label}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0d2137' }}>{s.val}</div>
          <div style={{ fontSize: 8, color: s.up ? '#00b85c' : '#e07a00', marginTop: 2 }}>{s.up ? '+12%' : '-8%'}</div>
        </div>
      ))}
    </div>
    {/* Budget bars */}
    <div style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: '#0d2137', marginBottom: 8 }}>Budget Bulan Ini</div>
      {[
        { cat: 'Makan', pct: 70, color: '#00e676' },
        { cat: 'Transport', pct: 93, color: '#f59e0b' },
        { cat: 'Belanja', pct: 107, color: '#ef4444' },
      ].map(b => (
        <div key={b.cat} style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 8, color: '#0d2137', fontWeight: 500 }}>{b.cat}</span>
            <span style={{ fontSize: 8, color: b.pct > 100 ? '#ef4444' : '#7a9ab8' }}>{b.pct}%</span>
          </div>
          <div style={{ height: 4, background: '#f0f4f8', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, b.pct)}%`, height: '100%', background: b.color, borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function Landing() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff', color: '#0d2137', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 6vw', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(13,33,55,0.06)', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: '#0d2137', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#00e676' }}>mt</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0d2137', letterSpacing: -0.5 }}>money<span style={{ color: '#00e676' }}>trackr</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#5a7a9a', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/login')}>Masuk</span>
          <button onClick={() => navigate('/login')} style={{ padding: '9px 20px', borderRadius: 20, border: 'none', background: '#00e676', fontSize: 13, fontWeight: 700, color: '#0d2137', cursor: 'pointer', fontFamily: 'inherit' }}>
            Mulai Sekarang →
          </button>
        </div>
      </nav>

      {/* HERO — 2 kolom */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 6vw 80px', gap: '5vw', flexWrap: 'wrap' }}>
        {/* Left */}
        <div style={{ flex: 1, minWidth: 300, maxWidth: 560 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)', borderRadius: 20, padding: '5px 14px', marginBottom: 28, fontSize: 12, fontWeight: 700, color: '#064a22' }}>
            ☕ Lebih murah dari secangkir es kopsu
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
            Akhirnya, kamu<br />
            <span style={{ color: '#00e676' }}>ga boncos lagi</span><br />
            tiap bulan.
          </h1>
          <p style={{ fontSize: 17, color: '#4a6a8a', lineHeight: 1.7, marginBottom: 14, maxWidth: 460 }}>
            moneytrackr bantu kamu track pengeluaran, atur budget, dan capai goals finansial — semua di satu tempat.
          </p>
          <p style={{ fontSize: 13, color: '#00b85c', fontWeight: 700, marginBottom: 32 }}>
            Rp 99.000 / 3 bulan · Semua fitur · Garansi 7 hari
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', borderRadius: 30, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 24px rgba(13,33,55,0.18)' }}>
              Mulai Atur Keuanganku →
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex' }}>
              {['🧕','👨‍💻','👩‍💼','👨‍🎓','👩‍💻'].map((a, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: '#e8f5ff', border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{a}</div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 1 }}>{'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ fontSize: 11 }}>{s}</span>)}</div>
              <div style={{ fontSize: 12, color: '#7a9ab8', marginTop: 2 }}>1.200+ Gen Z & Millennial udah pakai</div>
            </div>
          </div>
        </div>
        {/* Right — mockup */}
        <div style={{ flex: 1, minWidth: 300, display: 'flex', justifyContent: 'center' }}>
          <DashboardMockup />
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: '#f8faff', borderTop: '0.5px solid #eef2ff', borderBottom: '0.5px solid #eef2ff', padding: '16px 6vw', display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {['🔒 Data terenkripsi & aman', '📱 Bisa di HP, tablet & laptop', '🇮🇩 Dari Indonesia, untuk Indonesia', '💳 Metode bayar lengkap'].map(t => (
          <span key={t} style={{ fontSize: 13, color: '#5a7a9a', fontWeight: 500 }}>{t}</span>
        ))}
      </div>

      {/* PAIN POINTS */}
      <section style={{ padding: '100px 6vw', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Jujur deh</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 48, lineHeight: 1.2 }}>Kamu pernah ngerasain<br />salah satu ini?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { emoji: '😵', title: '"Gajian, seminggu kemudian bingung duitnya kemana."', desc: 'Punya banyak e-wallet dan rekening, tapi ga bisa lihat total semua di satu tempat.' },
              { emoji: '📊', title: '"Udah coba bikin budget di spreadsheet, nyerah minggu pertama."', desc: 'Ribet, rumusnya error, zoom in-out di HP — akhirnya males dan dibiarkan.' },
              { emoji: '💸', title: '"Niat nabung ada, tapi duitnya selalu habis duluan."', desc: 'Kalau nunggu sisa baru nabung, ga akan pernah ada sisanya.' },
            ].map(p => (
              <div key={p.title} style={{ background: '#f8faff', border: '0.5px solid #eef2ff', borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.emoji}</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0d2137', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.5 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: '#7a9ab8', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 15, color: '#5a7a9a', marginTop: 48, lineHeight: 1.8 }}>
            Bukan karena kamu ga disiplin.<br />
            <strong style={{ color: '#0d2137' }}>Kamu cuma belum ketemu sistem yang pas — dan moneytrackr dibuat untuk itu.</strong>
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 6vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Cara Kerja</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Cuma butuh 5 menit.<br />Serius.</h2>
          <p style={{ fontSize: 15, color: '#5a7a9a', marginBottom: 60 }}>Setup sekali, jalan selamanya.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { num: '1', title: 'Masukkan semua dompet kamu', desc: 'Rekening bank, e-wallet — cukup masukin jumlah saldo. Saldo tidak otomatis sinkron, jadi sangat aman.' },
              { num: '2', title: 'Tentukan budget kamu', desc: 'Masukkan penghasilan dan tentukan limit masing-masing pos pengeluaran.' },
              { num: '3', title: 'Catat pengeluaran, lihat polanya', desc: 'Setiap kali belanja, catat. Di akhir bulan, kamu bisa lihat uang kamu kemana aja.' },
            ].map(s => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, background: '#0d2137', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#00e676', margin: '0 auto 16px' }}>{s.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#5a7a9a', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 6vw', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Fitur Lengkap</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Semua yang kamu butuhkan<br />untuk kontrol penuh.</h2>
          <p style={{ textAlign: 'center', fontSize: 15, color: '#5a7a9a', marginBottom: 60 }}>Bukan cuma catat pengeluaran — moneytrackr bantu kamu <strong>paham pola</strong> dan <strong>ambil keputusan yang lebih baik.</strong></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: '#f8faff', border: '0.5px solid #eef2ff', borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#0d2137' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#5a7a9a', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 6vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Testimoni</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 48 }}>Yang udah pakai,<br />ngomong apa?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#fff', border: '0.5px solid #eef2ff', borderRadius: 16, padding: '24px 22px', boxShadow: '0 1px 8px rgba(13,33,55,0.04)' }}>
                <div style={{ display: 'flex', gap: 1, marginBottom: 14 }}>{'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ fontSize: 13 }}>{s}</span>)}</div>
                <p style={{ fontSize: 13, color: '#3a5a7a', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: '#e8f5ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0d2137' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#7a9ab8' }}>{t.job}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '100px 6vw', background: '#0d2137' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00e676', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Harga</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 12 }}>Investasi kecil,<br />dampak besar.</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 48 }}>Tidak ada hidden fee. Bayar sekali, nikmati semua fiturnya.</p>
          <div style={{ background: '#00e676', borderRadius: 24, padding: '36px 32px', position: 'relative', marginBottom: 20 }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#0d2137', color: '#00e676', fontSize: 10, fontWeight: 800, padding: '5px 16px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: 1 }}>☕ LEBIH MURAH DARI ES KOPSU</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#064a22', marginBottom: 4 }}>moneytrackr</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: '#0d2137', letterSpacing: -2, lineHeight: 1 }}>Rp 99.000</div>
            <div style={{ fontSize: 14, color: '#064a22', marginBottom: 4 }}>untuk 3 bulan penuh</div>
            <div style={{ fontSize: 12, color: '#064a22', opacity: 0.7, marginBottom: 28 }}>= Rp 1.100/hari · Lebih murah dari es kopsu</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, textAlign: 'left' }}>
              {['Budget otomatis', 'Goals dengan deadline', 'Laporan bulanan', 'Scan struk otomatis', 'Financial Health Score', 'Data privat & aman', 'Akses semua platform', 'AI Report Analyzer'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#0d2137', fontSize: 14, fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#0d2137', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(13,33,55,0.08)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0d2137', marginBottom: 4 }}>🛡️ Garansi 7 Hari</div>
              <div style={{ fontSize: 12, color: '#064a22', lineHeight: 1.6 }}>Kalau kamu merasa moneytrackr tidak bermanfaat dalam 7 hari pertama, kami refund penuh. Tidak ada pertanyaan, tidak ada ribet.</div>
            </div>
            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
              Mulai Sekarang — Rp 99.000 →
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Garansi refund 7 hari · Tidak perlu kartu kredit · Cancel kapan aja</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 6vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, marginBottom: 48 }}>Ada yang mau ditanya?</h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '0.5px solid #ddeeff' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#0d2137' }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: '#00b85c', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              {openFaq === i && <p style={{ fontSize: 14, color: '#5a7a9a', lineHeight: 1.7, paddingBottom: 20 }}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 6vw', background: '#0d2137', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>☕ Harga segelas es kopsu. Dampaknya? Seumur hidup.</p>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, color: '#fff', letterSpacing: -2, marginBottom: 16, lineHeight: 1.08 }}>
          Akhirnya, kamu<br /><span style={{ color: '#00e676' }}>ga boncos lagi.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>Rp 99.000 untuk 3 bulan. Garansi 7 hari.</p>
        <button onClick={() => navigate('/login')} style={{ padding: '18px 48px', borderRadius: 30, border: 'none', background: '#00e676', color: '#0d2137', fontSize: 17, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 40px rgba(0,230,118,0.35)' }}>
          Mulai Sekarang — Rp 99.000 →
        </button>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>Tidak perlu kartu kredit · Setup 2 menit · Garansi refund 7 hari</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 6vw', background: '#07112a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: '#00e676', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#0d2137' }}>mt</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>moneytrackr © 2025 · Dari Indonesia, untuk Indonesia 🇮🇩</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privasi', 'Syarat & Ketentuan', 'Kontak'].map(l => (
            <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
