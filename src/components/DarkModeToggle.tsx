import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useApp()

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={toggleDarkMode}
      className="relative w-12 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 flex items-center px-1"
      aria-label={darkMode ? 'Light mode' : 'Dark mode'}
    >
      <motion.div
        animate={{ x: darkMode ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center"
      >
        {darkMode ? (
          <Moon size={11} className="text-purple-400" />
        ) : (
          <Sun size={11} className="text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  )
}
