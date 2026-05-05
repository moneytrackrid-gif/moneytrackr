import { useNavigate } from 'react-router-dom'

const sections = [
  { title: 'Data yang Kami Kumpulkan', content: 'Kami mengumpulkan informasi yang Anda berikan saat mendaftar, seperti nama dan alamat email. Kami juga menyimpan data keuangan yang Anda masukkan ke dalam aplikasi, seperti catatan transaksi, budget, dan goals. Data ini disimpan secara aman dan terenkripsi.' },
  { title: 'Bagaimana Kami Menggunakan Data Anda', content: 'Data Anda digunakan semata-mata untuk menjalankan layanan moneytrackr — menampilkan laporan, menghitung budget, dan memantau goals Anda. Kami tidak menggunakan data Anda untuk keperluan iklan atau analitik pihak ketiga.' },
  { title: 'Keamanan Data', content: 'Data Anda dienkripsi menggunakan standar industri dan disimpan di server yang aman. Kami menggunakan Supabase sebagai penyedia database yang memiliki sertifikasi keamanan SOC 2. Kami mengambil langkah-langkah yang wajar untuk mencegah akses tidak sah.' },
  { title: 'Tidak Ada Penjualan Data', content: 'moneytrackr tidak pernah dan tidak akan pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan komersial. Data Anda adalah milik Anda sepenuhnya.' },
  { title: 'Tidak Ada Iklan', content: 'moneytrackr adalah layanan berbayar tanpa iklan. Kami tidak menampilkan iklan dan tidak membagikan data Anda kepada pengiklan.' },
  { title: 'Mode Privasi', content: 'Aplikasi moneytrackr dilengkapi dengan mode privasi yang memungkinkan Anda menyembunyikan saldo dan data keuangan dari tampilan — berguna ketika Anda menggunakan aplikasi di tempat umum.' },
  { title: 'Penghapusan Data', content: 'Anda dapat meminta penghapusan seluruh data akun Anda kapan saja dengan menghubungi kami melalui WhatsApp atau email. Data akan dihapus secara permanen dalam 7 hari kerja.' },
  { title: 'Cookie', content: 'moneytrackr menggunakan cookie dan local storage hanya untuk keperluan autentikasi dan menyimpan preferensi tampilan Anda. Kami tidak menggunakan cookie untuk pelacakan atau iklan.' },
  { title: 'Perubahan Kebijakan', content: 'Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Jika ada perubahan signifikan, kami akan memberitahu Anda melalui email yang terdaftar.' },
  { title: 'Kontak', content: 'Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin mengajukan permintaan penghapusan data, silakan hubungi kami melalui WhatsApp: +6285777066441 atau email: hilmaannn@gmail.com.' },
]

export default function Privasi() {
  const navigate = useNavigate()
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8faff', minHeight: '100vh', color: '#0d2137' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* NAV */}
      <nav style={{ padding: '0 6vw', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '0.5px solid #eef2ff' }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{ width: 30, height: 30, background: '#0d2137', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#00e676' }}>mt</div>
          <span style={{ fontSize: 15, fontWeight: 800 }}>money<span style={{ color: '#00e676' }}>trackr</span></span>
        </div>
        <button onClick={() => navigate('/')} style={{ padding: '8px 18px', borderRadius: 20, border: 'none', background: '#0d2137', color: '#00e676', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>← Kembali</button>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 6vw 100px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00b85c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Kebijakan Privasi</h1>
          <p style={{ fontSize: 14, color: '#7a9ab8', marginBottom: 20 }}>Berlaku sejak 6 Mei 2025</p>
          <div style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 14, color: '#064a22', lineHeight: 1.7 }}>🔒 <strong>Singkatnya:</strong> Data kamu aman. Kami tidak jual, tidak iklankan, dan tidak bagikan ke siapapun. Kamu punya kendali penuh atas datamu.</p>
          </div>
        </div>

        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '0.5px solid #eef2ff' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0d2137', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: '#5a7a9a', lineHeight: 1.8 }}>{s.content}</p>
          </div>
        ))}

        <div style={{ background: '#0d2137', borderRadius: 16, padding: '24px', marginTop: 40 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Pertanyaan tentang privasi?</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>Hubungi kami via WhatsApp <a href="https://wa.me/6285777066441" style={{ color: '#00e676' }}>+6285777066441</a> atau email <a href="mailto:hilmaannn@gmail.com" style={{ color: '#00e676' }}>hilmaannn@gmail.com</a></p>
        </div>
      </div>
    </div>
  )
}
