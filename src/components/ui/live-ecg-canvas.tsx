import React, { useEffect, useRef } from 'react'

export function LiveEcgCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = canvas.width = rect.width * window.devicePixelRatio
      height = canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // ECG wave generator function
    // Represents P-wave, PR-segment, Q-wave, R-peak, S-dip, ST-segment, T-wave
    function getEcgY(t: number, baseline: number, scale: number): number {
      const phase = (t % 1.0) // 0 to 1 cycle
      let y = 0

      if (phase >= 0.1 && phase < 0.2) {
        // P-wave (atrial depolarization)
        y = Math.sin(((phase - 0.1) / 0.1) * Math.PI) * 0.22
      } else if (phase >= 0.27 && phase < 0.3) {
        // Q-dip (ventricular septum)
        y = -0.2
      } else if (phase >= 0.3 && phase < 0.35) {
        // R-peak (ventricular depolarization - sharp massive deflection)
        const sub = (phase - 0.3) / 0.05
        y = sub < 0.5 ? sub * 2 * 1.5 : (1 - (sub - 0.5) * 2) * 1.5
      } else if (phase >= 0.35 && phase < 0.38) {
        // S-wave (basal ventricle)
        y = -0.4
      } else if (phase >= 0.48 && phase < 0.65) {
        // T-wave (ventricular repolarization)
        y = Math.sin(((phase - 0.48) / 0.17) * Math.PI) * 0.4
      }

      return baseline - y * scale
    }

    let sweepX = 0
    const points: { x: number; y: number }[] = []
    const logicalWidth = canvas.getBoundingClientRect().width
    const logicalHeight = canvas.getBoundingClientRect().height
    const baseline = logicalHeight * 0.52
    const scale = logicalHeight * 0.68

    // Initialize buffer
    for (let x = 0; x < logicalWidth; x += 2) {
      points.push({ x, y: baseline })
    }

    let t = 0

    const render = () => {
      t += 0.0075
      sweepX = (sweepX + 3) % logicalWidth

      // Update current point at sweep head
      const index = Math.floor(sweepX / 2)
      if (index >= 0 && index < points.length) {
        points[index].y = getEcgY(t, baseline, scale)
      }

      ctx.clearRect(0, 0, logicalWidth, logicalHeight)

      // Draw ECG trace
      ctx.save()
      ctx.lineWidth = 2.2
      ctx.strokeStyle = '#c8e95f'
      ctx.shadowColor = '#c8e95f'
      ctx.shadowBlur = 10
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'

      ctx.beginPath()
      let started = false

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const distFromSweep = Math.abs(p.x - sweepX)

        // Clear a blank gap ahead of sweep beam like clinical telemetry
        if (p.x > sweepX && p.x < sweepX + 24) {
          started = false
          continue
        }

        if (!started) {
          ctx.moveTo(p.x, p.y)
          started = true
        } else {
          ctx.lineTo(p.x, p.y)
        }
      }
      ctx.stroke()

      // Sweep bead with glowing pulse
      ctx.beginPath()
      ctx.arc(sweepX, getEcgY(t, baseline, scale), 3.5, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#c8e95f'
      ctx.shadowBlur = 15
      ctx.fill()
      ctx.restore()

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="w-full h-[70px] block" />
    </div>
  )
}
