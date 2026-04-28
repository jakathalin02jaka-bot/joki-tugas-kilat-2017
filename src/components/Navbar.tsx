import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

const links = [
  { href: '/', label: 'Beranda' },
  { href: '/booking', label: 'Pesan' },
  { href: '/payment', label: 'Bayar' },
  { href: '/track', label: 'Cek Status' },
  { href: '/my-bookings', label: 'Booking Saya' },
  { href: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const location = useLocation()
  const path = location.pathname
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-purple-700">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </span>
          <span className="hidden sm:block">Joki Tugas Kilat</span>
          <span className="sm:hidden">JTK</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.filter((l) => l.label !== 'Admin').map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                path === l.href
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/booking"
            className="ml-2 px-5 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-1.5"
          >
            <Zap size={14} />
            Pesan
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-purple-50"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                path === l.href
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
