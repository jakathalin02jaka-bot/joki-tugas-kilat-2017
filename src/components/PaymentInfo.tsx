import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Copy, CheckCircle, Wallet, Building2 } from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconBg: string
  number: string
  holder: string
  color: string
  borderColor: string
  bgColor: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'dana',
    name: 'DANA',
    icon: Wallet,
    iconBg: 'from-blue-500 to-cyan-500',
    number: '081295991378',
    holder: 'Lindawati Zaini',
    color: 'text-blue-600',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'bri',
    name: 'BRI',
    icon: Building2,
    iconBg: 'from-blue-700 to-indigo-700',
    number: '0442-01-065088-50-4',
    holder: 'Jaka Anzor Thaliin',
    color: 'text-blue-700',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/50',
  },
]

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(`${label} disalin!`, { description: text })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      toast.success(`${label} disalin!`, { description: text })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
        copied
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300'
      }`}
    >
      {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
      {copied ? 'Tersalin' : 'Salin'}
    </motion.button>
  )
}

export default function PaymentInfo({ compact }: { compact?: boolean }) {
  return (
    <div className={`space-y-3 ${compact ? '' : 'max-w-md mx-auto'}`}>
      {paymentMethods.map((method, i) => {
        const Icon = method.icon
        return (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            className={`relative rounded-2xl border-2 ${method.borderColor} ${method.bgColor} p-4 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${method.iconBg} flex items-center justify-center shadow-md shrink-0`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`font-bold text-sm ${method.color}`}>{method.name}</p>
                  <span className="text-[10px] text-gray-400 bg-white/80 px-1.5 py-0.5 rounded-full border border-gray-200">Transfer</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-mono text-sm font-bold text-gray-800 tracking-wide">{method.number}</p>
                  <CopyButton text={method.number} label={`Nomor ${method.name}`} />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">a.n. {method.holder}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export function PaymentPageInline() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl border-2 border-purple-200 p-6 md:p-8 shadow-lg">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg"
        >
          <Wallet size={26} className="text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Pembayaran</h2>
        <p className="text-sm text-gray-500">Transfer ke salah satu rekening di bawah ini</p>
      </div>

      <PaymentInfo />

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1.5">
        <p className="font-semibold">Catatan Penting:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Setelah transfer, kirimkan bukti pembayaran ke WhatsApp admin</li>
          <li>Admin akan memverifikasi pembayaran dalam 5-10 menit</li>
          <li>Pastikan nominal transfer sesuai dengan harga yang disepakati</li>
          <li>Simpan bukti transfer untuk jaga-jaga</li>
        </ul>
      </div>

      <motion.a
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        href="https://wa.me/6281295991378?text=Halo%2C%20saya%20sudah%20transfer%20dan%20mau%20kirim%20bukti%20pembayaran"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-green-200"
      >
        Kirim Bukti Pembayaran via WhatsApp
      </motion.a>
    </div>
  )
}
