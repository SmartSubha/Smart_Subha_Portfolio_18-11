import React, { useRef } from 'react'
import { motion } from 'motion/react'
import {
  GraduationCap,
  FlaskConical,
  Stethoscope,
  HeartPulse,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react'

const milestones = [
  {
    phase: 'PHASE 01',
    period: '2026 – 2027',
    title: 'Secondary Board (Class 10) & Web Foundation',
    status: 'ACTIVE NOW',
    icon: GraduationCap,
    accent: 'var(--acid)',
    glow: 'rgba(200, 233, 95, 0.3)',
    keyObjectives: [
      'Secondary Examination (WBBSE) Mastery',
      'HTML (80%) & CSS Design System Building',
      'Publishing Web Apps: Music Mind & Data Space',
    ],
  },
  {
    phase: 'PHASE 02',
    period: '2028 – 2029',
    title: 'Higher Secondary Science & Medical Entrance (NEET)',
    status: 'NEXT HORIZON',
    icon: FlaskConical,
    accent: 'var(--mint)',
    glow: 'rgba(156, 201, 183, 0.3)',
    keyObjectives: [
      'Advanced Human Physiology & Cellular Biology',
      'Rigorous Physics & Chemistry Problem Solving',
      'NEET Pre-Medical Competitive Training',
    ],
  },
  {
    phase: 'PHASE 03',
    period: '2030 – 2035',
    title: 'MBBS Medical College & Clinical Rotations',
    status: 'CORE DESTINATION',
    icon: Stethoscope,
    accent: 'var(--coral)',
    glow: 'rgba(232, 135, 118, 0.3)',
    keyObjectives: [
      'Anatomy, Pathology & Cardiovascular Diagnostics',
      'Hospital Ward Patient Rotations & Cardiac Care',
      'Integrating Code in Patient Monitoring Systems',
    ],
  },
  {
    phase: 'PHASE 04',
    period: '2035+',
    title: 'Cardiologist & Medical Tech Pioneer',
    status: 'LIFE MISSION',
    icon: HeartPulse,
    accent: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.3)',
    keyObjectives: [
      'MD / DM in Cardiovascular Medicine',
      'Precision Cardiac Interventions & Healing',
      'Building Empathetic Healthcare Technologies',
    ],
  },
]

export function VisionRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="section-pad py-20 border-b border-[#132a30] relative overflow-hidden" id="roadmap">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#9cc9b7] uppercase mb-2">
              <Compass className="w-4 h-4 text-[var(--acid)]" />
              <span>HORIZON ROADMAP · 2026 → 2035+</span>
            </div>
            <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-[var(--paper)]">
              Vision Timeline.
            </h2>
          </div>
          <p className="text-sm text-[#899791] max-w-md font-mono">
            A long-term architectural blueprint bridging Class 10 academic excellence, medical
            entrance, and cardiology specialization.
          </p>
        </div>

        {/* Horizontal Grid Track */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {milestones.map((m, idx) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.phase}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97, y: -2 }}
                tabIndex={0}
                className="p-6 rounded-3xl bg-[#071318]/90 border border-[#18363e] hover:border-[var(--acid)]/70 active:border-[var(--acid)] transition-all shadow-xl relative flex flex-col justify-between group overflow-hidden touch-manipulation cursor-pointer"
              >
                {/* Glowing top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300"
                  style={{ backgroundColor: m.accent }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest font-bold uppercase"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${m.accent} 15%, transparent)`,
                        color: m.accent,
                        border: `1px solid color-mix(in srgb, ${m.accent} 35%, transparent)`,
                      }}
                    >
                      {m.phase}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#dfe6df]">{m.period}</span>
                  </div>

                  <div
                    className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${m.accent} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${m.accent} 30%, transparent)`,
                      boxShadow: `0 0 15px ${m.glow}`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: m.accent }} />
                  </div>

                  <h3 className="font-['Syne'] text-lg font-bold text-[var(--paper)] leading-snug">
                    {m.title}
                  </h3>

                  <div className="mt-5 pt-4 border-t border-[#132a30] space-y-2.5">
                    {m.keyObjectives.map((obj) => (
                      <div key={obj} className="flex items-start gap-2 text-xs text-[#b6c0bc]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: m.accent }} />
                        <span className="leading-relaxed">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 flex items-center justify-between text-[11px] font-mono text-[#899791]">
                  <span>{m.status}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
