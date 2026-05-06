import { useState, useRef } from 'react'
import { Camera, X, Check, Loader } from 'lucide-react'
import { useData } from '../context/DataContext'

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`

export default function ReceiptScanner({ onClose }) {
  const { addTransaction } = useData()
  const [image, setImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImage(ev.target.result)
      setImageBase64(ev.target.result.split(',')[1])
      setResult(null)
    }
    reader.readAsDataURL(file)
  }

  const handleScan = async () => {
    if (!imageBase64) return
    setScanning(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
              },
              {
                type: 'text',
                text: `Analisis struk/bon ini dan ekstrak informasi berikut dalam format JSON:
{
  "name": "nama merchant atau deskripsi singkat pembelian",
  "amount": angka total yang dibayar (tanpa simbol mata uang),
  "category": salah satu dari ["Makan", "Transportasi", "Belanja", "Hiburan", "Kesehatan", "Pendidikan", "Tagihan", "Lainnya"],
  "icon": emoji yang sesuai dengan kategori,
  "date": "tanggal dalam format YYYY-MM-DD jika ada, atau null"
}
Hanya balas dengan JSON, tanpa teks lain.`,
              }
            ]
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      setResult(parsed)
    } catch (err) {
      alert('Gagal scan struk. Coba lagi dengan foto yang lebih jelas.')
    }
    setScanning(false)
  }

  const handleSave = async () => {
    if (!result) return
    setSaving(true)
    await addTransaction({
      type: 'expense',
      name: result.name,
      amount: result.amount,
      category: result.category,
      icon: result.icon,
      date: result.date ? new Date(result.date).toISOString() : new Date().toISOString(),
    })
    setSaving(false)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Scan Struk</h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Upload foto bon, otomatis terbaca</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${image ? 'var(--mint)' : 'var(--border)'}`,
            borderRadius: 14, minHeight: image ? 'auto' : 160,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', marginBottom: 16, overflow: 'hidden',
            background: image ? 'transparent' : 'var(--white)',
          }}
        >
          {image ? (
            <img src={image} alt="struk" style={{ width: '100%', maxHeight: 240, objectFit: 'contain', borderRadius: 12 }} />
          ) : (
            <>
              <Camera size={28} color="var(--text-muted)" style={{ marginBottom: 8 }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Tap untuk upload foto</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Struk, bon, atau nota</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />

        {/* Result */}
        {result && (
          <div style={{ background: 'var(--mint-dim)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: 'var(--mint-text)', fontWeight: 700, marginBottom: 8 }}>✅ Berhasil dibaca!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Nama', value: `${result.icon} ${result.name}` },
                { label: 'Total', value: fmt(result.amount) },
                { label: 'Kategori', value: result.category },
                { label: 'Tanggal', value: result.date || 'Hari ini' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          {image && !result && (
            <button onClick={handleScan} disabled={scanning} style={{
              flex: 1, background: 'var(--navy)', border: 'none', borderRadius: 10, padding: '11px',
              fontSize: 13, fontWeight: 700, cursor: scanning ? 'not-allowed' : 'pointer',
              color: '#fff', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {scanning ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Scanning...</> : <><Camera size={14} /> Scan Struk</>}
            </button>
          )}
          {result && (
            <button onClick={handleSave} disabled={saving} style={{
              flex: 1, background: 'var(--mint)', border: 'none', borderRadius: 10, padding: '11px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--navy)', fontFamily: 'var(--font)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Check size={14} /> {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          )}
          {image && result && (
            <button onClick={() => { setImage(null); setImageBase64(null); setResult(null) }} style={{
              background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px',
              fontSize: 13, cursor: 'pointer', color: 'var(--text)', fontFamily: 'var(--font)',
            }}>
              Ulang
            </button>
          )}
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
