import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]',
        className
      )}
    >
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] bg-gradient-to-b from-[var(--acid)]/10 via-[var(--mint)]/5 to-transparent blur-3xl opacity-40 rounded-full" />
      <div className="absolute top-1/3 -right-40 h-[400px] w-[500px] bg-gradient-to-b from-[var(--coral)]/10 via-[var(--mint)]/5 to-transparent blur-3xl opacity-30 rounded-full" />
      
      {/* Animated Light Streaks */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scaleY: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--acid)]/25 to-transparent"
      />
      <motion.div
        animate={{
          opacity: [0.15, 0.4, 0.15],
          scaleY: [1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--mint)]/25 to-transparent"
      />
    </div>
  )
}
