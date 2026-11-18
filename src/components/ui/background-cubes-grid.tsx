import React from 'react'
import { cn } from '@/lib/utils'

export const BackgroundCubesGrid = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]',
        className
      )}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(156, 201, 183, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(156, 201, 183, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  )
}
