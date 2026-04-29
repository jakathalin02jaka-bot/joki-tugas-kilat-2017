import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Navbar from '../components/GlassNavbar'
import ScrollReveal from '../components/ScrollReveal'
import { buildBookingMessage, getAdminWaLink } from '../lib/whatsapp'
import type { Booking, TaskType, UrgencyLevel } from '../lib/types'
import { PaymentPageInline } from '../components/PaymentInfo'
import { db } from '../lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import {
  User, Phone, BookOpen, FileText, Calendar, Zap,
  CheckCircle, ChevronRight, ChevronLeft,
  Copy, ExternalLink, ArrowLeft, Calculator,
  BookMarked, Code, Palette, PresentationIcon, MoreHorizontal,
  Clock, Shield, Star, AlertTriangle,
} from 'lucide-react'

const DRAFT_KEY = 'jtk_booking_draft'

interface FormData {
  nama: string
  whatsapp: string
  jenistugas: TaskType | ''
  detail: string
  deadline: string
  urgensi: UrgencyLevel
  harga: string
  catatan: string
}

const defaultForm: FormData = {
  nama: '', whatsapp: '', jenistugas: '', detail: '',
  deadline: '', urgensi: 'Normal', harga: '', catatan: '',
}

const taskTypes = [
  { value: 'Makalah' as TaskType, icon: BookOpen, desc: 'Akademik', base: 6000, fixed: false },
  { value: 'PPT' as TaskType, icon: PresentationIcon, desc: 'Presentasi', base: 5000, fixed: false },
  { value: 'Coding' as TaskType, icon: Code, desc: 'Coding', base: 50000, fixed: true },
  { value: 'Desain' as TaskType, icon: Palette, desc: 'Desain', base: 25000, fixed: true },
  { value: 'Jurnal' as TaskType, icon: FileText, desc: 'Jurnal', base: 8000, fixed: false },
  { value: 'Proposal' as TaskType, icon: BookMarked, desc: 'Proposal', base: 7000, fixed: false },
  { value: 'Lainnya' as TaskType, icon: MoreHorizontal, desc: 'Lainnya', base: 5000, fixed: false },
]

const urgencyOptions: { value: UrgencyLevel; label: string; desc: string; multiplier: number }[] = [
  { value: 'Normal', label: 'Normal', desc: '> 3 hari', multiplier: 1.0 },
  { value: 'Urgent', label: 'Urgent', desc: '1-3 hari', multiplier: 1.4 },
  { value: 'Express', label: 'Express', desc: '< 24 jam', multiplier: 1.8 },
]

interface FieldError { [key: string]: string }

function estimatePrice(jenistugas: TaskType | '', urgensi: UrgencyLevel, hargaInput: string): number | null {
  if (hargaInput && !isNaN(Number(hargaInput))) return Number(hargaInput)
  const mult = urgencyOptions.find((u) => u.value === urgensi)?.multiplier ?? 1
  const task = taskTypes.find((t) => t.value === jenistugas)
  if (!task) return null
  const units = task.fixed ? 1 : 10
  return Math.round(task.base * units * mult)
}

