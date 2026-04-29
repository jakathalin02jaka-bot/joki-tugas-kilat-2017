import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import DarkModeToggle from '../components/DarkModeToggle'
import StatusBadge from '../components/StatusBadge'
import {
  getAllBookings, updateBookingStatus, deleteBooking, exportToCSV,
  getCatalog, saveCatalog, resetCatalog, DEFAULT_CATALOG,
} from '../lib/storage'
import type { CatalogItem } from '../lib/types'
import {
  buildCancellationMessage, buildCompletionMessage,
  getWaLink, buildBookingMessage,
} from '../lib/whatsapp'
import type { Booking, BookingStatus } from '../lib/types'
import {
  ShieldCheck, LogIn, LogOut, Search, Download, CheckCircle,
  XCircle, Trophy, Trash2, Eye, MessageCircle,
  BarChart3, Clock, DollarSign, RefreshCcw, AlertCircle,
  X, Tag, Plus, Save, RotateCcw, ToggleLeft, ToggleRight,
  Pencil, BookOpen, CheckSquare, Square, Package,
} from 'lucide-react'

const ADMIN_USER = 'jakathalin02'
const ADMIN_PASS = 'Jakaajjaa123'

type FilterStatus = BookingStatus | 'all'
type SortKey = 'createdAt' | 'deadline' | 'harga' | 'status'

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Confirmed', label: 'Dikonfirmasi' },
  { value: 'Completed', label: 'Selesai' },
  { value: 'Cancelled', label: 'Dibatalkan' },
]

