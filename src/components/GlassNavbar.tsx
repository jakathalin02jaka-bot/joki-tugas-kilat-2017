import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, ShieldCheck } from 'lucide-react'

const links = [
  { href: '/', label: 'Beranda' },
  { href: '/booking', label: 'Pesan' },
  { href: '/payment', label: 'Bayar' },
  { href: '/track', label: 'Cek' },
  { href: '/my-bookings', label: 'Saya' },
  { href: '/admin', label: 'Admin', isAdmin: true },
]

const desktopLinks = links.filter((l) => !l.isAdmin)

export default function GlassNavbar() {
  const location = useLocation()
  const path = location.pathname
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-lg shadow-purple-100/30 border-b border-white/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-purple-700 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-300/40"
          >
            <Zap size={18} className="text-white" />
          </motion.div>
          <span className="hidden sm:block group-hover:text-purple-800 transition-colors">Joki Tugas Kilat</span>
          <span className="sm:hidden">JTK</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {desktopLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                path === l.href
                  ? 'text-purple-700'
                  : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/60'
              }`}
            >
              {path === l.href && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{l.label}</span>
            </Link>
          ))}
          {/* Admin pill */}
          <Link
            to="/admin"
            className={`relative ml-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 ${
              path === '/admin'
                ? 'text-purple-700'
                : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/60'
            }`}
          >
            {path === '/admin' && (
              <motion.div
                layoutId="nav-pill-admin"
                className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-xl shadow-sm"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <ShieldCheck size={14} className="relative z-10" />
            <span className="relative z-10">Admin</span>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/booking"
              className="ml-2 flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-300/40 hover:shadow-xl hover:shadow-purple-300/50 transition-all"
            >
              <Zap size={14} />Pesan
            </Link>
          </motion.div>
        </div>

        <button
          className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-purple-50/80 hover:text-purple-700 transition-all"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/80 backdrop-blur-xl border-t border-purple-100/50"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    path === l.href
                      ? l.isAdmin
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-purple-50/60 hover:text-purple-700'
                  }`}
                >
                  {l.isAdmin && <ShieldCheck size={14} className={path === l.href ? 'text-white' : 'text-gray-400'} />}
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
