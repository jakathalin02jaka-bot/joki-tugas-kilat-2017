import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Navbar from '../components/GlassNavbar'
import ScrollReveal from '../components/ScrollReveal'
import { getBookingById } from '../lib/storage'
import type { Booking } from '../lib/types'
import {
  Search, CheckCircle, Clock, XCircle, Package,
  ArrowLeft, MessageCircle, Zap,
  ClipboardList, AlertCircle,
} from 'lucide-react'

const statusConfig = {
  Pending: {
    label: 'Menunggu Konfirmasi', color: 'text-amber-700 bg-amber-50 border-amber-300',
    bar: 'bg-amber-400', icon: Clock, progress: 25,
    desc: 'Booking Anda telah diterima. Admin sedang memeriksa detail pesanan Anda.',
  },
  Confirmed: {
    label: 'Sedang Dikerjakan', color: 'text-blue-700 bg-blue-50 border-blue-300',
    bar: 'bg-blue-500', icon: Package, progress: 65,
    desc: 'Admin telah mengkonfirmasi pesanan Anda. Tugas sedang dalam pengerjaan.',
  },
  Completed: {
    label: 'Selesai', color: 'text-green-700 bg-green-50 border-green-300',
    bar: 'bg-green-500', icon: CheckCircle, progress: 100,
    desc: 'Tugas Anda telah selesai dan dikirimkan. Terima kasih telah menggunakan layanan kami!',
  },
  Cancelled: {
    label: 'Dibatalkan', color: 'text-red-700 bg-red-50 border-red-300',
    bar: 'bg-red-400', icon: XCircle, progress: 0,
    desc: 'Pesanan ini telah dibatalkan. Hubungi admin untuk informasi lebih lanjut.',
  },
}

const timeline = [
  { key: 'Pending', label: 'Booking Diterima', icon: ClipboardList },
  { key: 'Confirmed', label: 'Dikonfirmasi Admin', icon: CheckCircle },
  { key: 'Completed', label: 'Tugas Selesai', icon: Package },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function TimelineStep({ label, icon: Icon, active, done, cancelled }: {
  label: string; icon: React.ComponentType<{ size?: number; className?: string }>; active: boolean; done: boolean; cancelled: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <motion.div
        initial={false}
        animate={{ scale: active ? 1.1 : 1 }}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          cancelled ? 'border-red-300 bg-red-50 text-red-400' : done || active ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-200' : 'border-gray-200 bg-white text-gray-300'
        }`}
      >
        <Icon size={18} />
      </motion.div>
      <p className={`text-xs font-semibold text-center leading-tight ${cancelled ? 'text-red-400' : done || active ? 'text-purple-700' : 'text-gray-400'}`}>
        {label}
      </p>
    </div>
  )
}

export default function TrackPage() {
  const [searchParams] = useSearchParams()
  const initialId = searchParams.get('id') || ''
  const [input, setInput] = useState(initialId)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [searched, setSearched] = useState(!!initialId)
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    if (!input.trim()) { toast.error('Masukkan nomor booking'); return }
    setLoading(true)
    setTimeout(() => {
      const found = getBookingById(input.trim().toUpperCase())
      setBooking(found)
      setSearched(true)
      setLoading(false)
      if (!found) toast.error('Booking tidak ditemukan')
      else toast.success('Booking ditemukan!')
    }, 600)
  }

  useEffect(() => {
    if (initialId) {
      setLoading(true)
      setTimeout(() => {
        const found = getBookingById(initialId.trim().toUpperCase())
        setBooking(found)
        setSearched(true)
        setLoading(false)
      }, 600)
    }
  }, [initialId])

  const cfg = booking ? statusConfig[booking.status] : null
  const StatusIcon = cfg?.icon ?? Clock
  const orderIdx = { Pending: 0, Confirmed: 1, Completed: 2, Cancelled: -1 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ScrollReveal>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 mb-6 transition-colors">
            <ArrowLeft size={14} />Kembali ke Beranda
          </Link>
        </ScrollReveal>
        <ScrollReveal>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200"
            >
              <Search size={26} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Lacak Status Order</h1>
            <p className="text-gray-500 text-sm">Masukkan nomor booking untuk melihat progress tugas Anda</p>
          </div>
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Booking</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <ClipboardList size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="BOOK-2026-001" value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 text-sm outline-none transition-all font-mono uppercase" />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md shadow-purple-300"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={16} />}
              Cari
            </motion.button>
          </div>
          <p className="mt-2 text-xs text-gray-400">Nomor booking dikirim ke WhatsApp Anda saat order dibuat (format: BOOK-2026-XXX)</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {searched && !booking && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-red-100 shadow-md p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle size={28} className="text-red-400" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Booking Tidak Ditemukan</h3>
              <p className="text-sm text-gray-500 mb-5">Nomor <span className="font-mono font-bold text-gray-700">{input}</span> tidak ditemukan.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/booking" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"><Zap size={14} />Buat Booking Baru</Link>
                <a href="https://wa.me/6281295991378" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"><MessageCircle size={14} />Hubungi Admin</a>
              </div>
            </motion.div>
          )}

          {searched && booking && cfg && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
            >
              <div className={`p-5 border-b ${booking.status === 'Completed' ? 'bg-green-50 border-green-100' : booking.status === 'Cancelled' ? 'bg-red-50 border-red-100' : booking.status === 'Confirmed' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Nomor Booking</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                    <StatusIcon size={11} />{cfg.label}
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900 tracking-wide font-mono">{booking.id}</p>
              </div>

              <div className="p-6 space-y-6">
                {booking.status !== 'Cancelled' && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Progress</span><span>{cfg.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cfg.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${cfg.bar}`}
                      />
                    </div>
                  </div>
                )}

                <div className={`p-4 rounded-2xl border text-sm ${cfg.color}`}>
                  <StatusIcon size={16} className="inline mr-2" />{cfg.desc}
                </div>

                {booking.status !== 'Cancelled' && (
                  <div className="relative">
                    <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200" />
                    <div className="relative flex gap-2">
                      {timeline.map(({ key, label, icon }, i) => {
                        const currentIdx = orderIdx[booking.status as keyof typeof orderIdx]
                        return (
                          <TimelineStep key={key} label={label} icon={icon}
                            active={currentIdx === i} done={currentIdx > i} cancelled={booking.status === 'Cancelled'} />
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Nama', val: booking.nama },
                    { label: 'Jenis Tugas', val: booking.jenistugas },
                    { label: 'Urgensi', val: booking.urgensi },
                    { label: 'Harga', val: `Rp ${booking.harga.toLocaleString('id-ID')}` },
                    { label: 'Deadline', val: formatDate(booking.deadline) },
                    { label: 'Dipesan', val: formatDate(booking.createdAt) },
                  ].map(({ label, val }) => (
                    <motion.div whileHover={{ scale: 1.02 }} key={label} className="bg-gray-50 rounded-xl p-3 transition-all">
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{val}</p>
                    </motion.div>
                  ))}
                </div>

                {booking.alasanBatal && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                    <p className="font-semibold mb-1">Alasan Pembatalan</p><p>{booking.alasanBatal}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
                  <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/6281295991378?text=Halo%2C%20saya%20ingin%20menanyakan%20status%20booking%20${booking.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-xl text-sm transition-all"
                  >
                    <MessageCircle size={15} />Tanya Admin
                  </motion.a>
                  {booking.status === 'Cancelled' && (
                    <Link to="/booking" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl text-sm"><Zap size={15} />Buat Booking Baru</Link>
                  )}
                </div>
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
