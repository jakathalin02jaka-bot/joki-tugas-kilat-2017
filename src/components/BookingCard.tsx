import type { Booking } from '../lib/types'
import StatusBadge from './StatusBadge'
import { Calendar, Clock, Zap, Banknote, FileText } from 'lucide-react'

interface Props {
  booking: Booking
  actions?: React.ReactNode
}

const urgencyColor: Record<string, string> = {
  Normal: 'text-green-600',
  Urgent: 'text-orange-500',
  Express: 'text-red-600',
}

export default function BookingCard({ booking, actions }: Props) {
  const deadline = new Date(booking.deadline)
  const now = new Date()
  const hoursLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60))
  const isOverdue = deadline < now && booking.status !== 'Completed'

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-gray-500 font-medium">Nomor Booking</p>
          <p className="font-bold text-purple-700 text-sm tracking-wide">{booking.id}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-800 text-base">{booking.nama}</p>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
            {booking.jenistugas}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{booking.detail}</p>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-purple-400 shrink-0" />
            <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
              {deadline.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-purple-400 shrink-0" />
            <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
              {isOverdue
                ? 'Lewat deadline'
                : hoursLeft < 24
                ? `${hoursLeft} jam lagi`
                : `${Math.ceil(hoursLeft / 24)} hari lagi`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={13} className={`shrink-0 ${urgencyColor[booking.urgensi]}`} />
            <span className={urgencyColor[booking.urgensi]}>{booking.urgensi}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Banknote size={13} className="text-green-500 shrink-0" />
            <span className="font-medium text-gray-700">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(booking.harga)}
            </span>
          </div>
        </div>

        {booking.catatan && (
          <div className="flex items-start gap-1.5 bg-gray-50 rounded-lg px-3 py-2">
            <FileText size={13} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 line-clamp-2">{booking.catatan}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {actions && <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">{actions}</div>}
    </div>
  )
}
