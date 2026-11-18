import React from 'react'
import { cn } from '@/lib/utils'

export const SquigglyText = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('relative inline-block font-bold text-[var(--paper)]', className)}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute -bottom-2 left-0 w-full h-2.5 text-[var(--coral)] pointer-events-none"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
      >
        <path
          d="M0 6 Q 12 0, 25 6 T 50 6 T 75 6 T 100 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
