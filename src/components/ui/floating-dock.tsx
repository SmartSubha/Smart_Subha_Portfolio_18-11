import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export interface DockItem {
  title: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
}

export const FloatingDock = ({
  items,
  className,
}: {
  items: DockItem[]
  className?: string
}) => {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto flex h-14 sm:h-16 items-center sm:items-end gap-1.5 sm:gap-3 rounded-full border border-[var(--line)] bg-[#071318]/90 px-2.5 sm:px-4 py-2 sm:pb-3 backdrop-blur-xl shadow-2xl shadow-black/80 max-w-[96vw] overflow-x-auto sm:overflow-visible scrollbar-none',
        className
      )}
    >
      {items.map((item) => (
        <DockIconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  )
}

function DockIconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: DockItem & { mouseX: any }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  // Responsive min/max dock icon sizing
  const widthSync = useTransform(distance, [-120, 0, 120], [38, 54, 38])
  const heightSync = useTransform(distance, [-120, 0, 120], [38, 54, 38])

  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 14 })
  const height = useSpring(heightSync, { mass: 0.1, stiffness: 180, damping: 14 })

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-full bg-[#0d2024] border border-[var(--line)] text-[#b6c0bc] hover:text-[var(--acid)] hover:border-[var(--acid)]/40 transition-colors cursor-pointer shadow-lg shrink-0 touch-manipulation"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 2, x: '-50%' }}
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--line)] bg-[#071318] px-2 py-0.5 text-[10px] font-mono tracking-wider text-[var(--paper)] shadow-md"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-center text-sm">{icon}</div>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} aria-label={title} className="shrink-0">
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} aria-label={title} className="cursor-pointer shrink-0">
      {content}
    </button>
  )
}
