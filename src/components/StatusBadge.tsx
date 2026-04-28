import type { BookingStatus } from '../lib/types'

const config: Record<BookingStatus, { label: string; className: string }> = {
  Pending: {
    label: 'Menunggu',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  Confirmed: {
    label: 'Dikonfirmasi',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  Completed: {
    label: 'Selesai',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  Cancelled: {
    label: 'Dibatalkan',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
}

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}
