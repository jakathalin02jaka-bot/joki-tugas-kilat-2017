export type TaskType =
  | 'Makalah'
  | 'PPT'
  | 'Coding'
  | 'Desain'
  | 'Jurnal'
  | 'Proposal'
  | 'Lainnya'

export type UrgencyLevel = 'Normal' | 'Urgent' | 'Express'

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'

export interface Booking {
  id: string
  nama: string
  whatsapp: string
  jenistugas: TaskType
  detail: string
  deadline: string
  urgensi: UrgencyLevel
  harga: number
  catatan: string
  status: BookingStatus
  createdAt: string
  updatedAt: string
  alasanBatal?: string
  waktuKonfirmasi?: string
}

export interface AdminCredentials {
  username: string
  password: string
}

export interface CatalogItem {
  id: string
  label: string
  desc: string
  basePrice: number
  fixed: boolean
  unit: string
  active: boolean
}
