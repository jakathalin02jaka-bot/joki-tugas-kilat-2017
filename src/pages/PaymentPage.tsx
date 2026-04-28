import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Wallet, MessageCircle, Zap } from 'lucide-react'
import Navbar from '../components/GlassNavbar'
import ScrollReveal from '../components/ScrollReveal'
import { PaymentPageInline } from '../components/PaymentInfo'

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
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
              <Wallet size={26} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Pembayaran</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Pilih metode pembayaran yang paling mudah untuk Anda. Nomor bisa langsung disalin.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <PaymentPageInline />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/booking"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-purple-200"
              >
                <Zap size={16} />Buat Booking Baru
              </Link>
            </motion.div>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/6281295991378?text=Halo%2C%20saya%20sudah%20transfer%20dan%20mau%20kirim%20bukti%20pembayaran"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-green-200"
            >
              <MessageCircle size={16} />Konfirmasi via WhatsApp
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
