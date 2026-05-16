import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const features = [
  { icon: '🎯', title: 'Goals dengan Deadline', desc: 'Set target nabung — liburan, laptop, dana darurat. Pantau progress tiap bulan, otomatis.', pro: false },
  { icon: '📊', title: 'Budget Otomatis', desc: 'Setup budget sekali, moneytrackr yang remind kalau kamu udah mau over. Ga perlu spreadsheet.', pro: false },
  { icon: '✨', title: 'AI Financial Advisor', desc: 'Tanya apa aja soal keuanganmu. AI kasih saran yang personal berdasarkan data kamu — bukan jawaban generik.', pro: true },
  { icon: '📸', title: 'Scan Struk', desc: 'Foto struk belanja, langsung tercatat otomatis. Ga perlu ketik manual satu-satu.', pro: true },
  { icon: '📈', title: 'Laporan Visual', desc: 'Lihat ke mana duit kamu pergi tiap bulan. Grafik yang gampang dibaca, bukan tabel membingungkan.', pro: false },
  { icon: '🔒', title: 'Data Kamu, Privasi Kamu', desc: 'Tidak ada iklan. Tidak ada penjualan data. Mode privasi untuk sembunyikan saldo.', pro: false },
]

const testimonials = [
  { name: 'Ayu R.', job: 'Fresh Graduate', text: 'Baru 2 minggu pakai, udah sadar kemana aja duit gajian gue selama ini. Ternyata kebanyakan jajan 😅', avatar: '🧕' },
  { name: 'Rafi M.', job: 'Freelancer', text: 'Penghasilan ga tetap jadi susah ngatur. Sejak pakai moneytrackr, akhirnya bisa nabung tiap bulan.', avatar: '👨‍💻' },
  { name: 'Sinta K.', job: 'Karyawan Swasta', text: 'Goals-nya keren banget. Nabung buat liburan Bali jadi berasa ada tujuannya, ga cuma "sisain duit"', avatar: '👩‍💼' },
]

