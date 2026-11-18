import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export const GlareCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const isPointerInside = useRef(false)
  const refElement = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({
    glare: { x: 50, y: 50, opacity: 0 },
    background: { x: 50, y: 50 },
    rotate: { x: 0, y: 0 },
  })

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rotateFactor = 0.3
    const rect = event.currentTarget.getBoundingClientRect()
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
    const percentage = {
      x: (100 / rect.width) * position.x,
      y: (100 / rect.height) * position.y,
    }
    const delta = {
      x: percentage.x - 50,
      y: percentage.y - 50,
    }

    const { background, rotate, glare } = state
    background.x = 50 + percentage.x / 4 - 12.5
    background.y = 50 + percentage.y / 3 - 16.67
    rotate.x = -(delta.x / 3.5) * rotateFactor
    rotate.y = (delta.y / 2) * rotateFactor
    glare.x = percentage.x
    glare.y = percentage.y
    glare.opacity = 1

    setState({ ...state })
  }

  const handlePointerEnter = () => {
    isPointerInside.current = true
    if (refElement.current) {
      setTimeout(() => {
        if (isPointerInside.current) {
          refElement.current?.style.setProperty('--duration', '0s')
        }
      }, 300)
    }
  }

  const handlePointerLeave = () => {
    isPointerInside.current = false
    if (refElement.current) {
      refElement.current.style.removeProperty('--duration')
      refElement.current.style.setProperty('--r-x', `0deg`)
      refElement.current.style.setProperty('--r-y', `0deg`)
      setState((s) => ({
        ...s,
        glare: { ...s.glare, opacity: 0 },
        rotate: { x: 0, y: 0 },
      }))
    }
  }

  return (
    <div
      ref={refElement}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerLeave}
      className={cn(
        'relative isolate [contain:layout_style] [perspective:600px] transition-transform duration-[var(--duration,0.3s)] ease-[var(--easing,ease)] will-change-transform touch-manipulation cursor-pointer',
        className
      )}
      style={{
        transform: `rotateY(${state.rotate.x}deg) rotateX(${state.rotate.y}deg)`,
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[#071318] shadow-xl">
        {children}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: state.glare.opacity * 0.4,
            background: `radial-gradient(circle at ${state.glare.x}% ${state.glare.y}%, rgba(200, 233, 95, 0.3) 0%, rgba(156, 201, 183, 0.1) 40%, transparent 80%)`,
          }}
        />
      </div>
    </div>
  )
}
