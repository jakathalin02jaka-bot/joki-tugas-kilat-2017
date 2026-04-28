import { motion } from 'framer-motion'

export default function NeonGlow({ color = 'purple', className = '' }: { color?: 'purple' | 'blue' | 'pink' | 'cyan' | 'green'; className?: string }) {
  const colorMap = {
    purple: 'from-purple-500/30 via-indigo-500/20 to-purple-500/30',
    blue: 'from-blue-500/30 via-indigo-500/20 to-blue-500/30',
    pink: 'from-pink-500/30 via-rose-500/20 to-pink-500/30',
    cyan: 'from-cyan-500/30 via-teal-500/20 to-cyan-500/30',
    green: 'from-emerald-500/30 via-green-500/20 to-emerald-500/30',
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <motion.div
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -inset-20 bg-gradient-to-r ${colorMap[color]} blur-3xl rounded-full`}
      />
    </div>
  )
}