const faqs = [
  { q: 'Apakah data keuanganku aman?', a: 'Ya. Data kamu dienkripsi dan disimpan di server aman. Kami tidak pernah menjual data ke pihak ketiga.' },
  { q: 'Apakah bisa dipakai di HP?', a: 'Bisa! moneytrackr bisa diinstall langsung dari browser di HP kamu, tanpa perlu download dari App Store.' },
  { q: 'Kalau ga cocok, bisa refund?', a: 'Ada garansi 7 hari. Kalau ga puas dalam 7 hari pertama, refund penuh — tidak ada pertanyaan.' },
  { q: 'Harus bayar berapa?', a: 'Rp 147.000 untuk 3 bulan penuh. Semua fitur langsung aktif — Goals, Budget, Laporan, Scan Struk, semuanya.' },
  { q: 'Bisa cancel kapan aja?', a: 'Bisa. Tidak ada kontrak, tidak ada biaya tersembunyi. Cancel kapan aja kamu mau.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  

  const handleBayar = () => {
    window.open('https://moneytrackr.myr.id/m/moneytrackr-3-month', '_blank')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8faff', color: '#0d2137', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 5vw', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(248,250,255,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '0.5px solid rgba(13,33,55,0.08)' : 'none', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" alt="moneytrackr" style={{ height: 40, objectFit: 'contain', maxWidth: 160 }} />
        </div>
        {user ? (
          <button onClick={() => navigate('/dashboard')} style={{ padding: '9px 20px', borderRadius: 20, border: 'none', background: '#0d2137', fontSize: 13, fontWeight: 700, color: '#00e676', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
        ) : (
          <button onClick={() => navigate('/login')} style={{ padding: '9px 20px', borderRadius: 20, border: 'none', background: '#0d2137', fontSize: 13, fontWeight: 700, color: '#00e676', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Masuk
          </button>
        )}
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 5vw 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '0%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,230,118,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '0%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(13,33,55,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20, padding: '5px 16px', marginBottom: 32, fontSize: 12, fontWeight: 700, color: '#064a22' }}>
          ☕ Lebih murah dari secangkir es kopsu
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: -2.5, marginBottom: 24, maxWidth: 820 }}>
          Akhirnya, kamu<br />
          <span style={{ color: '#00e676', WebkitTextStroke: '1px #00b85c' }}>ga boncos lagi</span> tiap bulan.
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#3a5a7a', lineHeight: 1.7, maxWidth: 520, marginBottom: 16 }}>
          moneytrackr bantu kamu track pengeluaran, atur budget, dan capai goals finansial — semua di satu tempat.
        </p>

        <p style={{ fontSize: 14, color: '#00b85c', fontWeight: 700, marginBottom: 40 }}>
          
        </p>

        <button onClick={() => document.getElementById('harga').scrollIntoView({behavior:'smooth'})} style={{ padding: '16px 40px', borderRadius: 30, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 32px rgba(13,33,55,0.2)', transition: 'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 12px 40px rgba(13,33,55,0.3)' }}
          onMouseLeave={e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 8px 32px rgba(13,33,55,0.2)' }}>
          Coba Sekarang
        </button>

        <p style={{ fontSize: 12, color: '#7a9ab8', marginTop: 16 }}>Sudah 1.200+ Gen Z & Millennial pakai moneytrackr ⭐⭐⭐⭐⭐</p>

        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 40 }}>
          {[
            { value: '1.200+', label: 'User aktif' },
            { value: '4.9 ⭐', label: 'Rating rata-rata' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0d2137', letterSpacing: -0.5 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#7a9ab8', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* KOPSU PRICING HIGHLIGHT */}
      <section style={{ padding: '0 5vw 80px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#0d2137', borderRadius: 24, padding: '32px 40px', maxWidth: 640, width: '100%', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 56 }}>☕</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Coba hitung:</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.6, marginBottom: 4 }}>
              Segelas es kopsu = <span style={{ color: '#ff8a65' }}>Rp 30.000–40.000</span>
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.6 }}>
              moneytrackr 3 bulan = <span style={{ color: '#00e676' }}>Rp 147.000</span>
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>
              Rp 1.100/hari. Lebih murah dari es kopsu. Dan hasilnya? Kamu ga boncos lagi.
            </p>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section style={{ padding: '80px 5vw', background: '#0d2137' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00e676', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Eh, ini familiar ga?</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 48, lineHeight: 1.2 }}>Duit selalu habis padahal merasa udah hemat.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { emoji: '🫠', title: '"Tanggal 15 udah ketar-ketir nunggu gajian."', desc: 'Padahal awal bulan kayaknya masih ada duit. Entah kemana perginya, ga ada jejaknya sama sekali.' },
              { emoji: '📱', title: '"GoPay, OVO, Dana, rekening — duitnya ada di mana-mana."', desc: 'Pas mau bayar sesuatu malah bingung ada di mana, dan berapa total semuanya. Ribet banget.' },
              { emoji: '🔁', title: '"Tiap bulan plan-nya sama: nabung lebih banyak. Hasilnya sama juga."', desc: 'Niat ada, tapi tanpa sistem yang jelas, niat doang ga kemana-mana.' },
            ].map(p => (
              <div key={p.title} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.emoji}</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.5 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,0.55)', marginTop: 48, lineHeight: 1.8 }}>
            Bukan salah kamu. Emang ga ada yang ngajarin cara ngatur duit yang beneran simpel.<br />
            <strong style={{ color: '#00e676', fontSize: 17 }}>moneytrackr dibuat buat ngisi gap itu.</strong>
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id='fitur' style={{ padding: '100px 5vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Fitur Lengkap</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Semua yang kamu butuhkan<br />untuk kontrol penuh.</h2>
          <p style={{ textAlign: 'center', fontSize: 15, color: '#5a7a9a', marginBottom: 60 }}>Bukan cuma catat pengeluaran — moneytrackr bantu kamu <strong>paham pola</strong> dan <strong>ambil keputusan yang lebih baik.</strong></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: '#fff', border: '0.5px solid #ddeeff', borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#0d2137' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#5a7a9a', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 5vw', background: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Cara Kerja</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 60 }}>Setup dalam 5 menit.<br />Hasilnya seumur hidup.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { num: '1', title: 'Daftar & bayar', desc: 'Buat akun, bayar Rp 147.000. Semua fitur langsung aktif selama 3 bulan.' },
              { num: '2', title: 'Set budget kamu', desc: 'Masukkan penghasilan, tentukan limit tiap kategori dalam 2 menit.' },
              { num: '3', title: 'Catat & lihat polanya', desc: 'Catat pengeluaran harian, lihat laporan, ambil keputusan lebih baik.' },
            ].map(s => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, background: '#0d2137', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#00e676', margin: '0 auto 16px' }}>{s.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#5a7a9a', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 5vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Testimoni</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 48 }}>Yang udah pakai,<br />ngomong apa?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#fff', border: '0.5px solid #ddeeff', borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>{'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ fontSize: 13 }}>{s}</span>)}</div>
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

      {/* PRICING — 1 PLAN ONLY */}
      <section id='harga' style={{ padding: '100px 5vw', background: '#0d2137' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00e676', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Harga</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 12 }}>Investasi kecil,<br />dampak besar untuk masa depanmu.</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 48 }}>Tidak ada hidden fee. Bayar sekali, nikmati semua fiturnya.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: '#00e676', borderRadius: 24, padding: '36px 28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#0d2137', color: '#00e676', fontSize: 10, fontWeight: 800, padding: '5px 16px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: 1 }}>
                ☕ LEBIH MURAH DARI ES KOPSU
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#064a22', marginBottom: 4 }}>3 Bulan</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#0d2137', letterSpacing: -2, lineHeight: 1 }}>Rp 147.000</div>
              <div style={{ fontSize: 14, color: '#064a22', marginBottom: 6 }}>untuk 3 bulan penuh</div>
              <div style={{ fontSize: 12, color: '#064a22', opacity: 0.7, marginBottom: 28 }}>= Rp 1.633/hari</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, textAlign: 'left' }}>
                {['Budget otomatis', 'AI Financial Advisor', 'Laporan visual', 'Scan struk otomatis', 'Goals dengan deadline', 'Financial Health Score'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#0d2137', fontSize: 14, fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: 13, color: '#0d2137', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleBayar} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                Mulai 3 Bulan
              </button>
            </div>
            <div style={{ background: '#00e676', borderRadius: 24, padding: '36px 28px', position: 'relative', border: '3px solid #fff' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#0d2137', fontSize: 10, fontWeight: 800, padding: '5px 16px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: 1 }}>
                🔥 HEMAT 16%
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#064a22', marginBottom: 8 }}>6 Bulan</div>
              <div style={{ fontSize: 15, color: '#064a22', textDecoration: 'line-through', opacity: 0.6, marginBottom: 4 }}>Rp 294.000</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: '#0d2137', letterSpacing: -2, lineHeight: 1, marginBottom: 6 }}>Rp 247.000</div>
              <div style={{ fontSize: 12, color: '#064a22', opacity: 0.7, marginBottom: 28 }}>= Rp 1.372/hari · Hemat Rp 47.000</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, textAlign: 'left' }}>
                {['Budget otomatis', 'AI Financial Advisor', 'Laporan visual', 'Scan struk otomatis', 'Goals dengan deadline', 'Financial Health Score'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#0d2137', fontSize: 14, fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: 13, color: '#0d2137', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.open('https://moneytrackr.myr.id/m/moneytrackr-3-month', '_blank')} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                Mulai 6 Bulan
              </button>
            </div>
          </div>
          <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left' }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>🛡️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Garansi Refund 7 Hari</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Kalau dalam 7 hari kamu merasa Moneytrackr tidak bermanfaat sama sekali, kami kembalikan uangmu. Tidak ada pertanyaan.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id='faq' style={{ padding: '100px 5vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, marginBottom: 48 }}>Ada yang mau ditanya?</h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '0.5px solid #ddeeff', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#0d2137' }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: '#00b85c', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: 14, color: '#5a7a9a', lineHeight: 1.7, paddingBottom: 20 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 5vw', background: '#0d2137', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>☕ Lebih murah dari es kopsu. Lebih berguna juga.</p>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, color: '#fff', letterSpacing: -2, marginBottom: 16, lineHeight: 1.08 }}>
          Kapan lagi mau mulai kalau bukan <span style={{ color: '#00e676' }}>sekarang?</span>
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>Rp 147.000 untuk 3 bulan. Kalau ga worth it, refund.</p>
        <button onClick={() => document.getElementById('harga').scrollIntoView({behavior:'smooth'})} style={{ padding: '18px 48px', borderRadius: 30, border: 'none', background: '#00e676', color: '#0d2137', fontSize: 17, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 40px rgba(0,230,118,0.35)' }}>
          Coba Sekarang
        </button>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>Ga perlu kartu kredit · Setup 2 menit · Garansi refund 7 hari</p>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#07112a', padding: '48px 6vw 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 40, flexWrap: 'wrap' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, background: '#00e676', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#0d2137' }}>mt</div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>money<span style={{ color: '#00e676' }}>trackr</span></span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 16, maxWidth: 260 }}>
                moneytrackr adalah aplikasi keuangan buat kamu yang ingin ngatur keuangan tanpa ribet.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>Layanan Pelanggan:</p>
              <a href='https://wa.me/6285777066441' style={{ fontSize: 13, color: '#00e676', fontWeight: 600, textDecoration: 'none' }}>+62 857-7706-6441</a>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {['ig', 'tt', 'fb'].map(s => (
                  <div key={s} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>{s === 'ig' ? '📸' : s === 'tt' ? '🎵' : '👤'}</div>
                ))}
              </div>
            </div>
            {/* Produk */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Produk</p>
              {[
                { label: 'Fitur', href: '#fitur' },
                { label: 'Harga', href: '#harga' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Masuk', href: '/login' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color='#00e676'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.4)'}
                >{l.label}</a>
              ))}
            </div>
            {/* Sumber Daya */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Sumber Daya</p>
              {[
                { label: 'Bantuan', href: 'https://wa.me/6285777066441' },
                { label: 'Syarat & Ketentuan', href: '/syarat' },
                { label: 'Kebijakan Privasi', href: '/privasi' },
              ].map(l => (
                <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color='#00e676'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.4)'}
                >{l.label}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2025 moneytrackr. Hak cipta dilindungi.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
