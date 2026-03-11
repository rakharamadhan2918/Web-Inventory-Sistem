import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard'
import BarangMasuk from './pages/BarangMasuk'
import Penjualan from './pages/Penjualan'
import KelolaBarang from './pages/KelolaBarang'
import KoreksiStok from './pages/KoreksiStok'
import Laporan from './pages/Laporan'

function App() {
  const isLogin = localStorage.getItem('isLogin')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLogin ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/barang-masuk" element={<BarangMasuk />} />
        <Route path="/penjualan" element={<Penjualan />} />
        <Route path="/kelola-barang" element={<KelolaBarang />} />
        <Route path="/koreksi-stok" element={<KoreksiStok />} />
        <Route path="/laporan" element={<Laporan />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App