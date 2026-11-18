import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Activity, Heart, Radio } from 'lucide-react'

export function RealtimeEcgMonitor() {
  const [bpm, setBpm] = useState(72)

  useEffect(() => {
    // Subtle realistic heart rate variation (71 - 75 BPM)
    const interval = setInterval(() => {
      setBpm(Math.floor(71 + Math.random() * 5))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#050e12]/90 border border-[#17353d] shadow-[0_0_30px_rgba(0,0,0,0.8)] mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#142c33] text-xs font-mono">
        <div className="flex items-center gap-2 text-[var(--acid)] font-bold">
          <Activity className="w-4 h-4 animate-pulse text-[var(--coral)]" />
          <span>TELEMETRY MONITOR · LEAD II SINUS RHYTHM</span>
        </div>
        <div className="flex items-center gap-4 text-[#899791]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-ping" />
            LIVE SIGNAL
          </span>
          <span className="hidden sm:inline">INTERVAL PR: 160ms</span>
          <span className="hidden sm:inline">QRS: 88ms</span>
          <span className="text-[var(--acid)] font-bold">{bpm} BPM</span>
        </div>
      </div>

      {/* Animated ECG Waveform Viewport */}
      <div className="relative h-14 overflow-hidden rounded-xl bg-[#03090b] border border-[#10242a]">
        <svg
          viewBox="0 0 1000 60"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Subtle Grid Lines */}
          <line x1="0" y1="30" x2="1000" y2="30" stroke="rgba(156,201,183,0.1)" strokeDasharray="3 3" />
          
          {/* ECG Trace Path */}
          <motion.path
            d="M0 30 L100 30 L115 22 L130 38 L145 10 L158 50 L168 25 L180 30 L220 30 L240 24 L260 30 L350 30 L365 22 L380 38 L395 10 L408 50 L418 25 L430 30 L470 30 L490 24 L510 30 L600 30 L615 22 L630 38 L645 10 L658 50 L668 25 L680 30 L720 30 L740 24 L760 30 L850 30 L865 22 L880 38 L895 10 L908 50 L918 25 L930 30 L970 30 L990 24 L1000 30"
            fill="none"
            stroke="var(--acid)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.6 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </svg>

        {/* Ambient pulse bead moving across */}
        <motion.div
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_var(--acid)] -ml-1.5"
        />
      </div>
    </div>
  )
}
