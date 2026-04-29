import type { Booking, BookingStatus, CatalogItem } from './types'
import { db } from './firebase'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
  setDoc,
} from 'firebase/firestore'

const BOOKINGS_COLLECTION = 'bookings'
const COUNTER_COLLECTION = 'counters'
const CATALOG_COLLECTION = 'catalog'

export const DEFAULT_CATALOG: CatalogItem[] = [
  { id: 'makalah', label: 'Makalah', desc: 'Makalah & essay akademik', basePrice: 6000, fixed: false, unit: 'halaman', active: true },
  { id: 'ppt', label: 'PPT', desc: 'Presentasi PowerPoint', basePrice: 5000, fixed: false, unit: 'slide', active: true },
  { id: 'coding', label: 'Coding', desc: 'Web, mobile & algoritma', basePrice: 50000, fixed: true, unit: 'proyek', active: true },
  { id: 'desain', label: 'Desain', desc: 'Desain grafis & UI/UX', basePrice: 25000, fixed: true, unit: 'desain', active: true },
  { id: 'jurnal', label: 'Jurnal', desc: 'Jurnal & artikel ilmiah', basePrice: 8000, fixed: false, unit: 'halaman', active: true },
  { id: 'proposal', label: 'Proposal', desc: 'Skripsi, tesis & proposal', basePrice: 7000, fixed: false, unit: 'halaman', active: true },
  { id: 'lainnya', label: 'Lainnya', desc: 'Tugas lain (nego langsung)', basePrice: 5000, fixed: false, unit: 'halaman', active: true },
]

export async function getCatalog(): Promise<CatalogItem[]> {
  try {
    const catalogRef = collection(db, CATALOG_COLLECTION)
    const querySnapshot = await getDocs(catalogRef)
    const items: CatalogItem[] = []
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as CatalogItem)
    })
    return items.length > 0 ? items : DEFAULT_CATALOG
  } catch (error) {
    console.error('Error getting catalog:', error)
    return DEFAULT_CATALOG
  }
}

export async function saveCatalog(items: CatalogItem[]): Promise<void> {
  try {
    const catalogRef = collection(db, CATALOG_COLLECTION)
    // Clear existing catalog
    const querySnapshot = await getDocs(catalogRef)
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)

    // Add new catalog items
    const addPromises = items.map(item =>
      addDoc(catalogRef, item)
    )
    await Promise.all(addPromises)
  } catch (error) {
    console.error('Error saving catalog:', error)
    throw error
  }
}

export async function resetCatalog(): Promise<void> {
  try {
    await saveCatalog(DEFAULT_CATALOG)
  } catch (error) {
    console.error('Error resetting catalog:', error)
    throw error
  }
}

async function getCounter(): Promise<number> {
  try {
    const counterRef = doc(db, COUNTER_COLLECTION, 'booking_counter')
    const counterSnap = await getDoc(counterRef)
    if (counterSnap.exists()) {
      return counterSnap.data().value || 1
    } else {
      // Initialize counter
      await setDoc(counterRef, { value: 1 })
      return 1
    }
  } catch (error) {
    console.error('Error getting counter:', error)
    return 1
  }
}

async function incrementCounter(): Promise<number> {
  try {
    const current = await getCounter()
    const next = current + 1
    const counterRef = doc(db, COUNTER_COLLECTION, 'booking_counter')
    await updateDoc(counterRef, { value: next })
    return next
  } catch (error) {
    console.error('Error incrementing counter:', error)
    return 1
  }
}

export async function generateBookingId(): Promise<string> {
  const year = new Date().getFullYear()
  const counter = await getCounter()
  const padded = String(counter).padStart(3, '0')
  return `BOOK-${year}-${padded}`
}

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const bookingsRef = collection(db, BOOKINGS_COLLECTION)
    const q = query(bookingsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const bookings: Booking[] = []
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() } as Booking)
    })
    return bookings
  } catch (error) {
    console.error('Error getting all bookings:', error)
    return []
  }
}

export async function saveBooking(booking: Booking): Promise<void> {
  try {
    const bookingsRef = collection(db, BOOKINGS_COLLECTION)
    await addDoc(bookingsRef, booking)
    await incrementCounter()
  } catch (error) {
    console.error('Error saving booking:', error)
    throw error
  }
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  extra?: { alasanBatal?: string; waktuKonfirmasi?: string }
): Promise<boolean> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id)
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
      ...extra,
    }
    await updateDoc(bookingRef, updateData)
    return true
  } catch (error) {
    console.error('Error updating booking status:', error)
    return false
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id)
    const bookingSnap = await getDoc(bookingRef)
    if (bookingSnap.exists()) {
      return { id: bookingSnap.id, ...bookingSnap.data() } as Booking
    }
    return null
  } catch (error) {
    console.error('Error getting booking by ID:', error)
    return null
  }
}

export async function getBookingsByWhatsApp(wa: string): Promise<Booking[]> {
  try {
    const clean = wa.replace(/\D/g, '')
    const bookingsRef = collection(db, BOOKINGS_COLLECTION)
    const q = query(bookingsRef, where('whatsapp', '>=', clean), where('whatsapp', '<=', clean + '\uf8ff'))
    const querySnapshot = await getDocs(q)
    const bookings: Booking[] = []
    querySnapshot.forEach((doc) => {
      const booking = { id: doc.id, ...doc.data() } as Booking
      if (booking.whatsapp.replace(/\D/g, '').includes(clean)) {
        bookings.push(booking)
      }
    })
    return bookings
  } catch (error) {
    console.error('Error getting bookings by WhatsApp:', error)
    return []
  }
}

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id)
    await deleteDoc(bookingRef)
    return true
  } catch (error) {
    console.error('Error deleting booking:', error)
    return false
  }
}

export function exportToCSV(bookings: Booking[]): string {
  const headers = [
    'Nomor Booking',
    'Nama',
    'WhatsApp',
    'Jenis Tugas',
    'Detail',
    'Deadline',
    'Urgensi',
    'Harga',
    'Status',
    'Catatan',
    'Dibuat',
    'Diupdate',
  ]

  const rows = bookings.map((b) =>
    [
      b.id,
      b.nama,
      b.whatsapp,
      b.jenistugas,
      `"${b.detail.replace(/"/g, '""')}"`,
      new Date(b.deadline).toLocaleString('id-ID'),
      b.urgensi,
      b.harga,
      b.status,
      `"${(b.catatan ?? '').replace(/"/g, '""')}"`,
      new Date(b.createdAt).toLocaleString('id-ID'),
      new Date(b.updatedAt).toLocaleString('id-ID'),
    ].join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}
