import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  type: 'cell' | 'node'
  alpha: number
  rotation: number
  vRot: number
}

export function BioFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const count = 45
    const particles: Particle[] = []
    let mouse = { x: -1000, y: -1000 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Populate particles: 60% erythrocytes (red blood cell discs), 40% digital code nodes
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 6 + 4,
        type: Math.random() > 0.4 ? 'cell' : 'node',
        alpha: Math.random() * 0.25 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.015,
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse interaction: gentle repulsion
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 180) {
          const force = (180 - dist) / 180
          p.x -= (dx / dist) * force * 1.5
          p.y -= (dy / dist) * force * 1.5
        }

        p.x += p.vx
        p.y += p.vy
        p.rotation += p.vRot

        // Screen wrap
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20
        if (p.y < -20) p.y = canvas.height + 20
        if (p.y > canvas.height + 20) p.y = -20

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.alpha

        if (p.type === 'cell') {
          // Biconcave Erythrocyte (Red blood cell)
          ctx.beginPath()
          ctx.ellipse(0, 0, p.radius * 1.3, p.radius * 0.9, 0, 0, Math.PI * 2)
          ctx.fillStyle = '#e88776'
          ctx.shadowColor = '#e88776'
          ctx.shadowBlur = 8
          ctx.fill()

          // Inner cell indentation
          ctx.beginPath()
          ctx.ellipse(0, 0, p.radius * 0.6, p.radius * 0.4, 0, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(7, 19, 24, 0.5)'
          ctx.fill()
        } else {
          // Digital telemetry node (diamond / square with neon glow)
          ctx.beginPath()
          ctx.rect(-p.radius * 0.6, -p.radius * 0.6, p.radius * 1.2, p.radius * 1.2)
          ctx.fillStyle = '#c8e95f'
          ctx.shadowColor = '#c8e95f'
          ctx.shadowBlur = 10
          ctx.fill()
        }

        ctx.restore()
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] opacity-70"
    />
  )
}
