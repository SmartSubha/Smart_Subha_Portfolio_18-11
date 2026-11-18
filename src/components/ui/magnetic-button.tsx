import React, { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export const MagneticButton = ({
  children,
  className,
  intensity = 0.35,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
  intensity?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * intensity, y: middleY * intensity })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 220, damping: 15, mass: 0.1 }}
      className={cn('inline-block touch-manipulation cursor-pointer', className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  )
}
