import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import GlassNavbar from '../components/GlassNavbar'
import ScrollReveal from '../components/ScrollReveal'
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer'
import AnimatedCounter from '../components/AnimatedCounter'
import TiltCard from '../components/TiltCard'
import NeonGlow from '../components/NeonGlow'
import {
  Zap, Star, Shield, MessageCircle, ArrowRight, CheckCircle,
  BookOpen, Code, PresentationIcon, FileText, Palette, BookMarked,
  MoreHorizontal, ChevronDown, Calculator, Users, Award, TrendingUp,
  Phone, GraduationCap, Briefcase, BadgeCheck, Sparkles, Layers,
} from 'lucide-react'

const ThreeBackground = lazy(() => import('../components/ThreeBackground'))

/* ─── DATA ─────────────────────────────────────────────────── */

const services = [
  { icon: BookOpen, label: 'Makalah', desc: 'Rp 6.000 / halaman', base: 6000 },
  { icon: PresentationIcon, label: 'PPT', desc: 'Rp 5.000 / slide', base: 5000 },
  { icon: Code, label: 'Coding', desc: 'Rp 50.000 / proyek', base: 50000 },
  { icon: Palette, label: 'Desain', desc: 'Rp 25.000 / desain', base: 25000 },
  { icon: FileText, label: 'Jurnal', desc: 'Rp 8.000 / halaman', base: 8000 },
  { icon: BookMarked, label: 'Proposal', desc: 'Rp 7.000 / halaman', base: 7000 },
  { icon: MoreHorizontal, label: 'Lainnya', desc: 'Nego langsung', base: 5000 },
]

const urgencyMultiplier: Record<string, number> = { Normal: 1, Urgent: 1.4, Express: 1.8 }

const features = [
  { icon: Zap, title: 'Pengerjaan Kilat', desc: 'Selesai tepat waktu, bahkan express dalam hitungan jam.' },
  { icon: Shield, title: '100% Original', desc: 'Bebas plagiarisme, dikerjakan oleh expert berpengalaman.' },
  { icon: Star, title: 'Kualitas Terjamin', desc: 'Setiap pekerjaan melewati quality check sebelum dikirim.' },
  { icon: MessageCircle, title: 'Revisi Gratis', desc: 'Tidak puas? Kami revisi sampai puas tanpa biaya tambahan.' },
  { icon: Users, title: 'Tim Profesional', desc: 'Dikerjakan oleh mahasiswa dan profesional berpengalaman.' },
  { icon: Award, title: 'Jaminan Nilai', desc: 'Garansi nilai memuaskan atau kami kerjakan ulang gratis.' },
]

const steps = [
  { num: '01', title: 'Isi Form Singkat', desc: 'Cukup isi nama, WhatsApp, jenis tugas, dan deadline.' },
  { num: '02', title: 'Admin Konfirmasi', desc: 'Admin kami merespons dalam hitungan menit.' },
  { num: '03', title: 'Terima Hasil', desc: 'Tugas selesai dikirim via WhatsApp sesuai deadline.' },
]

const testimonials = [
  { name: 'Rina S.', univ: 'Universitas Indonesia', task: 'Makalah Hukum', text: 'Makalah saya selesai dalam 6 jam dan nilainya A! Sudah order 3x.', rating: 5 },
  { name: 'Budi P.', univ: 'Institut Teknologi Bandung', task: 'Coding Project', text: 'Project coding selesai rapi, bisa langsung dipresentasikan.', rating: 5 },
  { name: 'Sari M.', univ: 'Universitas Gadjah Mada', task: 'Desain PPT', text: 'PPT-nya keren banget, dosen saya sampai tanya siapa yang buat.', rating: 5 },
  { name: 'Dimas R.', univ: 'Universitas Brawijaya', task: 'Proposal Skripsi', text: 'Proposal skripsi saya langsung disetujui dosen pembimbing.', rating: 5 },
  { name: 'Putri L.', univ: 'Universitas Diponegoro', task: 'Jurnal Ilmiah', text: 'Jurnal saya diterima publikasi. Kualitasnya jauh melebihi ekspektasi.', rating: 5 },
  { name: 'Hendra K.', univ: 'Universitas Airlangga', task: 'Makalah Ekonomi', text: 'Fast response, hasilnya memuaskan, harga sangat terjangkau.', rating: 5 },
]