/** Scroll to element and focus it */
function scrollToField(ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>) {
  if (!ref.current) return
  const y = ref.current.getBoundingClientRect().top + window.scrollY - 120
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  setTimeout(() => ref.current?.focus(), 350)
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<FieldError>({})
  const [submitted, setSubmitted] = useState(false)
  const [bookingResult, setBookingResult] = useState<Booking | null>(null)
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingId, setBookingId] = useState<string>('')

  // Generate booking ID on component mount
  useEffect(() => {
    const generateId = async () => {
      try {
        const counterRef = doc(db, 'counters', 'booking_counter')
        const counterSnap = await getDoc(counterRef)
        let currentCounter = 1

        if (counterSnap.exists()) {
          currentCounter = counterSnap.data().value || 1
        } else {
          // Initialize counter if it doesn't exist (use setDoc instead of updateDoc)
          await setDoc(counterRef, { value: 1 }, { merge: true })
        }

        // Generate booking ID (don't increment yet, will increment on submit)
        const year = new Date().getFullYear()
        const padded = String(currentCounter).padStart(3, '0')
        setBookingId(`BOOK-${year}-${padded}`)
      } catch (error) {
        console.error('Error generating booking ID:', error)
        // Fallback to local generation
        const year = new Date().getFullYear()
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        setBookingId(`BOOK-${year}-${random}`)
      }
    }
    generateId()
  }, [])

  // Field refs for auto-focus
  const namaRef = useRef<HTMLInputElement>(null)
  const waRef = useRef<HTMLInputElement>(null)
  const detailRef = useRef<HTMLTextAreaElement>(null)
  const deadlineRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try { const draft = localStorage.getItem(DRAFT_KEY); if (draft) setForm(JSON.parse(draft)) } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (!submitted) { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)) } catch { /* ignore */ } }
  }, [form, submitted])

  const setField = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => { const e = { ...p }; delete e[field]; return e })
  }

  const validateStep = useCallback((s: number): boolean => {
    const e: FieldError = {}
    if (s === 1) {
      if (!form.nama.trim()) e.nama = 'Isi nama lengkap Anda'
      if (!form.whatsapp.trim()) e.whatsapp = 'Isi nomor WhatsApp'
      else if (!/^(\+62|62|0)[0-9]{8,13}$/.test(form.whatsapp.replace(/\s/g, ''))) {
        e.whatsapp = 'Format tidak valid. Contoh: 081295991378'
      }
      if (!form.jenistugas) e.jenistugas = 'Pilih jenis tugas'
    }
    if (s === 2) {
      if (!form.detail.trim() || form.detail.trim().length < 10) e.detail = 'Jelaskan detail tugas (min 10 huruf)'
      if (!form.deadline) e.deadline = 'Pilih deadline'
      else {
        const dl = new Date(form.deadline)
        if (dl.getTime() <= Date.now()) e.deadline = 'Deadline harus di masa depan'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const goNext = () => {
    if (!validateStep(step)) {
      // Auto-focus first error field
      toast.error('Periksa form Anda', { description: 'Isi field yang bertanda merah' })
      const firstErrKey = Object.keys(errors)[0] || (
        step === 1
          ? (!form.nama ? 'nama' : !form.whatsapp ? 'whatsapp' : !form.jenistugas ? 'jenistugas' : 'nama')
          : (!form.detail ? 'detail' : !form.deadline ? 'deadline' : 'detail')
      )
      setTimeout(() => {
        if (firstErrKey === 'nama' && namaRef.current) scrollToField(namaRef)
        else if (firstErrKey === 'whatsapp' && waRef.current) scrollToField(waRef)
        else if (firstErrKey === 'jenistugas') {
          const el = document.getElementById('task-grid')
          if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus() }
        }
        else if (firstErrKey === 'detail' && detailRef.current) scrollToField(detailRef)
        else if (firstErrKey === 'deadline' && deadlineRef.current) scrollToField(deadlineRef)
      }, 100)
      return
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goPrev = () => {
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const est = estimatePrice(form.jenistugas, form.urgensi, form.harga)

      // Increment counter and get final booking ID
      const counterRef = doc(db, 'counters', 'booking_counter')
      const counterSnap = await getDoc(counterRef)
      let currentCounter = 1

      if (counterSnap.exists()) {
        currentCounter = counterSnap.data().value || 1
      }

      const nextCounter = currentCounter + 1
      // Use setDoc with merge to ensure document exists
      await setDoc(counterRef, { value: nextCounter }, { merge: true })

      // Generate final booking ID
      const year = new Date().getFullYear()
      const padded = String(currentCounter).padStart(3, '0')
      const finalBookingId = `BOOK-${year}-${padded}`

      const booking: Booking = {
        id: finalBookingId,
        nama: form.nama.trim(),
        whatsapp: form.whatsapp.trim(),
        jenistugas: form.jenistugas as TaskType,
        detail: form.detail.trim(),
        deadline: new Date(form.deadline).toISOString(),
        urgensi: form.urgensi,
        harga: est ?? 0,
        catatan: form.catatan.trim(),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to Firestore directly
      const bookingsRef = collection(db, 'bookings')
      await addDoc(bookingsRef, booking)

      setBookingResult(booking)
      setSubmitted(true)
      try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
      toast.success('Booking berhasil!', { description: `Nomor: ${finalBookingId}` })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast.error('Gagal menyimpan booking. Periksa koneksi internet atau setting Firebase Anda.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const estPrice = estimatePrice(form.jenistugas, form.urgensi, form.harga)

  // ── SUCCESS SCREEN ──
  if (submitted && bookingResult) {
    const waLink = getAdminWaLink(buildBookingMessage(bookingResult))
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans">
        <Navbar />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-lg mx-auto px-4 py-8 md:py-12">
          <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 md:p-8 text-center text-white">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle size={32} className="text-white md:hidden" />
                <CheckCircle size={40} className="text-white hidden md:block" />
              </motion.div>
              <h1 className="text-xl md:text-2xl font-extrabold mb-1">Booking Berhasil!</h1>
              <p className="text-purple-200 text-sm">Admin akan segera menghubungi Anda</p>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="text-center p-3 md:p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <p className="text-xs text-gray-500 mb-1">Nomor Booking</p>
                <p className="text-xl md:text-2xl font-extrabold text-purple-700 tracking-wider">{bookingResult.id}</p>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { navigator.clipboard.writeText(bookingResult.id); setCopied(true); toast.success('Disalin!'); setTimeout(() => setCopied(false), 2000) }} className="mt-2 inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors">
                  <Copy size={12} />{copied ? 'Tersalin!' : 'Salin nomor'}
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                {[{ label: 'Nama', val: bookingResult.nama }, { label: 'WhatsApp', val: bookingResult.whatsapp }, { label: 'Jenis', val: bookingResult.jenistugas }, { label: 'Urgensi', val: bookingResult.urgensi }, { label: 'Deadline', val: new Date(bookingResult.deadline).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }, { label: 'Est. Harga', val: `Rp ${bookingResult.harga.toLocaleString('id-ID')}` }].map(({ label, val }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-2.5 md:p-3"><p className="text-[10px] md:text-xs text-gray-400 mb-0.5">{label}</p><p className="font-semibold text-gray-800 truncate">{val}</p></div>
                ))}
              </div>
              <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={waLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg">
                <ExternalLink size={16} />Konfirmasi ke WhatsApp
              </motion.a>
              {/* Payment inline */}
              <div className="my-4 md:my-6">
                <PaymentPageInline />
              </div>
              <div className="flex gap-2 md:gap-3">
                <Link to="/my-bookings" className="flex-1 flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-3 rounded-xl text-xs md:text-sm transition-colors">Lihat Booking</Link>
                <Link to="/" className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-xs md:text-sm transition-colors">Beranda</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── MAIN FORM ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-10">
        <ScrollReveal>
          <div className="text-center mb-4 md:mb-8">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs md:text-sm text-gray-500 hover:text-purple-700 mb-3 md:mb-4 transition-colors">
              <ArrowLeft size={14} />Kembali
            </Link>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 mb-1 md:mb-2">Form Booking Tugas</h1>
            <p className="text-xs md:text-sm text-gray-500">Isi data di bawah, admin merespons &lt; 5 menit</p>
          </div>
        </ScrollReveal>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-8 px-1">
          {[{ icon: Zap, label: 'Respons &lt; 5 mnt', color: 'text-yellow-600 bg-yellow-50' }, { icon: Shield, label: 'Original', color: 'text-blue-600 bg-blue-50' }, { icon: Star, label: 'Revisi Gratis', color: 'text-purple-600 bg-purple-50' }, { icon: Clock, label: 'On-Time', color: 'text-green-600 bg-green-50' }].map(({ icon: Icon, label, color }) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold ${color}`}>
              <Icon size={12} />{label}
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-4 md:gap-6 items-start">
          {/* FORM */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
            {/* Step indicator - compact on mobile */}
            <div className="p-3 md:p-6 border-b border-gray-100">
              <div className="flex items-center gap-1 md:gap-2">
                {[{ n: 1, label: 'Data' }, { n: 2, label: 'Detail' }, { n: 3, label: 'Cek' }].map(({ n, label }, i) => (
                  <div key={n} className="flex items-center gap-1 md:gap-2 flex-1">
                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                      <motion.div animate={{ backgroundColor: step > n ? '#22c55e' : step === n ? '#9333ea' : '#f3f4f6', color: step > n || step === n ? '#fff' : '#9ca3af' }} className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shadow-sm">
                        {step > n ? (
                          <>
                            <CheckCircle size={12} className="md:hidden" />
                            <CheckCircle size={16} className="hidden md:block" />
                          </>
                        ) : (
                          <span>{n}</span>
                        )}
                      </motion.div>
                      <span className={`text-[10px] md:text-xs font-semibold hidden sm:block ${step === n ? 'text-purple-700' : 'text-gray-400'}`}>{label}</span>
                    </div>
                    {i < 2 && <motion.div animate={{ backgroundColor: step > n ? '#86efac' : '#e5e7eb' }} className="flex-1 h-0.5 rounded-full mx-0.5 md:mx-1" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 md:p-8">
              <AnimatePresence mode="wait">
                {/* ── STEP 1 ── */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4 md:space-y-5">
                    <div>
                      <p className="text-base md:text-lg font-bold text-gray-900 mb-0.5">Data Diri</p>
                      <p className="text-xs md:text-sm text-gray-500">Informasi kontak untuk koordinasi</p>
                    </div>

                    {/* Nama */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input ref={namaRef} type="text" placeholder="Contoh: Rina Sari" value={form.nama} onChange={(e) => setField('nama', e.target.value)}
                          className={`w-full pl-9 pr-3 py-2.5 md:py-3 rounded-xl border-2 text-sm outline-none transition-all text-gray-900 dark:text-gray-900 ${errors.nama ? 'border-red-400 bg-red-50 dark:bg-red-100' : 'border-gray-200 focus:border-purple-400 bg-white dark:bg-gray-50 dark:border-gray-300 hover:border-gray-300'}`} />
                      </div>
                      {errors.nama && <p className="mt-1 text-[11px] md:text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.nama}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5">Nomor WhatsApp <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input ref={waRef} type="tel" inputMode="tel" placeholder="081295991378" value={form.whatsapp} onChange={(e) => setField('whatsapp', e.target.value)}
                          className={`w-full pl-9 pr-3 py-2.5 md:py-3 rounded-xl border-2 text-sm outline-none transition-all text-gray-900 dark:text-gray-900 ${errors.whatsapp ? 'border-red-400 bg-red-50 dark:bg-red-100' : 'border-gray-200 focus:border-purple-400 bg-white dark:bg-gray-50 dark:border-gray-300 hover:border-gray-300'}`} />
                      </div>
                      {errors.whatsapp && <p className="mt-1 text-[11px] md:text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.whatsapp}</p>}
                      <p className="mt-0.5 text-[10px] md:text-xs text-gray-400">Format: 08xxxxxxxxxx</p>
                    </div>

                    {/* Jenis Tugas */}
                    <div id="task-grid" tabIndex={-1}>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Jenis Tugas <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-1.5 md:gap-2">
                        {taskTypes.map(({ value, icon: Icon }) => (
                          <motion.button key={value} type="button" whileTap={{ scale: 0.95 }}
                            onClick={() => setField('jenistugas', value)}
                            className={`flex flex-col items-center gap-0.5 md:gap-1 p-2 md:p-3 rounded-xl border-2 text-center transition-all ${form.jenistugas === value ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-purple-300'}`}>
                            <Icon size={16} className="md:size-18" />
                            <span className="text-[10px] md:text-xs font-bold leading-tight">{value}</span>
                          </motion.button>
                        ))}
                      </div>
                      {errors.jenistugas && <p className="mt-1 text-[11px] md:text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.jenistugas}</p>}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4 md:space-y-5">
                    <div>
                      <p className="text-base md:text-lg font-bold text-gray-900 mb-0.5">Detail Tugas</p>
                      <p className="text-xs md:text-sm text-gray-500">Semakin detail, semakin bagus hasilnya</p>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5">Deskripsi Tugas <span className="text-red-500">*</span></label>
                      <textarea ref={detailRef} placeholder="Contoh: Makalah 15 halaman tentang perubahan iklim, format APA, daftar pustaka 10 sumber..."
                        value={form.detail} onChange={(e) => setField('detail', e.target.value)} rows={4}
                        className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 text-sm outline-none resize-none transition-all text-gray-900 dark:text-gray-900 ${errors.detail ? 'border-red-400 bg-red-50 dark:bg-red-100' : 'border-gray-200 focus:border-purple-400 bg-white dark:bg-gray-50 dark:border-gray-300 hover:border-gray-300'}`} />
                      <div className="flex justify-between mt-0.5">
                        {errors.detail ? <p className="text-[11px] md:text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.detail}</p> : <p className="text-[10px] md:text-xs text-gray-400">Min 10 huruf</p>}
                        <p className={`text-[10px] md:text-xs ${form.detail.length < 10 ? 'text-red-400' : 'text-green-500'}`}>{form.detail.length} huruf</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5">Deadline <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input ref={deadlineRef} type="datetime-local" value={form.deadline}
                          onChange={(e) => setField('deadline', e.target.value)}
                          className={`w-full pl-9 pr-3 py-2.5 md:py-3 rounded-xl border-2 text-sm outline-none transition-all text-gray-900 dark:text-gray-900 ${errors.deadline ? 'border-red-400 bg-red-50 dark:bg-red-100' : 'border-gray-200 focus:border-purple-400 bg-white dark:bg-gray-50 dark:border-gray-300 hover:border-gray-300'}`} />
                      </div>
                      {errors.deadline && <p className="mt-1 text-[11px] md:text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.deadline}</p>}
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Urgensi</label>
                      <div className="grid grid-cols-3 gap-2 md:gap-3">
                        {urgencyOptions.map(({ value, label, desc }) => (
                          <motion.button key={value} type="button" whileTap={{ scale: 0.95 }}
                            onClick={() => setField('urgensi', value)}
                            className={`p-2.5 md:p-3.5 rounded-xl border-2 text-left transition-all ${form.urgensi === value ? (value === 'Normal' ? 'border-green-400 bg-green-50' : value === 'Urgent' ? 'border-orange-400 bg-orange-50' : 'border-red-400 bg-red-50') : 'border-gray-200 bg-white'}`}>
                            <span className={`inline-block text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full mb-0.5 md:mb-1 ${form.urgensi === value ? (value === 'Normal' ? 'bg-green-100 text-green-700' : value === 'Urgent' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700') : 'bg-gray-100 text-gray-500'}`}>{label}</span>
                            <p className="text-[9px] md:text-[11px] text-gray-500">{desc}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5">Harga (opsional)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">Rp</span>
                        <input type="number" inputMode="numeric" placeholder="Kosongkan jika belum disepakati" value={form.harga} onChange={(e) => setField('harga', e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 md:py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 bg-white dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900 text-sm outline-none transition-all" />
                      </div>
                      {estPrice && !form.harga && <p className="mt-1 text-[10px] md:text-xs text-purple-600">Estimasi: Rp {estPrice.toLocaleString('id-ID')}</p>}
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5">Catatan <span className="text-gray-400 font-normal">(opsional)</span></label>
                      <textarea placeholder="Kebutuhan khusus, referensi..." value={form.catatan} onChange={(e) => setField('catatan', e.target.value)} rows={2}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 bg-white dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900 text-sm outline-none resize-none transition-all" />
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3 ── */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4 md:space-y-5">
                    <div>
                      <p className="text-base md:text-lg font-bold text-gray-900 mb-0.5">Konfirmasi</p>
                      <p className="text-xs md:text-sm text-gray-500">Periksa kembali sebelum kirim</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-3 md:p-5 border border-purple-200">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <p className="text-xs text-gray-500">Booking ID</p>
                        <p className="font-extrabold text-purple-700 tracking-wide text-sm md:text-base">{bookingId}</p>
                      </div>
                      <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                        {[{ label: 'Nama', val: form.nama }, { label: 'WhatsApp', val: form.whatsapp }, { label: 'Tugas', val: form.jenistugas }, { label: 'Urgensi', val: form.urgensi }, { label: 'Deadline', val: form.deadline ? new Date(form.deadline).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-' }, { label: 'Est. Harga', val: estPrice ? `Rp ${estPrice.toLocaleString('id-ID')}` : 'Disepakati' }].map(({ label, val }) => (
                          <div key={label} className="flex justify-between items-start gap-3"><span className="text-gray-500 shrink-0">{label}</span><span className="font-semibold text-gray-800 text-right">{val}</span></div>
                        ))}
                      </div>
                      {form.detail && (
                        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-purple-200">
                          <p className="text-[10px] md:text-xs text-gray-500 mb-1">Detail</p>
                          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{form.detail}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-2xl text-xs md:text-sm text-green-800 flex gap-2 md:gap-3">
                      <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-600" />
                      <div>
                        <p className="font-semibold">Setelah kirim...</p>
                        <p className="text-green-700 text-[10px] md:text-xs mt-0.5">Anda akan diarahkan ke WhatsApp untuk konfirmasi. Respons &lt; 5 menit!</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex gap-2 md:gap-3 mt-6 md:mt-8 sticky bottom-4 md:static">
                {step > 1 && (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={goPrev} className="flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-xs md:text-sm hover:border-gray-300 hover:bg-gray-50 transition-all">
                    <ChevronLeft size={14} />Kembali
                  </motion.button>
                )}
                {step < 3 ? (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={goNext} className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 md:py-3 rounded-xl text-xs md:text-sm transition-all shadow-md shadow-purple-300/30">
                    Lanjut<ChevronRight size={14} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2.5 md:py-3 rounded-xl text-xs md:text-sm transition-all shadow-md shadow-green-300/30 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Zap size={14} />Kirim Booking
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar - hidden on mobile */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="hidden md:block space-y-4 sticky top-24">
            <div className="bg-white rounded-2xl border border-purple-100 shadow-md p-5">
              <div className="flex items-center gap-2 mb-4"><Calculator size={16} className="text-purple-600" /><p className="font-bold text-gray-800 text-sm">Estimasi Harga</p></div>
              {form.jenistugas ? (
                <div className="text-center py-3 bg-purple-50 rounded-2xl border border-purple-100">
                  <p className="text-xs text-gray-400 mb-1">{form.jenistugas} · {form.urgensi}</p>
                  <p className="text-2xl font-extrabold text-purple-700">Rp {(estPrice ?? 0).toLocaleString('id-ID')}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Pilih jenis tugas</p>
              )}
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white text-sm shadow-md">
              <p className="font-bold mb-3">Jaminan Kami</p>
              <ul className="space-y-2">
                {['Respons &lt; 5 menit', '100% Original', 'Revisi gratis', 'On-time atau uang kembali'].map((g) => (
                  <li key={g} className="flex items-center gap-2 text-xs text-purple-100"><CheckCircle size={12} className="text-green-300 shrink-0" />{g}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
