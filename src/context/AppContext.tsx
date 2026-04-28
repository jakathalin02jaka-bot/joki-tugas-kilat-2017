import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface AppContextType {
  darkMode: boolean
  toggleDarkMode: () => void
  adminLoggedIn: boolean
  adminLogin: () => void
  adminLogout: () => void
  pendingCount: number
}

const AppContext = createContext<AppContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  adminLoggedIn: false,
  adminLogin: () => {},
  adminLogout: () => {},
  pendingCount: 0,
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('jtk_darkmode') === 'true' ||
      (!localStorage.getItem('jtk_darkmode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('jtk_admin_auth') === 'true'
  })
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    localStorage.setItem('jtk_darkmode', String(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const checkPending = () => {
      try {
        const raw = localStorage.getItem('jtk_bookings')
        if (!raw) { setPendingCount(0); return }
        const bookings = JSON.parse(raw)
        const count = bookings.filter((b: { status: string }) => b.status === 'Pending').length
        setPendingCount(count)
      } catch { setPendingCount(0) }
    }
    checkPending()
    const id = setInterval(checkPending, 10000)
    return () => clearInterval(id)
  }, [])

  const toggleDarkMode = () => setDarkMode((p) => !p)
  const adminLogin = () => {
    setAdminLoggedIn(true)
    localStorage.setItem('jtk_admin_auth', 'true')
  }
  const adminLogout = () => {
    setAdminLoggedIn(false)
    localStorage.removeItem('jtk_admin_auth')
  }

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, adminLoggedIn, adminLogin, adminLogout, pendingCount }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
