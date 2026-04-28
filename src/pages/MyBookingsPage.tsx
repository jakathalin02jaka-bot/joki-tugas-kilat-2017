import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Navbar from '../components/GlassNavbar'
import ScrollReveal from '../components/ScrollReveal'

import { getBookingsByWhatsApp } from '../lib/storage'
import type { Booking, BookingStatus } from '../lib/types'
import {
  Search, Phone, MessageCircle, ClipboardList,
  ArrowLeft, Zap, CheckCircle, Clock, XCircle, Package,
  AlertCircle,
} from 'lucide-react'

const statusConfig: Record<BookingStatus, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; bg: string; text: string; border: string }> = {
  Pending:   { label: 'Menunggu', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
  Confirmed: { label: 'Dikerjakan', icon: Package, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  Completed: { label: 'Selesai', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' },
  Cancelled: { label: 'Dibatalkan', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
}

const statusFilters: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'Pending', label: 'Menunggu' },
  { value: 'Confirmed', label: 'Dikerjakan' },
  { value: 'Completed', label: 'Selesai' },
  { value: 'Cancelled', label: 'Dibatalkan' },
]

function formatDeadlineCountdown(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff < 0) return { label: 'Sudah lewat', urgent: true }
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return { label: `${hours} jam lagi`, urgent: true }
  const days = Math.floor(hours / 24)
  return { label: `${days} hari lagi`, urgent: days <= 2 }
}

function BookingItem({ booking }: { booking: Booking }) {
  const cfg = statusConfig[booking.status]
  const StatusIcon = cfg.icon
  const countdown = formatDeadlineCountdown(booking.deadline)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <div className={`h-1 w-full ${booking.status === 'Completed' ? 'bg-green-400' : booking.status === 'Confirmed' ? 'bg-blue-400' : booking.status === 'Cancelled' ? 'bg-red-400' : 'bg-amber-400'}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-mono text-xs text-gray-400 mb-0.5">{booking.id}</p>
            <p className="font-bold text-gray-900">{booking.jenistugas}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <StatusIcon size={11} />{cfg.label}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{booking.detail}</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-[10px] text-gray-400 mb-0.5">Harga</p>
            <p className="text-xs font-bold text-gray-800">Rp {booking.harga.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-[10px] text-gray-400 mb-0.5">Urgensi</p>
            <p className="text-xs font-bold text-gray-800">{booking.urgensi}</p>
          </div>
          <div className={`rounded-xl p-2.5 ${countdown.urgent && booking.status !== 'Completed' && booking.status !== 'Cancelled' ? 'bg-red-50' : 'bg-gray-50'}`}>
            <p className="text-[10px] text-gray-400 mb-0.5">Deadline</p>
            <p className={`text-xs font-bold ${countdown.urgent && booking.status !== 'Completed' && booking.status !== 'Cancelled' ? 'text-red-600' : 'text-gray-800'}`}>
              {countdown.label}
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Link to={`/track?id=${booking.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-2 rounded-xl text-xs transition-colors">
            <ClipboardList size={13} />Detail
          </Link>
          <a href={`https://wa.me/6281295991378?text=Halo%2C%20saya%20ingin%20menanyakan%20booking%20${booking.id}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-2 rounded-xl text-xs transition-colors">
            <MessageCircle size={13} />Tanya Admin
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function MyBookingsPage() {
  const [wa, setWa] = useState('')
  const [searched, setSearched] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeFilter, setActiveFilter] = useState<BookingStatus | 'all'>('all')
  const [loading, setLoading] = useState(false)

  const filtered = activeFilter === 'all' ? bookings : bookings.filter((b) => b.status === activeFilter)

  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  function handleSearch() {
    if (!wa.trim()) { toast.error('Masukkan nomor WhatsApp'); return }
    setLoading(true)
    setTimeout(() => {
      const results = getBookingsByWhatsApp(wa)
      const sorted = [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setBookings(sorted)
      setSearched(true)
      setLoading(false)
      if (sorted.length === 0) toast.info('Tidak ada booking ditemukan untuk nomor ini')
      else toast.success(`${sorted.length} booking ditemukan!`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <ScrollReveal>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 mb-6 transition-colors">
            <ArrowLeft size={14} />Kembali ke Beranda
          </Link>
        </ScrollReveal>
        <ScrollReveal>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200"
            >
              <ClipboardList size={26} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Saya</h1>
            <p className="text-gray-500 text-sm">Masukkan nomor WhatsApp untuk melihat semua pesanan Anda</p>
          </div>
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" placeholder="08xxxxxxxxxx" value={wa}
                onChange={(e) => setWa(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 text-sm outline-none transition-all" />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              disabled={loading || !wa.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md shadow-purple-300"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={16} />}
              Cari
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {searched && bookings.length === 0 && (
            <motion.div
              key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-md p-10 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                <AlertCircle size={28} className="text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-700 mb-2">Tidak ada booking ditemukan</h3>
              <p className="text-sm text-gray-400 mb-6">Nomor WhatsApp ini belum memiliki riwayat booking</p>
              <Link to="/booking" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md">
                <Zap size={15} />Buat Booking Pertama
              </Link>
            </motion.div>
          )}

          {searched && bookings.length > 0 && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Total', val: bookings.length, color: 'from-purple-500 to-indigo-500' },
                  { label: 'Menunggu', val: statusCounts['Pending'] ?? 0, color: 'from-amber-400 to-orange-400' },
                  { label: 'Dikerjakan', val: statusCounts['Confirmed'] ?? 0, color: 'from-blue-500 to-cyan-400' },
                  { label: 'Selesai', val: statusCounts['Completed'] ?? 0, color: 'from-green-500 to-emerald-400' },
                ].map(({ label, val, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm"
                  >
                    <p className={`text-2xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{val}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
                {statusFilters.map(({ value, label }) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(value)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                      activeFilter === value
                        ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-200'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                    }`}
                  >
                    {label}{value !== 'all' && statusCounts[value] ? ` (${statusCounts[value]})` : ''}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <motion.div key="nofilter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    Tidak ada booking dengan status ini
                  </motion.div>
                ) : (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {filtered.map((b) => (
                      <BookingItem key={b.id} booking={b} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 text-center">
                <Link to="/booking" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-purple-300">
                  <Zap size={15} />Buat Booking Baru
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.a
        href="https://wa.me/6281295991378"
        target="_blank" rel="noopener noreferrer"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-3 rounded-2xl shadow-2xl transition-all"
      >
        <MessageCircle size={20} className="shrink-0" /><span className="text-sm hidden sm:block">Chat Admin</span>
      </motion.a>
    </div>
  )
}
