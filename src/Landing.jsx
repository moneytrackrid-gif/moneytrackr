import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const fmt = (n) => `Rp ${n.toLocaleString('id-ID')}`

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
  { q: 'Bedanya FREE dan PRO apa?', a: 'FREE sudah cukup untuk mulai — budget, transaksi, dan laporan sudah ada. PRO nambah AI Advisor, scan struk, dan Goals dengan deadline.' },
  { q: 'Kalau ga cocok, bisa refund?', a: 'Ada trial 7 hari. Kalau ga puas dalam 7 hari pertama, refund penuh — tidak ada pertanyaan.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [counter, setCounter] = useState({ users: 0, saved: 0 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounter({ users: 1240, saved: 847000000 })
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8faff', color: '#0d2137', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 5vw', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(248,250,255,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '0.5px solid rgba(13,33,55,0.08)' : 'none', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: '#0d2137', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#00e676' }}>mt</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0d2137', letterSpacing: -0.5 }}>money<span style={{ color: '#00e676' }}>trackr</span></span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid rgba(13,33,55,0.15)', background: 'transparent', fontSize: 13, fontWeight: 600, color: '#0d2137', cursor: 'pointer', fontFamily: 'inherit' }}>Masuk</button>
          <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', borderRadius: 20, border: 'none', background: '#0d2137', fontSize: 13, fontWeight: 700, color: '#00e676', cursor: 'pointer', fontFamily: 'inherit' }}>Coba Gratis →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 5vw 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,230,118,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(13,33,55,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 28, fontSize: 12, fontWeight: 700, color: '#064a22', letterSpacing: 0.3 }}>
          ✦ Lebih dari 1.200 user aktif
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 24, maxWidth: 800 }}>
          Nabung bisa,<br />
          <span style={{ color: '#00e676', WebkitTextStroke: '1px #00b85c' }}>tapi tetap hidup enak.</span>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: '#3a5a7a', lineHeight: 1.7, maxWidth: 560, marginBottom: 40 }}>
          moneytrackr bantu kamu track semua pengeluaran, atur budget, dan capai goals finansial — tanpa spreadsheet, tanpa ribet.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 60 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', borderRadius: 30, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 24px rgba(13,33,55,0.2)', transition: 'transform 0.15s' }}
            onMouseEnter={e => e.target.style.transform='scale(1.04)'}
            onMouseLeave={e => e.target.style.transform='scale(1)'}>
            Mulai Gratis Sekarang →
          </button>
          <button style={{ padding: '14px 32px', borderRadius: 30, border: '1.5px solid rgba(13,33,55,0.15)', background: 'transparent', color: '#0d2137', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            ▶ Lihat Demo
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '1.200+', label: 'User aktif' },
            { value: 'Rp 847 jt+', label: 'Total tabungan user' },
            { value: '4.9 ⭐', label: 'Rating rata-rata' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0d2137', letterSpacing: -0.5 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#7a9ab8', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PAIN POINTS */}
      <section style={{ padding: '80px 5vw', background: '#0d2137' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00e676', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Kamu pernah ngerasain ini?</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 48 }}>Gajian, seminggu kemudian bingung<br />duitnya kemana.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { emoji: '😵', title: '"Udah gajian tapi kok habis lagi?"', desc: 'Punya banyak dompet digital, tapi ga bisa lihat total saldo semua di satu tempat.' },
              { emoji: '📊', title: '"Coba bikin budget di spreadsheet, nyerah di minggu pertama."', desc: 'Spreadsheet ribet, rumusnya error, zoom in-out di HP, akhirnya males.' },
              { emoji: '💸', title: '"Niat nabung ada, tapi duitnya habis duluan."', desc: 'Kalau nunggu sisa, ga akan pernah ada sisa. Harus ada sistem yang pisahkan dari awal.' },
            ].map(p => (
              <div key={p.title} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.emoji}</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.5 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 40, lineHeight: 1.7 }}>
            Bukan karena kamu ga disiplin.<br />
            <strong style={{ color: '#00e676' }}>Kamu cuma belum ketemu sistem yang pas.</strong>
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 5vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Fitur</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Semua yang kamu butuhkan<br />untuk kontrol penuh.</h2>
          <p style={{ textAlign: 'center', fontSize: 15, color: '#5a7a9a', marginBottom: 60 }}>Bukan cuma catat pengeluaran. moneytrackr bantu kamu <strong>paham pola</strong> dan <strong>ambil keputusan yang lebih baik.</strong></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: '#fff', border: '0.5px solid #ddeeff', borderRadius: 16, padding: '24px 22px', position: 'relative' }}>
                {f.pro && <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, fontWeight: 700, background: '#0d2137', color: '#00e676', padding: '3px 8px', borderRadius: 6 }}>PRO</span>}
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
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 60 }}>Cuma butuh 5 menit. Serius.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { num: '1', title: 'Daftar gratis', desc: 'Buat akun dalam 30 detik. Tidak perlu kartu kredit.' },
              { num: '2', title: 'Set budget kamu', desc: 'Masukkan penghasilan, tentukan limit tiap kategori.' },
              { num: '3', title: 'Catat & lihat polanya', desc: 'Catat pengeluaran, lihat laporan, ambil keputusan lebih baik.' },
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

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 5vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Testimoni</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 48 }}>Yang udah pakai,<br />ngomong apa?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#fff', border: '0.5px solid #ddeeff', borderRadius: 16, padding: '24px 22px' }}>
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
      <section style={{ padding: '100px 5vw', background: '#0d2137' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00e676', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Harga</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 12 }}>Investasi kecil,<br />dampak besar.</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>Kurang dari segelas kopi per bulan.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {/* FREE */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px 24px', textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>FREE</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 4 }}>Rp 0</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Selamanya gratis</div>
              {['Catat transaksi', 'Budget per kategori', 'Laporan bulanan', '1 dompet'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ color: '#00e676', fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                </div>
              ))}
              <button onClick={() => navigate('/login')} style={{ width: '100%', marginTop: 24, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Mulai Gratis
              </button>
            </div>
            {/* PRO */}
            <div style={{ background: '#00e676', borderRadius: 20, padding: '28px 24px', textAlign: 'left', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#0d2137', color: '#00e676', fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>PALING POPULER</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#064a22', marginBottom: 8 }}>PRO</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#0d2137', letterSpacing: -1, marginBottom: 2 }}>Rp 99.000</div>
              <div style={{ fontSize: 12, color: '#064a22', marginBottom: 4 }}>per 3 bulan</div>
              <div style={{ fontSize: 11, color: '#064a22', marginBottom: 24, opacity: 0.7 }}>~Rp 33.000/bulan</div>
              {['Semua fitur FREE', 'AI Financial Advisor', 'Goals dengan deadline', 'Scan struk otomatis', 'AI Report Analyzer', 'Financial Health Score'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ color: '#0d2137', fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#0d2137', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
              <button onClick={() => navigate('/login')} style={{ width: '100%', marginTop: 24, padding: '12px', borderRadius: 12, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                Upgrade ke PRO →
              </button>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Garansi refund 7 hari · Tidak perlu kartu kredit · Bisa cancel kapan saja</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 5vw', background: '#f8faff' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, marginBottom: 48 }}>Pertanyaan yang sering ditanya</h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '0.5px solid #ddeeff', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#0d2137' }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: '#00b85c', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: 14, color: '#5a7a9a', lineHeight: 1.7, paddingBottom: 20 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 5vw', background: '#0d2137', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#fff', letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
          Mulai atur duit kamu<br /><span style={{ color: '#00e676' }}>hari ini.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>Gratis selamanya. Upgrade kapan kamu mau.</p>
        <button onClick={() => navigate('/login')} style={{ padding: '16px 40px', borderRadius: 30, border: 'none', background: '#00e676', color: '#0d2137', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 32px rgba(0,230,118,0.3)' }}>
          Daftar Gratis Sekarang →
        </button>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 16 }}>Tidak perlu kartu kredit · Setup dalam 2 menit</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 5vw', background: '#07112a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: '#00e676', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#0d2137' }}>mt</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>moneytrackr © 2025</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privasi', 'Syarat & Ketentuan', 'Kontak'].map(l => (
            <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
