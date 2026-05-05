import { useNavigate } from 'react-router-dom'

const sections = [
  { title: '1. Ketentuan Penggunaan', content: 'moneytrackr ditawarkan kepada Anda, pengguna, dengan syarat penerimaan terhadap ketentuan, syarat, dan pemberitahuan yang tercantum dalam dokumen ini. Dengan menggunakan layanan moneytrackr, Anda menyatakan setuju untuk terikat dengan seluruh ketentuan yang berlaku.' },
  { title: '2. Gambaran Umum', content: 'Penggunaan Anda atas layanan ini merupakan persetujuan terhadap seluruh syarat dan ketentuan. Harap baca dengan seksama. Jika Anda tidak menyetujui syarat dan ketentuan ini, Anda harus segera menghentikan penggunaan layanan moneytrackr.' },
  { title: '3. Perubahan Layanan', content: 'moneytrackr berhak untuk mengubah, memodifikasi, memperbarui, atau menghentikan layanan sewaktu-waktu tanpa pemberitahuan sebelumnya. Dengan terus menggunakan layanan setelah perubahan dilakukan, Anda dianggap menyetujui perubahan tersebut.' },
  { title: '4. Pemberian Lisensi', content: 'moneytrackr memberikan Anda hak terbatas, non-eksklusif, dan tidak dapat dipindahtangankan untuk mengakses dan menggunakan platform ini untuk keperluan pribadi selama masa berlangganan. Anda tidak diperkenankan memodifikasi, menduplikasi, atau mendistribusikan platform kepada pihak lain.' },
  { title: '5. Biaya Berlangganan', content: 'Biaya berlangganan adalah sebesar Rp 147.000 untuk periode 6 (enam) bulan, setara dengan Rp 820/hari. Biaya ini belum termasuk pajak yang berlaku. Tagihan akan dikirimkan ke alamat email yang Anda daftarkan.' },
  { title: '6. Garansi Pengembalian Dana', content: 'moneytrackr menawarkan garansi pengembalian dana penuh dalam 7 (tujuh) hari pertama sejak tanggal pembayaran. Permintaan refund dapat diajukan melalui WhatsApp ke +6285777066441 atau email ke hilmaannn@gmail.com. Setelah periode 7 hari, pembayaran tidak dapat dikembalikan.' },
  { title: '7. Kerahasiaan Data', content: 'Data keuangan yang Anda masukkan ke dalam moneytrackr bersifat rahasia dan pribadi. moneytrackr berkomitmen untuk tidak membagikan, menjual, atau mengungkapkan data Anda kepada pihak ketiga manapun tanpa persetujuan eksplisit dari Anda.' },
  { title: '8. Kebijakan Privasi', content: 'Informasi Anda aman bersama kami. moneytrackr tidak akan menyalahgunakan atau menjual data Anda kepada pihak manapun. Kami hanya menggunakan informasi pribadi Anda untuk keperluan operasional layanan.' },
  { title: '9. Keamanan', content: 'moneytrackr mengambil langkah-langkah yang wajar untuk mencegah pelanggaran keamanan. Data Anda dienkripsi dan disimpan di server yang aman.' },
  { title: '10. Penghentian Layanan', content: 'moneytrackr dapat menghentikan akses Anda terhadap layanan apabila Anda melanggar ketentuan yang berlaku, menggunakan layanan untuk tujuan yang melanggar hukum, atau tidak memenuhi kewajiban pembayaran.' },
  { title: '11. Hak Cipta', content: 'Platform ini dimiliki dan dioperasikan oleh moneytrackr. Seluruh materi pada platform ini dilindungi oleh hukum hak cipta Indonesia. Tidak ada materi yang boleh disalin atau didistribusikan tanpa izin tertulis.' },
  { title: '12. Hukum yang Berlaku', content: 'Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia.' },
  { title: '13. Kontak', content: 'Untuk pertanyaan atau permintaan refund, silakan hubungi kami melalui WhatsApp: +6285777066441 atau email: hilmaannn@gmail.com.' },
]

export default function Syarat() {
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
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Syarat & Ketentuan</h1>
          <p style={{ fontSize: 14, color: '#7a9ab8' }}>Berlaku sejak 6 Mei 2025</p>
        </div>

        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '0.5px solid #eef2ff' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0d2137', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: '#5a7a9a', lineHeight: 1.8 }}>{s.content}</p>
          </div>
        ))}

        <div style={{ background: '#0d2137', borderRadius: 16, padding: '24px', marginTop: 40 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Catatan Hukum</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>moneytrackr adalah produk digital yang dikembangkan secara independen.<br />© 2025 moneytrackr. Seluruh hak dilindungi undang-undang.</p>
        </div>
      </div>
    </div>
  )
}