/* ─── LOGIN SCREEN ─── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      onLogin()
      if (remember) {
        localStorage.setItem('jtk_admin_auth', 'true')
        localStorage.setItem('jtk_admin_remember', 'true')
      }
      toast.success('Selamat datang, Admin!')
    } else {
      setError('Username atau password salah')
      toast.error('Login gagal')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-700 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Joki Tugas Kilat</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300" autoComplete="username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300" autoComplete="current-password" />
          {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
            <button type="button" onClick={() => setRemember(!remember)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${remember ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600'}`}>
              {remember && <CheckCircle size={12} className="text-white" />}
            </button>
            Ingat saya (tidak perlu login ulang)
          </label>
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-md">
            <LogIn size={16} />Masuk
          </button>
        </form>
      </motion.div>
    </div>
  )
}

/* ─── STAT CARD ─── */
function StatCard({ icon: Icon, label, value, color, delay }: { icon: any; label: string; value: string | number; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -3 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('600', '100').replace('700', '100')} dark:bg-gray-700`}>
          <Icon size={20} className={color} />
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{label}</p>
    </motion.div>
  )
}

/* ─── MINI CHART ─── */
function MiniBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-3 h-24 px-2">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <motion.div initial={{ height: 0 }} animate={{ height: `${(d.value / max) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`w-full max-w-[40px] rounded-t-lg ${d.color}`} />
          <span className="text-[9px] text-gray-500 dark:text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── MAIN ADMIN ─── */
export default function AdminPage() {
  const { adminLoggedIn, adminLogin, adminLogout } = useApp()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filtered, setFiltered] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [searchQ, setSearchQ] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [activeTab, setActiveTab] = useState<'bookings' | 'catalog'>('bookings')
  const [catalog, setCatalog] = useState<CatalogItem[]>([])
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null)
  const [newItem, setNewItem] = useState<CatalogItem>({ id: '', label: '', desc: '', basePrice: 5000, fixed: false, unit: 'halaman', active: true })
  const [showAddForm, setShowAddForm] = useState(false)
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const loadData = useCallback(async () => {
    try {
      const data = await getAllBookings()
      const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setBookings(sortedData)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Gagal memuat data booking')
    }
  }, [])

  useEffect(() => {
    const loadInitialData = async () => {
      if (adminLoggedIn) {
        await loadData()
        const catalogData = await getCatalog()
        setCatalog(catalogData)
      }
    }
    loadInitialData()
  }, [adminLoggedIn, loadData])

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!adminLoggedIn) return
    const id = setInterval(() => {
      loadData()
    }, 30000)
    return () => clearInterval(id)
  }, [adminLoggedIn, loadData])

  useEffect(() => {
    let result = [...bookings]
    if (statusFilter !== 'all') result = result.filter((b) => b.status === statusFilter)
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase()
      result = result.filter((b) => b.id.toLowerCase().includes(q) || b.nama.toLowerCase().includes(q) || b.whatsapp.includes(q) || b.jenistugas.toLowerCase().includes(q))
    }
    if (dateFrom) result = result.filter((b) => new Date(b.createdAt) >= new Date(dateFrom))
    if (dateTo) result = result.filter((b) => new Date(b.createdAt) <= new Date(dateTo + 'T23:59:59'))
    result.sort((a, b) => {
      let va: number | string, vb: number | string
      if (sortKey === 'harga') { va = a.harga; vb = b.harga }
      else if (sortKey === 'status') { va = a.status; vb = b.status }
      else { va = new Date(a[sortKey]).getTime(); vb = new Date(b[sortKey]).getTime() }
      return va < vb ? 1 : va > vb ? -1 : 0
    })
    setFiltered(result)
    setSelectedIds([])
    setSelectAll(false)
  }, [bookings, statusFilter, searchQ, sortKey, dateFrom, dateTo])

  // Bulk actions
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }
  const toggleSelectAll = () => {
    if (selectAll) { setSelectedIds([]); setSelectAll(false) }
    else { setSelectedIds(filtered.map((b) => b.id)); setSelectAll(true) }
  }

  const bulkConfirm = async () => {
    try {
      const promises = selectedIds.map((id) =>
        updateBookingStatus(id, 'Confirmed', { waktuKonfirmasi: new Date().toISOString() })
      )
      const results = await Promise.all(promises)
      const successCount = results.filter(Boolean).length
      await loadData()
      toast.success(`${successCount} dari ${selectedIds.length} booking dikonfirmasi!`)
      setSelectedIds([])
      setSelectAll(false)
    } catch (error) {
      console.error('Error bulk confirming:', error)
      toast.error('Gagal mengkonfirmasi booking secara bulk')
    }
  }

  const bulkComplete = async () => {
    try {
      const promises = selectedIds.map((id) => updateBookingStatus(id, 'Completed'))
      const results = await Promise.all(promises)
      const successCount = results.filter(Boolean).length
      await loadData()
      toast.success(`${successCount} dari ${selectedIds.length} booking ditandai selesai!`)
      setSelectedIds([])
      setSelectAll(false)
    } catch (error) {
      console.error('Error bulk completing:', error)
      toast.error('Gagal menyelesaikan booking secara bulk')
    }
  }

  const bulkDelete = async () => {
    try {
      const promises = selectedIds.map((id) => deleteBooking(id))
      const results = await Promise.all(promises)
      const successCount = results.filter(Boolean).length
      await loadData()
      toast.success(`${successCount} dari ${selectedIds.length} booking dihapus!`)
      setSelectedIds([])
      setSelectAll(false)
    } catch (error) {
      console.error('Error bulk deleting:', error)
      toast.error('Gagal menghapus booking secara bulk')
    }
  }

  async function doConfirm(b: Booking) {
    try {
      const success = await updateBookingStatus(b.id, 'Confirmed', { waktuKonfirmasi: new Date().toISOString() })
      if (success) {
        await loadData()
        toast.success(`Booking ${b.id} dikonfirmasi!`)
      } else {
        toast.error('Gagal mengupdate status booking')
      }
    } catch (error) {
      console.error('Error confirming booking:', error)
      toast.error('Gagal mengkonfirmasi booking')
    }
  }

  async function doComplete() {
    if (!completeTarget) return
    try {
      const success = await updateBookingStatus(completeTarget.id, 'Completed')
      if (success) {
        setCompleteTarget(null)
        await loadData()
        toast.success('Booking selesai!')
      } else {
        toast.error('Gagal mengupdate status booking')
      }
    } catch (error) {
      console.error('Error completing booking:', error)
      toast.error('Gagal menyelesaikan booking')
    }
  }

  async function doCancel() {
    if (!cancelTarget) return
    try {
      const success = await updateBookingStatus(cancelTarget.id, 'Cancelled', { alasanBatal: cancelReason })
      if (success) {
        setCancelTarget(null)
        setCancelReason('')
        await loadData()
        toast.success('Booking ditolak.')
      } else {
        toast.error('Gagal mengupdate status booking')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Gagal menolak booking')
    }
  }

  async function doDelete() {
    if (!deleteTarget) return
    try {
      const success = await deleteBooking(deleteTarget.id)
      if (success) {
        setDeleteTarget(null)
        if (detailBooking?.id === deleteTarget.id) setDetailBooking(null)
        await loadData()
        toast.success('Booking dihapus.')
      } else {
        toast.error('Gagal menghapus booking')
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      toast.error('Gagal menghapus booking')
    }
  }

  async function handleSaveCatalog(updated: CatalogItem[]) {
    try {
      await saveCatalog(updated)
      setCatalog(updated)
      toast.success('Katalog disimpan!')
    } catch (error) {
      console.error('Error saving catalog:', error)
      toast.error('Gagal menyimpan katalog')
    }
  }

  function handleToggleActive(id: string) {
    const updated = catalog.map((c) => c.id === id ? { ...c, active: !c.active } : c)
    handleSaveCatalog(updated)
  }

  function handleDeleteCatalogItem(id: string) {
    const updated = catalog.filter((c) => c.id !== id)
    handleSaveCatalog(updated)
  }

  function handleUpdateItem(item: CatalogItem) {
    const updated = catalog.map((c) => c.id === item.id ? item : c)
    handleSaveCatalog(updated)
    setEditingItem(null)
  }

  function handleAddItem() {
    if (!newItem.label.trim() || newItem.basePrice <= 0) return
    const item: CatalogItem = { ...newItem, id: `custom_${Date.now()}` }
    handleSaveCatalog([...catalog, item])
    setNewItem({ id: '', label: '', desc: '', basePrice: 5000, fixed: false, unit: 'halaman', active: true })
    setShowAddForm(false)
  }

  async function handleResetCatalog() {
    try {
      await resetCatalog()
      setCatalog(DEFAULT_CATALOG)
      toast.success('Katalog direset!')
    } catch (error) {
      console.error('Error resetting catalog:', error)
      toast.error('Gagal mereset katalog')
    }
  }
  function handleExport() { const csv = exportToCSV(filtered); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url); toast.success(`Export ${filtered.length} data`) }

  function formatRupiah(n: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n) }

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'Pending').length,
    confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
    completed: bookings.filter((b) => b.status === 'Completed').length,
    revenue: bookings.filter((b) => b.status === 'Completed').reduce((sum, b) => sum + b.harga, 0),
  }

  if (!adminLoggedIn) return <LoginScreen onLogin={adminLogin} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">Admin Dashboard</h1>
              <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                {lastRefresh.toLocaleTimeString('id-ID')} · {stats.pending > 0 && <span className="text-amber-600 font-semibold">{stats.pending} pending</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <button onClick={() => { loadData(); toast.success('Data diperbarui!') }} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all">
              <RefreshCcw size={16} />
            </button>
            <button onClick={handleExport} className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-400 transition-all">
              <Download size={14} />Export
            </button>
            <button onClick={() => { adminLogout(); toast.info('Logout berhasil') }} className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3">
          <StatCard icon={BarChart3} label="Total" value={stats.total} color="text-purple-600" delay={0} />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="text-amber-600" delay={0.05} />
          <StatCard icon={Package} label="Dikonfirmasi" value={stats.confirmed} color="text-blue-600" delay={0.1} />
          <StatCard icon={Trophy} label="Selesai" value={stats.completed} color="text-green-600" delay={0.15} />
          <StatCard icon={DollarSign} label="Revenue" value={formatRupiah(stats.revenue)} color="text-emerald-600" delay={0.2} />
        </div>

        {/* Chart + Mini stats */}
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Status Booking</h3>
            <MiniBarChart data={[
              { label: 'Pending', value: stats.pending, color: 'bg-amber-400' },
              { label: 'Konfirm', value: stats.confirmed, color: 'bg-blue-400' },
              { label: 'Selesai', value: stats.completed, color: 'bg-green-400' },
              { label: 'Batal', value: bookings.filter((b) => b.status === 'Cancelled').length, color: 'bg-red-400' },
            ]} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Ringkasan Cepat</h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Total Klien</span>
              <span className="font-bold text-gray-800 dark:text-white">{new Set(bookings.map((b) => b.whatsapp)).size}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Rata-rata Harga</span>
              <span className="font-bold text-gray-800 dark:text-white">
                {bookings.length > 0 ? formatRupiah(bookings.reduce((s, b) => s + b.harga, 0) / bookings.length) : 'Rp 0'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Booking Hari Ini</span>
              <span className="font-bold text-gray-800 dark:text-white">
                {bookings.filter((b) => new Date(b.createdAt).toDateString() === new Date().toDateString()).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Urgensi Express</span>
              <span className="font-bold text-red-600">{bookings.filter((b) => b.urgensi === 'Express').length}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'bookings' as const, label: 'Booking', icon: BarChart3 },
            { key: 'catalog' as const, label: 'Katalog', icon: Tag },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === key ? 'bg-purple-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-50'}`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-3 space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Cari nama, WA, jenis tugas..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300 bg-white">
                  {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300 bg-white">
                  <option value="createdAt">Terbaru</option><option value="deadline">Deadline</option><option value="harga">Harga</option><option value="status">Status</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs" />
                <p className="text-xs text-gray-400 ml-auto self-center">{filtered.length} dari {bookings.length}</p>
              </div>
              {/* Bulk actions */}
              {selectedIds.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 self-center">{selectedIds.length} dipilih:</span>
                  <button onClick={bulkConfirm} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold"><CheckCircle size={12} />Konfirmasi</button>
                  <button onClick={bulkComplete} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold"><Trophy size={12} />Selesai</button>
                  <button onClick={bulkDelete} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-semibold"><Trash2 size={12} />Hapus</button>
                </motion.div>
              )}
            </div>

            {/* Table Desktop */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="px-3 py-3">
                      <button onClick={toggleSelectAll} className="flex items-center gap-1">
                        {selectAll ? <CheckSquare size={16} className="text-purple-600" /> : <Square size={16} className="text-gray-400" />}
                      </button>
                    </th>
                    {['ID', 'Pelanggan', 'Tugas', 'Deadline', 'Harga', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {filtered.map((b) => {
                    const isSelected = selectedIds.includes(b.id)
                    const isOverdue = new Date(b.deadline) < new Date() && b.status !== 'Completed'
                    return (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-3 py-3">
                          <button onClick={() => toggleSelect(b.id)}>{isSelected ? <CheckSquare size={16} className="text-purple-600" /> : <Square size={16} className="text-gray-300 dark:text-gray-600" />}</button>
                        </td>
                        <td className="px-3 py-3"><p className="font-bold text-purple-700 text-xs">{b.id}</p></td>
                        <td className="px-3 py-3"><p className="font-semibold text-gray-800 dark:text-white text-xs">{b.nama}</p><p className="text-xs text-gray-400">{b.whatsapp}</p></td>
                        <td className="px-3 py-3"><span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full">{b.jenistugas}</span></td>
                        <td className={`px-3 py-3 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>{new Date(b.deadline).toLocaleDateString('id-ID')}</td>
                        <td className="px-3 py-3"><span className="font-bold text-green-600 text-xs">{formatRupiah(b.harga)}</span></td>
                        <td className="px-3 py-3"><StatusBadge status={b.status} /></td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setDetailBooking(b)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-500"><Eye size={14} /></button>
                            {b.status === 'Pending' && <button onClick={() => doConfirm(b)} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 text-green-500"><CheckCircle size={14} /></button>}
                            {b.status === 'Pending' && <button onClick={() => setCancelTarget(b)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-red-500"><XCircle size={14} /></button>}
                            {b.status === 'Confirmed' && <button onClick={() => setCompleteTarget(b)} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 text-green-600"><Trophy size={14} /></button>}
                            <a href={getWaLink(b.whatsapp, buildBookingMessage(b))} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 text-green-600"><MessageCircle size={14} /></a>
                            <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-3">
              {filtered.map((b) => {
                const isSelected = selectedIds.includes(b.id)
                return (
                  <div key={b.id} className={`bg-white dark:bg-gray-800 rounded-2xl border ${isSelected ? 'border-purple-400' : 'border-gray-100 dark:border-gray-700'} shadow-sm p-4`}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleSelect(b.id)}>{isSelected ? <CheckSquare size={18} className="text-purple-600" /> : <Square size={18} className="text-gray-300 dark:text-gray-600" />}</button>
                        <div><p className="font-bold text-purple-700 text-xs">{b.id}</p><p className="font-semibold text-gray-800 dark:text-white text-sm">{b.nama}</p></div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div><span className="text-gray-400">Tugas:</span> <span className="font-medium text-gray-700 dark:text-gray-200">{b.jenistugas}</span></div>
                      <div><span className="text-gray-400">Harga:</span> <span className="font-bold text-green-600">{formatRupiah(b.harga)}</span></div>
                      <div><span className="text-gray-400">Deadline:</span> <span className="font-medium text-gray-700 dark:text-gray-200">{new Date(b.deadline).toLocaleDateString('id-ID')}</span></div>
                      <div><span className="text-gray-400">Urgensi:</span> <span className={`font-medium ${b.urgensi === 'Express' ? 'text-red-500' : b.urgensi === 'Urgent' ? 'text-orange-500' : 'text-green-500'}`}>{b.urgensi}</span></div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setDetailBooking(b)} className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg font-medium"><Eye size={12} /> Detail</button>
                      {b.status === 'Pending' && (
                        <>
                          <button onClick={() => doConfirm(b)} className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg font-medium"><CheckCircle size={12} /> Konfirm</button>
                          <button onClick={() => setCancelTarget(b)} className="flex items-center gap-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg font-medium"><XCircle size={12} /> Tolak</button>
                        </>
                      )}
                      {b.status === 'Confirmed' && <button onClick={() => setCompleteTarget(b)} className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg font-medium"><Trophy size={12} /> Selesai</button>}
                      <a href={getWaLink(b.whatsapp, buildBookingMessage(b))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg font-medium"><MessageCircle size={12} /> WA</a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CATALOG TAB */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div><h2 className="font-bold text-gray-900 dark:text-white text-lg">Katalog Layanan</h2><p className="text-sm text-gray-500 dark:text-gray-400">{catalog.length} layanan · {catalog.filter((c) => c.active).length} aktif</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={handleResetCatalog} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"><RotateCcw size={14} />Reset</button>
                  <button onClick={() => { setShowAddForm(true); setEditingItem(null) }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-all"><Plus size={14} />Tambah</button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-5 overflow-hidden">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Tambah Layanan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <input placeholder="Nama Layanan" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300" />
                    <input placeholder="Deskripsi" value={newItem.desc} onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300" />
                    <input type="number" placeholder="Harga Dasar" value={newItem.basePrice} onChange={(e) => setNewItem({ ...newItem, basePrice: Number(e.target.value) })} className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300" />
                    <input placeholder="Satuan" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setShowAddForm(false); setNewItem({ id: '', label: '', desc: '', basePrice: 5000, fixed: false, unit: 'halaman', active: true }) }} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-all">Batal</button>
                    <button onClick={handleAddItem} disabled={!newItem.label.trim() || newItem.basePrice <= 0} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 disabled:opacity-40 transition-all">Tambahkan</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-50 dark:divide-gray-700">
              {catalog.map((item) => (
                <div key={item.id} className={`px-5 py-4 transition-all ${!item.active ? 'opacity-50 bg-gray-50 dark:bg-gray-700/30' : ''}`}>
                  {editingItem?.id === item.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input value={editingItem.label} onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })} className="px-3 py-2 rounded-xl border border-purple-300 text-sm outline-none" />
                        <input type="number" value={editingItem.basePrice} onChange={(e) => setEditingItem({ ...editingItem, basePrice: Number(e.target.value) })} className="px-3 py-2 rounded-xl border border-purple-300 text-sm outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(null)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold">Batal</button>
                        <button onClick={() => handleUpdateItem(editingItem)} className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"><Save size={12} /> Simpan</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0"><BookOpen size={16} className="text-purple-600 dark:text-purple-300" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{item.label}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.active ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{item.active ? 'Aktif' : 'Nonaktif'}</span>
                        </div>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <div className="text-right shrink-0"><p className="font-bold text-purple-700 text-sm">Rp {item.basePrice.toLocaleString('id-ID')}</p></div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => handleToggleActive(item.id)} className="p-2 rounded-xl border text-xs transition-all">{item.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} className="text-gray-400" />}</button>
                        <button onClick={() => { setEditingItem({ ...item }); setShowAddForm(false) }} className="p-2 rounded-xl border border-gray-200 hover:bg-purple-50 text-gray-500"><Pencil size={15} /></button>
                        <button onClick={() => handleDeleteCatalogItem(item.id)} className="p-2 rounded-xl border border-gray-200 hover:bg-red-50 text-gray-400"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {detailBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between rounded-t-3xl z-10">
                <div><p className="font-bold text-purple-700">{detailBooking.id}</p><StatusBadge status={detailBooking.status} /></div>
                <button onClick={() => setDetailBooking(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><X size={18} className="text-gray-500" /></button>
              </div>
              <div className="p-6 space-y-3 text-sm">
                {[{ k: 'Nama', v: detailBooking.nama }, { k: 'WhatsApp', v: detailBooking.whatsapp }, { k: 'Jenis', v: detailBooking.jenistugas }, { k: 'Urgensi', v: detailBooking.urgensi }, { k: 'Harga', v: formatRupiah(detailBooking.harga) }, { k: 'Deadline', v: new Date(detailBooking.deadline).toLocaleString('id-ID') }, { k: 'Dibuat', v: new Date(detailBooking.createdAt).toLocaleString('id-ID') }].map(({ k, v }) => (
                  <div key={k} className="flex justify-between gap-2"><span className="text-gray-400 shrink-0">{k}</span><span className="font-medium text-gray-800 dark:text-gray-200 text-right">{v}</span></div>
                ))}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3"><p className="text-gray-400 mb-1">Detail</p><p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2.5 text-xs">{detailBooking.detail}</p></div>
                {detailBooking.catatan && <div><p className="text-gray-400 mb-1">Catatan</p><p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2.5 text-xs">{detailBooking.catatan}</p></div>}
                <div className="flex gap-2 pt-2">
                  {detailBooking.status === 'Pending' && <button onClick={() => { doConfirm(detailBooking); setDetailBooking(null) }} className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold"><CheckCircle size={14} /> Konfirmasi</button>}
                  {detailBooking.status === 'Confirmed' && <button onClick={() => { doComplete(); setDetailBooking(null) }} className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold"><Trophy size={14} /> Selesai</button>}
                  <a href={getWaLink(detailBooking.whatsapp, buildBookingMessage(detailBooking))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2.5 rounded-xl text-sm font-semibold"><MessageCircle size={14} /> WA</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cancelTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-sm p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Tolak Booking {cancelTarget.id}</h3>
              <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Alasan penolakan..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm outline-none resize-none mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setCancelTarget(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">Batal</button>
                <button onClick={() => { const msg = buildCancellationMessage({ ...cancelTarget, alasanBatal: cancelReason }); doCancel(); window.open(getWaLink(cancelTarget.whatsapp, msg), '_blank') }} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold">Tolak & WA</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {completeTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center"><Trophy size={26} className="text-green-500" /></div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Tandai Selesai?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{completeTarget.id} · {completeTarget.nama}</p>
              <div className="flex gap-3">
                <button onClick={() => setCompleteTarget(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">Batal</button>
                <button onClick={() => { const msg = buildCompletionMessage(completeTarget); doComplete(); window.open(getWaLink(completeTarget.whatsapp, msg), '_blank') }} className="flex-1 bg-green-500 text-white py-3 rounded-xl text-sm font-semibold">Selesai & WA</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center"><Trash2 size={26} className="text-red-500" /></div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Hapus Booking?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{deleteTarget.id} · {deleteTarget.nama}</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">Batalkan</button>
                <button onClick={doDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-semibold">Ya, Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
