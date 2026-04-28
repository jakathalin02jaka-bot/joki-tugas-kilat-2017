import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ClipboardPlus, CreditCard, Search, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

const items = [
  { to: '/', icon: Home, label: 'Beranda' },
  { to: '/booking', icon: ClipboardPlus, label: 'Pesan' },
  { to: '/payment', icon: CreditCard, label: 'Bayar' },
  { to: '/track', icon: Search, label: 'Cek' },
  { to: '/my-bookings', icon: User, label: 'Saya' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const { pendingCount } = useApp()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-gray-200/60 safe-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.map(({ to, icon: Icon, label }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-[52px]"
            >
              {active && (
                <motion.div
                  layoutId="bottom-tab"
                  className="absolute inset-0 bg-purple-100 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.5}
                  className={`relative z-10 transition-colors ${active ? 'text-purple-700' : 'text-gray-400'}`}
                />
                {/* Badge on track tab */}
                {to === '/track' && pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white animate-pulse">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </div>
              <span className={`relative z-10 text-[9px] font-medium transition-colors ${active ? 'text-purple-700' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
