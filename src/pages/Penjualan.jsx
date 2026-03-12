import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Penjualan() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [todaySales, setTodaySales] = useState([])
  const [form, setForm] = useState({ itemId: '', quantity: '' })
  const [selectedItem, setSelectedItem] = useState(null)
  const [stockStatus, setStockStatus] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('isLogin')) navigate('/login')
    setItems(JSON.parse(localStorage.getItem('items') || '[]'))
    const allSales = JSON.parse(localStorage.getItem('sales') || '[]')
    const today = new Date().toISOString().split('T')[0]
    setTodaySales(allSales.filter(s => s.date === today))
  }, [])

  const handleItemChange = (itemId) => {
    const found = items.find(i => i.id === itemId)
    setSelectedItem(found || null)
    setStockStatus(null)
    setForm({ ...form, itemId })
  }

  const handleCekStok = () => {
    if (!form.itemId || !form.quantity) return alert('Pilih barang dan isi jumlah dulu!')
    setStockStatus(parseInt(form.quantity) <= selectedItem.stock ? 'cukup' : 'kurang')
  }

  const handleSimpan = () => {
    if (!form.itemId || !form.quantity) return alert('Pilih barang dan isi jumlah dulu!')
    
    const qty = parseInt(form.quantity)
    
    // Cek stok dulu otomatis saat simpan
    if (qty > selectedItem.stock) {
      setStockStatus('kurang')
      return
    }
    
    setStockStatus('cukup')

    const allItems = JSON.parse(localStorage.getItem('items') || '[]')
    const updatedItems = allItems.map(i =>
      i.id === form.itemId ? { ...i, stock: i.stock - qty } : i
    )
    localStorage.setItem('items', JSON.stringify(updatedItems))

    const today = new Date().toISOString().split('T')[0]
    const sales = JSON.parse(localStorage.getItem('sales') || '[]')
    const newSale = {
      id: Date.now(),
      itemId: form.itemId,
      itemName: selectedItem.name,
      category: selectedItem.category,
      quantity: qty,
      stockBefore: selectedItem.stock,
      stockAfter: selectedItem.stock - qty,
      date: today,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    localStorage.setItem('sales', JSON.stringify([...sales, newSale]))

    setItems(updatedItems)
    setTodaySales([newSale, ...todaySales])
    setSuccess(true)
    setForm({ itemId: '', quantity: '' })
    setSelectedItem(null)
    setTimeout(() => { setStockStatus(null); setSuccess(false) }, 3000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f6] font-sans">

      {/* Header */}
      <header className="flex items-center justify-between bg-[#1F3864] px-10 py-4 shadow-md">
        <div className="flex items-center gap-4 text-white">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/10">
            <img src="/logo.png" className="h-8 w-8 object-contain" alt="Logo" />
          </div>
          <h2 className="text-xl font-bold">Penjualan & Keluar Barang</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Kembali
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-10">
        <div className="w-full max-w-[960px] flex flex-col gap-6">

          {/* Hero */}
          <div className="flex flex-col md:flex-row rounded-xl shadow-sm bg-white border border-slate-200 overflow-hidden">
            <div className="w-full md:w-1/3 bg-[#1F3864]/10 flex items-center justify-center p-8">
              <span className="material-symbols-outlined text-[80px] text-[#1F3864]">shopping_cart</span>
            </div>
            <div className="flex flex-col justify-center gap-1 py-6 px-6">
              <h3 className="text-slate-900 text-2xl font-bold">Form Penjualan Barang</h3>
              <p className="text-slate-500 text-base">Silahkan isi detail penjualan atau pengeluaran barang di bawah ini untuk memperbarui inventaris.</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Pilih Barang */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-semibold">Pilih Barang</label>
                  <div className="relative">
                    <select value={form.itemId} onChange={e => handleItemChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 h-12 px-4 focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] outline-none appearance-none bg-white text-slate-900">
                      <option value="">Cari sparepart...</option>
                      {items.map(i => (
                        <option key={i.id} value={i.id}>{i.name} — Stok: {i.stock}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                {/* Kategori */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-semibold">Kategori</label>
                  <input
                    value={selectedItem ? selectedItem.category : ''}
                    readOnly
                    placeholder="Otomatis terisi"
                    className="w-full rounded-xl border border-slate-200 h-12 px-4 bg-slate-50 text-slate-500 outline-none"
                  />
                </div>

                {/* Jumlah + Cek Stok */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-slate-700 text-sm font-semibold">Jumlah yang Dijual</label>
                  <div className="flex gap-3">
                    <input type="number" min="1" value={form.quantity}
                      onChange={e => { setForm({...form, quantity: e.target.value}); setStockStatus(null) }}
                      className="flex-1 rounded-xl border border-slate-300 h-12 px-4 focus:ring-2 focus:ring-[#1F3864] outline-none"
                      placeholder="0" />
                    <button type="button" onClick={handleCekStok}
                      className="flex items-center justify-center gap-2 px-6 rounded-xl bg-[#1F3864] text-white font-semibold hover:bg-blue-900 transition-all shadow-sm">
                      <span className="material-symbols-outlined">inventory_2</span>
                      Cek Stok
                    </button>
                  </div>
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="pt-2">
                <button type="button" onClick={handleSimpan}
                  className="w-full flex items-center justify-center gap-2 h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]">
                  <span className="material-symbols-outlined">save</span>
                  Simpan Data Penjualan
                </button>
              </div>
            </div>
          </div>

          {/* Alert Stok */}
          {stockStatus === 'cukup' && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="font-medium">✅ Transaksi berhasil disimpan! Stok berkurang otomatis.</p>
            </div>
          )}
          {stockStatus === 'kurang' && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
              <span className="material-symbols-outlined">error</span>
              <p className="font-medium">❌ Stok Tidak Cukup! Stok tersedia: <b>{selectedItem?.stock} unit</b></p>
            </div>
          )}

          {/* Tabel Transaksi Hari Ini */}
          <div className="mt-2 border-t border-slate-200 pt-6">
            <h4 className="text-slate-900 text-lg font-bold mb-4">Ringkasan Transaksi Hari Ini</h4>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Jam</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {todaySales.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Belum ada transaksi hari ini</td></tr>
                  ) : (
                    todaySales.map(s => (
                      <tr key={s.id}>
                        <td className="px-6 py-4">{s.createdAt}</td>
                        <td className="px-6 py-4 font-medium">{s.itemName}</td>
                        <td className="px-6 py-4">{s.category}</td>
                        <td className="px-6 py-4">{s.quantity} unit</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-auto py-6 px-10 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>© 2024 Inventory System Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}