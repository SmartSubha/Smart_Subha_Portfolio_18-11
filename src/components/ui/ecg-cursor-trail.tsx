import React, { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  life: number
  color: string
  size: number
}

export function EcgCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Disable on touch devices to conserve performance
    if (window.matchMedia('(pointer: coarse)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const points: Point[] = []
    let mouse = { x: -100, y: -100 }
    let count = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY

      count++
      // Alternate between neon acid green and soft clinical coral
      const isAcid = count % 2 === 0
      points.push({
        x: mouse.x,
        y: mouse.y,
        life: 1.0,
        color: isAcid ? '#c8e95f' : '#e88776',
        size: isAcid ? 3.5 : 2.5,
      })
    }

    window.addEventListener('mousemove', onMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        p.life -= 0.025

        if (p.life <= 0) {
          points.splice(i, 1)
          i--
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.life * 0.7
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10 * p.life
        ctx.fill()
        ctx.restore()
      }

      // Draw faint connecting ECG trail lines between recent points
      if (points.length > 2) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.strokeStyle = 'rgba(200, 233, 95, 0.25)'
        ctx.lineWidth = 1.2
        ctx.stroke()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
    />
  )
}
