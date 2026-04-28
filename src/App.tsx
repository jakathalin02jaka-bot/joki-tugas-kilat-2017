import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import TrackPage from './pages/TrackPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminPage from './pages/AdminPage'
import PaymentPage from './pages/PaymentPage'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import BottomNav from './components/BottomNav'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  return (
    <>
      <ScrollProgress />
      <BackToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/booking" element={<AnimatedPage><BookingPage /></AnimatedPage>} />
          <Route path="/track" element={<AnimatedPage><TrackPage /></AnimatedPage>} />
          <Route path="/my-bookings" element={<AnimatedPage><MyBookingsPage /></AnimatedPage>} />
          <Route path="/admin" element={<AnimatedPage><AdminPage /></AnimatedPage>} />
          <Route path="/payment" element={<AnimatedPage><PaymentPage /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <BottomNav />}
    </>
  )
}

export default App