const faqs = [
  { q: 'Apakah tugas yang dikerjakan bebas plagiarisme?', a: 'Ya, 100%. Setiap tugas dikerjakan dari nol dan melewati pengecekan plagiarisme (Turnitin/Grammarly).' },
  { q: 'Berapa lama tugas selesai?', a: 'Mode Normal 3+ hari, Urgent 1-3 hari, Express bisa kurang dari 24 jam.' },
  { q: 'Apakah ada jaminan revisi?', a: 'Ya! Kami memberikan revisi gratis hingga klien puas.' },
  { q: 'Bagaimana cara pembayaran?', a: 'Harga disepakati bersama admin via WhatsApp sebelum pengerjaan dimulai.' },
  { q: 'Apakah data saya aman?', a: 'Privasi klien adalah prioritas kami. Semua data dijaga kerahasiaannya.' },
  { q: 'Bagaimana jika tidak puas?', a: 'Kami memberikan garansi revisi gratis dan akan diskusikan solusi terbaik.' },
]

const plans = [
  { name: 'Starter', price: 'Mulai Rp 30.000', sub: 'Makalah 5 hlm = Rp 30rb', desc: 'Cocok untuk tugas ringan', color: 'border-gray-200', badge: '', features: ['Makalah / essay', '5-10 halaman', 'Deadline normal', '1x revisi', 'Via WA'] },
  { name: 'Pro', price: 'Mulai Rp 60.000', sub: 'Makalah 10 hlm = Rp 60rb', desc: 'Paling populer', color: 'border-purple-400', badge: 'Terpopuler', features: ['Semua jenis tugas', '10-20 halaman', 'Urgent 1-3 hari', '3x revisi', 'Cek plagiat', 'Prioritas'] },
  { name: 'Express', price: 'Mulai Rp 120.000', sub: 'Makalah 20 hlm Urgent = Rp 168rb', desc: 'Deadline mepet? Kami siap!', color: 'border-yellow-400', badge: 'Tercepat', features: ['Semua jenis tugas', 'Halaman bebas', '< 24 jam', 'Revisi unlimited', 'Cek plagiat', 'Konsultasi'] },
]

const team = [
  { name: 'Rizky Fauzan', role: 'Lead Developer', univ: 'ITB', prodi: 'Teknik Informatika', exp: '4 tahun', skills: ['Web Dev', 'Mobile', 'Algoritma'], initials: 'RF', color: 'from-purple-600 to-indigo-600', orders: '420+' },
  { name: 'Aulia Salsabila', role: 'Akademik', univ: 'UI', prodi: 'Ilmu Komunikasi', exp: '3 tahun', skills: ['Makalah', 'Jurnal', 'Proposal'], initials: 'AS', color: 'from-pink-500 to-rose-500', orders: '380+' },
  { name: 'Dimas Prayoga', role: 'Desain', univ: 'ISI', prodi: 'DKV', exp: '5 tahun', skills: ['Grafis', 'PPT', 'UI/UX'], initials: 'DP', color: 'from-orange-500 to-yellow-500', orders: '310+' },
  { name: 'Nadia Rahmawati', role: 'Penulisan', univ: 'UGM', prodi: 'Sastra Indonesia', exp: '3 tahun', skills: ['Essay', 'Makalah', 'Tesis'], initials: 'NR', color: 'from-teal-500 to-cyan-500', orders: '290+' },
  { name: 'Bagas Setiawan', role: 'Ekonomi', univ: 'UB', prodi: 'Manajemen', exp: '3 tahun', skills: ['Keuangan', 'Proposal', 'Analisis'], initials: 'BS', color: 'from-blue-500 to-indigo-500', orders: '260+' },
  { name: 'Syifa Azzahra', role: 'MIPA', univ: 'UNDIP', prodi: 'Statistika', exp: '2 tahun', skills: ['Statistik', 'Matematika'], initials: 'SA', color: 'from-green-500 to-emerald-500', orders: '180+' },
]

const trustPoints = [
  { icon: BadgeCheck, title: 'Terverifikasi', desc: 'Semua tim telah melalui seleksi ketat dan verifikasi akademik.' },
  { icon: GraduationCap, title: 'Kampus Terbaik', desc: 'Tim dari PTN ternama: ITB, UI, UGM, UB, UNDIP, ISI.' },
  { icon: Briefcase, title: '2-5 Tahun', desc: 'Rata-rata pengalaman 2-5 tahun dengan ribuan order selesai.' },
  { icon: Shield, title: 'Privasi 100%', desc: 'Data tidak pernah dibagikan. Setiap order dikerjakan rahasia.' },
]

/* ─── SUB-COMPONENTS ──────────────────────────────────────── */

function UrgencyBanner() {
  const [time, setTime] = useState({ h: 4, m: 59, s: 59 })
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        s -= 1
        if (s < 0) { s = 59; m -= 1 }
        if (m < 0) { m = 59; h -= 1 }
        if (h < 0) { h = 4; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white text-center py-2 px-4 text-sm font-medium relative overflow-hidden">
      <motion.div
        animate={{ x: ['-100%', '100%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <span className="relative z-10"><span className="font-bold text-yellow-200">Slot hari ini tersisa 3!</span> Penawaran Express berakhir dalam <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">{pad(time.h)}:{pad(time.m)}:{pad(time.s)}</span></span>
    </div>
  )
}

function PriceCalculator() {
  const [task, setTask] = useState('Makalah')
  const [urgency, setUrgency] = useState('Normal')
  const [pages, setPages] = useState(5)
  const basePerUnit = services.find((s) => s.label === task)?.base ?? 6000
  const isFixed = task === 'Coding' || task === 'Desain'
  const estimated = Math.round((isFixed ? basePerUnit : basePerUnit * pages) * urgencyMultiplier[urgency])

  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-200/40 border border-white/60 p-6 md:p-8 overflow-hidden">
      <NeonGlow color="purple" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-300/40">
            <Calculator size={20} className="text-white" />
          </div>
          <div><h3 className="font-bold text-gray-900 text-lg">Kalkulator Harga</h3><p className="text-xs text-gray-500">Estimasi harga instan</p></div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Tugas</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {services.map((s) => (
                <motion.button key={s.label} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setTask(s.label)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border-2 transition-all ${task === s.label ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md shadow-purple-200/50' : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:shadow-sm'}`}>{s.label}</motion.button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Halaman / Slide: <span className="text-purple-600">{pages}</span></label>
            <input type="range" min={1} max={50} value={pages} onChange={(e) => setPages(Number(e.target.value))} className="w-full accent-purple-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>25</span><span>50</span></div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Urgensi</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ val: 'Normal', sub: '> 3 hari', c: 'green' }, { val: 'Urgent', sub: '1-3 hari', c: 'orange' }, { val: 'Express', sub: '< 24 jam', c: 'red' }].map(({ val, sub, c }) => (
                <motion.button key={val} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setUrgency(val)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${urgency === val ? (c === 'green' ? 'border-green-500 bg-green-50 text-green-700 shadow-md shadow-green-200/50' : c === 'orange' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md shadow-orange-200/50' : 'border-red-500 bg-red-50 text-red-700 shadow-md shadow-red-200/50') : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{val}<span className="block font-normal text-gray-400 text-[10px]">{sub}</span></motion.button>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          initial={false} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-2xl text-white text-center shadow-xl shadow-purple-400/30 relative overflow-hidden"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          />
          <p className="text-xs text-purple-200 mb-1 relative z-10">Estimasi Harga</p>
          <p className="text-3xl font-extrabold relative z-10">Rp {estimated.toLocaleString('id-ID')}</p>
          <p className="text-xs text-purple-200 mt-1 relative z-10">*Harga final disepakati dengan admin</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
          <Link to="/booking" className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl"><Zap size={16} />Pesan Sekarang<ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div layout className="relative bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm overflow-hidden">
      <motion.button layout className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-gray-800 hover:bg-purple-50/50 transition-colors" onClick={() => setOpen(!open)}>
        <span className="text-sm md:text-base">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={18} className="shrink-0 text-purple-500" /></motion.div>
      </motion.button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
        <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100"><p className="pt-3">{a}</p></div>
      </motion.div>
    </motion.div>
  )
}

/* ─── PAGE ──────────────────────────────────────────────────── */

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    })
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans">
      <UrgencyBanner />
      <GlassNavbar />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden text-white min-h-[92vh] flex flex-col"
        onMouseMove={handleMouseMove}
        style={{ perspective: '1000px' }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-800" />

        {/* Animated mesh orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.95, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[700px] h-[700px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', top: '-15%', left: '-10%', filter: 'blur(40px)' }} />
          <motion.div animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.15, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[600px] h-[600px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', bottom: '-10%', right: '-5%', filter: 'blur(40px)' }} />
          <motion.div animate={{ x: [0, 40, -60, 0], y: [0, -30, -40, 0], scale: [1, 1.2, 0.85, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)', top: '30%', left: '40%', filter: 'blur(40px)' }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        </div>

        {/* 3D floating particles */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block">
          <Suspense fallback={null}>
            <ThreeBackground />
          </Suspense>
        </div>

        <div className="relative z-20 flex-1 flex items-center">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 w-full">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                style={{ translateX: mousePos.x * 0.3, translateY: mousePos.y * 0.3 }}
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
                >
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" /></span>
                  <span>Tim aktif sekarang - siap terima pesanan</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-balance mb-5"
                >
                  Deadline Besok?
                  <br />
                  <span className="text-yellow-300">Kami Siap</span>{' '}
                  <span className="relative">
                    Bantu!
                    <motion.span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-yellow-400 rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.5 }} style={{ originX: 0 }} />
                  </span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
                  className="text-base md:text-lg text-purple-200 leading-relaxed mb-8 max-w-lg">
                  Layanan joki tugas profesional - makalah, PPT, coding, desain, jurnal, proposal. Cepat, original, dan harga bersahabat.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="flex flex-col sm:flex-row gap-3">
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/booking" className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-xl hover:shadow-2xl">
                      <Zap size={18} />Pesan Sekarang - Gratis
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/track" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all">
                      Cek Status Order<ArrowRight size={16} />
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="mt-8 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['RK', 'BP', 'SM', 'DR'].map((init, i) => (
                      <motion.div key={init} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      >{init}</motion.div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (
                      <motion.div key={i} initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: 1 + i * 0.08, duration: 0.3 }}>
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    ))}</div>
                    <p className="text-xs text-purple-300">4.9/5 dari 500+ review</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                style={{ translateX: mousePos.x * -0.2, translateY: mousePos.y * -0.2 }}
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
                className="hidden md:block"
              >
                <PriceCalculator />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="relative z-20 border-t border-white/10 bg-white/5 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ end: 2400, suffix: '+', label: 'Tugas Selesai' }, { end: 98, suffix: '%', label: 'On-Time' }, { end: 500, suffix: '+', label: 'Klien Puas' }, { end: 24, suffix: '/7', label: 'Layanan Aktif' }].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-yellow-300"><AnimatedCounter end={s.end} suffix={s.suffix} /></p>
                <p className="text-sm text-purple-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="md:hidden bg-gray-50 px-4 py-8"><PriceCalculator /></section>

      {/* ── SERVICES ── 3D Tilt Cards */}
      <section className="py-20 md:py-24 bg-gray-50/80 relative overflow-hidden">
        <NeonGlow color="purple" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
                <Layers size={13} />SEMUA JENIS TUGAS
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">Kami Tangani Semuanya</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Dari tugas harian hingga skripsi</p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5" staggerDelay={0.08}>
            {services.map(({ icon: Icon, label, desc, base }) => (
              <StaggerItem key={label}>
                <TiltCard tiltAmount={15} glowColor="rgba(147, 51, 234, 0.2)">
                  <Link to="/booking" className="group block bg-white rounded-2xl border border-gray-100/80 p-6 text-center hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500" />
                    <motion.div whileHover={{ rotateY: 15, rotateX: -10 }} transition={{ type: 'spring', stiffness: 300 }}
                      className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-indigo-100 group-hover:from-purple-600 group-hover:to-indigo-600 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md shadow-purple-200/30 group-hover:shadow-lg group-hover:shadow-purple-300/40"
                      style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
                    >
                      <Icon size={24} className="text-purple-600 group-hover:text-white transition-colors" />
                    </motion.div>
                    <p className="font-bold text-gray-800 text-sm mb-1">{label}</p>
                    <p className="text-xs text-gray-400 mb-2">{desc}</p>
                    <p className="text-xs font-bold text-purple-600">Mulai Rp {(base / 1000).toFixed(0)}rb</p>
                  </Link>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FEATURES ── Glassmorphism Cards */}
      <section className="py-20 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-transparent to-blue-50/20 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
                <Sparkles size={13} />KEUNGGULAN KAMI
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">Mengapa Pilih Kami?</h2>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.1}>
            {features.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <TiltCard tiltAmount={8} glowColor="rgba(99, 102, 241, 0.15)">
                  <div className="relative bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 p-6 hover:border-purple-300/60 hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-300 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}
                      className="w-13 h-13 mb-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-300/30 w-12 h-12"
                    >
                      <Icon size={22} className="text-white" />
                    </motion.div>
                    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-purple-50/80 via-indigo-50/50 to-blue-50/30 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
                <Zap size={13} />CARA KERJA
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">3 Langkah Mudah</h2>
              <p className="text-gray-500">Selesai dalam hitungan menit</p>
            </div>
          </ScrollReveal>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-300" />
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.15}>
                <div className="text-center relative">
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 200 }}
                    className="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-400/30"
                    whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <span className="text-white font-extrabold text-3xl" style={{ transform: 'translateZ(10px)' }}>{step.num}</span>
                  </motion.div>
                  <h3 className="font-bold text-gray-800 text-xl mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.4}>
            <div className="text-center mt-12">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link to="/booking" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-purple-400/30 hover:shadow-purple-400/50"><Zap size={18} />Mulai Pesan Sekarang<ArrowRight size={16} /></Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PRICING ── 3D Cards */}
      <section className="py-20 md:py-24 bg-white relative overflow-hidden">
        <NeonGlow color="cyan" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
                <Award size={13} />PAKET HARGA
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">Harga Transparan</h2>
              <p className="text-gray-500">Tanpa biaya tersembunyi</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 0.15}>
                <TiltCard tiltAmount={plan.badge ? 18 : 12} glowColor={plan.badge === 'Terpopuler' ? 'rgba(147, 51, 234, 0.3)' : plan.badge === 'Tercepat' ? 'rgba(250, 204, 21, 0.25)' : 'rgba(156, 163, 175, 0.15)'}>
                  <div className={`relative rounded-3xl border-2 p-8 flex flex-col h-full ${plan.color} ${plan.badge === 'Terpopuler' ? 'shadow-2xl shadow-purple-300/30 md:scale-[1.04] bg-gradient-to-b from-purple-50/50 to-white' : 'bg-white/80 backdrop-blur-sm'}`}>
                    {plan.badge && (
                      <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${plan.badge === 'Terpopuler' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-400/40' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}>
                        {plan.badge}
                      </div>
                    )}
                    <h3 className="font-extrabold text-2xl text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-2xl font-bold text-purple-700 mb-1">{plan.price}</p>
                    <p className="text-[11px] text-green-600 font-medium mb-2 bg-green-50 rounded-lg px-2 py-1 inline-block">{plan.sub}</p>
                    <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
                    <ul className="space-y-3 mb-8 flex-1">{plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />{f}</li>
                    ))}</ul>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/booking" className={`block text-center font-bold py-3.5 rounded-2xl transition-all text-sm ${plan.badge === 'Terpopuler' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-300/40' : 'bg-gray-100 hover:bg-purple-50 text-purple-700 border border-purple-200'}`}>
                        Pilih {plan.name}
                      </Link>
                    </motion.div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-24 bg-gray-50/80 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
                <Star size={13} className="fill-yellow-600" />TESTIMONI
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">Apa Kata Klien?</h2>
              <p className="text-gray-500">500+ mahasiswa sudah puas</p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.1}>
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <TiltCard tiltAmount={10} glowColor="rgba(250, 204, 21, 0.15)">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                    <div className="flex gap-0.5 mb-3">{Array.from({ length: t.rating }).map((_, i) => (
                      <motion.div key={i} initial={{ opacity: 0, rotate: -180 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    ))}</div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{t.name.split(' ').map((n) => n[0]).join('')}</div>
                      <div className="min-w-0"><p className="font-semibold text-gray-800 text-sm truncate">{t.name}</p><p className="text-xs text-gray-500">{t.univ}</p></div>
                      <span className="ml-auto shrink-0 text-xs bg-purple-100 text-purple-700 font-medium px-2.5 py-1 rounded-full">{t.task}</span>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── TRUST WALL ── */}
      <section className="py-20 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">Kenapa Percaya Kami?</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Standar yang kami jaga setiap hari</p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.1}>
            {trustPoints.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <TiltCard tiltAmount={10} glowColor="rgba(99, 102, 241, 0.15)">
                  <div className="text-center p-7 rounded-2xl border border-purple-100/60 bg-gradient-to-b from-purple-50/60 to-white hover:shadow-2xl hover:shadow-purple-200/30 transition-all h-full">
                    <motion.div whileHover={{ scale: 1.15, rotate: 5 }} className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-300/30">
                      <Icon size={28} className="text-white" />
                    </motion.div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute w-[600px] h-[600px] rounded-full opacity-10 bg-purple-400 blur-3xl -top-20 -left-20" />
          <motion.div animate={{ x: [0, -30, 40, 0], y: [0, 40, -20, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute w-[500px] h-[500px] rounded-full opacity-10 bg-indigo-400 blur-3xl -bottom-20 -right-20" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-3 text-balance">Tim Profesional Kami</h2>
              <p className="text-purple-200 max-w-2xl mx-auto"><span className="text-yellow-300 font-bold">6 spesialis aktif</span> dari kampus terkemuka</p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.1}>
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <TiltCard tiltAmount={12} glowColor="rgba(250, 204, 21, 0.15)">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all h-full group">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-xl shrink-0`}>
                        <span className="text-white font-extrabold text-lg">{member.initials}</span>
                      </motion.div>
                      <div><h3 className="font-bold text-white text-base">{member.name}</h3><p className="text-purple-200 text-xs">{member.role}</p></div>
                    </div>
                    <div className="space-y-2 mb-4 text-xs text-purple-200">
                      <div className="flex items-center gap-2"><GraduationCap size={13} className="text-yellow-300 shrink-0" /><span>{member.univ} - {member.prodi}</span></div>
                      <div className="flex items-center gap-2"><Briefcase size={13} className="text-yellow-300 shrink-0" /><span>Exp: <span className="text-white font-semibold">{member.exp}</span></span></div>
                      <div className="flex items-center gap-2"><CheckCircle size={13} className="text-yellow-300 shrink-0" /><span>Orders: <span className="text-white font-semibold">{member.orders}</span></span></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">{member.skills.map((skill) => (
                      <span key={skill} className="text-[11px] font-medium bg-white/15 text-white px-2.5 py-1 rounded-full border border-white/10">{skill}</span>
                    ))}</div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">FAQ</h2>
              <p className="text-gray-500">Pertanyaan yang sering ditanyakan</p>
            </div>
          </ScrollReveal>
          <div className="space-y-3">{faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}</div>
          <ScrollReveal delay={0.2}>
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm mb-3">Masih ada pertanyaan?</p>
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                href="https://wa.me/6281295991378?text=Halo%2C%20saya%20ingin%20bertanya"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-lg shadow-green-200/50"
              >
                <Phone size={16} />Tanya via WhatsApp
              </motion.a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl -top-40 -left-40" />
          <motion.div animate={{ x: [0, -40, 50, 0], y: [0, 30, -40, 0] }} transition={{ duration: 22, repeat: Infinity }} className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-3xl -bottom-20 -right-20" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/30 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-medium text-yellow-300 mb-8">
              <TrendingUp size={14} />2.400+ tugas berhasil diselesaikan
            </div>
            <h2 className="text-3xl md:text-6xl font-extrabold mb-5 text-balance leading-tight">Jangan Tunggu<br />Deadline Mepet!</h2>
            <p className="text-purple-200 mb-10 text-lg max-w-xl mx-auto leading-relaxed">Pesan sekarang, konsultasi gratis, dan dapatkan hasil terbaik tepat waktu.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link to="/booking" className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-2xl shadow-yellow-400/30"><Zap size={20} />Pesan Sekarang - Gratis</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <a href="https://wa.me/6281295991378?text=Halo%2C%20saya%20ingin%20pesan" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-2xl shadow-green-400/30"><MessageCircle size={20} />Chat Admin</a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-gray-400 py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Zap size={18} className="text-white" />
                </div>
                <span className="font-bold text-white text-lg">Joki Tugas Kilat</span>
              </div>
              <p className="text-sm leading-relaxed">Solusi tugas cepat, berkualitas, dan terpercaya untuk mahasiswa Indonesia.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Layanan</p>
              <ul className="space-y-2 text-sm">{services.map((s) => (<li key={s.label}><Link to="/booking" className="hover:text-purple-400 transition-colors">{s.label}</Link></li>))}</ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Kontak</p>
              <div className="space-y-2 text-sm">
                <a href="https://wa.me/6281295991378" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-400 transition-colors"><MessageCircle size={14} />081295991378</a>
                <div className="flex items-center gap-2 text-gray-500"><Users size={14} /><span>6 spesialis aktif</span></div>
                <div className="flex items-center gap-2 text-gray-500"><GraduationCap size={14} /><span>ITB, UI, UGM, UB, UNDIP, ISI</span></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>2026 Joki Tugas Kilat. Semua hak dilindungi.</p>
            <Link to="/admin" className="hover:text-gray-400 transition-colors underline underline-offset-2">Admin Panel</Link>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WA ── */}
      <motion.a
        href="https://wa.me/6281295991378?text=Halo%2C%20saya%20ingin%20pesan%20joki%20tugas"
        target="_blank" rel="noopener noreferrer"
        initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, y: -4 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold px-5 py-3.5 rounded-2xl shadow-2xl shadow-green-500/40 transition-all group"
      >
        <span className="relative">
          <MessageCircle size={22} className="shrink-0" />
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping" />
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold">1</span>
        </span>
        <span className="text-sm hidden sm:block">Chat Admin</span>
      </motion.a>
    </div>
  )
}
