import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HeartPulse, X, Rotate3d, Info, CheckCircle, Sparkles } from 'lucide-react'
import { playHeartbeatSound } from '@/lib/audio'

interface ChamberInfo {
  id: string
  name: string
  bengaliName: string
  role: string
  color: string
  pressure: string
}

const anatomicalStructures: ChamberInfo[] = [
  {
    id: 'lv',
    name: 'Left Ventricle (LV)',
    bengaliName: 'বাম নিলয়',
    role: 'Pumps oxygen-rich blood into the aorta to nourish the entire human body. Has the thickest muscular myocardium.',
    color: '#e88776',
    pressure: '120 mmHg (High Pressure Systemic)',
  },
  {
    id: 'rv',
    name: 'Right Ventricle (RV)',
    bengaliName: 'ডান নিলয়',
    role: 'Pumps deoxygenated blood through the pulmonary valve into the pulmonary arteries to oxygenate in the lungs.',
    color: '#60a5fa',
    pressure: '25 mmHg (Low Pressure Pulmonary)',
  },
  {
    id: 'la',
    name: 'Left Atrium (LA)',
    bengaliName: 'বাম অলিন্দ',
    role: 'Receives fresh oxygenated blood from the four pulmonary veins and transfers it into the left ventricle via the mitral valve.',
    color: '#f43f5e',
    pressure: '8-10 mmHg',
  },
  {
    id: 'ra',
    name: 'Right Atrium (RA)',
    bengaliName: 'ডান অলিন্দ',
    role: 'Receives oxygen-poor systemic blood from the superior & inferior vena cava. Houses the Sinoatrial (SA) Node pacemaker.',
    color: '#38bdf8',
    pressure: '4-6 mmHg',
  },
  {
    id: 'aorta',
    name: 'Ascending Aorta & Arch',
    bengaliName: 'মহাধমনী',
    role: 'The primary arterial trunk delivering systemic arterial blood to the brain, heart arteries, and body extremities.',
    color: '#fb7185',
    pressure: 'Systemic Conduit',
  },
  {
    id: 'pulmonary',
    name: 'Pulmonary Artery',
    bengaliName: 'ফুসফুসীয় ধমনী',
    role: 'Bifurcates into right and left pulmonary arteries bringing venous blood to pulmonary alveolar capillaries.',
    color: '#818cf8',
    pressure: 'Pulmonary Trunk',
  },
]

export function Heart3dExplorer({ soundEnabled }: { soundEnabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedChamber, setSelectedChamber] = useState<ChamberInfo>(anatomicalStructures[0])
  const [rotX, setRotX] = useState(10)
  const [rotY, setRotY] = useState(-15)
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastMouse.current.x
    const dy = e.clientY - lastMouse.current.y
    setRotY((prev) => prev + dx * 0.4)
    setRotX((prev) => Math.max(-50, Math.min(50, prev - dy * 0.4)))
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const openExplorer = () => {
    if (soundEnabled) playHeartbeatSound()
    setIsOpen(true)
  }

  return (
    <>
      {/* Live Beating 3D Heart Trigger Card at the bottom */}
      <div className="max-w-2xl mx-auto my-12 px-4 text-center">
        <motion.button
          type="button"
          onClick={openExplorer}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="relative inline-flex items-center gap-4 px-6 py-4 rounded-3xl bg-gradient-to-r from-[#180a0c] via-[#091519] to-[#0d0708] border-2 border-[var(--coral)]/50 hover:border-[var(--coral)] transition-all cursor-pointer shadow-[0_0_35px_rgba(232,135,118,0.25)] group"
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing Concentric Rings */}
            <span className="absolute w-12 h-12 rounded-full bg-[var(--coral)]/20 animate-ping" />
            <div className="w-12 h-12 rounded-2xl bg-[var(--coral)]/20 border border-[var(--coral)]/60 flex items-center justify-center shadow-[0_0_20px_rgba(232,135,118,0.5)]">
              <HeartPulse className="w-7 h-7 text-[var(--coral)] animate-pulse" />
            </div>
          </div>

          <div className="text-left">
            <span className="text-[10px] font-mono tracking-widest text-[var(--coral)] uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> INTERACTIVE 3D ANATOMICAL MODEL
            </span>
            <h4 className="font-['Syne'] text-lg font-bold text-[var(--paper)]">
              Explore Subhajit&apos;s Beating Heart 3D
            </h4>
            <p className="text-xs text-[#b6c0bc]">
              Click to rotate, explore chambers & examine cardiac anatomy in 3D
            </p>
          </div>
        </motion.button>
      </div>

      {/* Full 3D Interactive Explorer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[#061014] border-2 border-[#1e424c] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#132d34] bg-[#040b0e]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--coral)]/20 flex items-center justify-center text-[var(--coral)]">
                    <HeartPulse className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-['Syne'] text-lg font-bold text-[var(--paper)]">
                      3D Human Cardiac Anatomy Explorer
                    </h3>
                    <p className="text-xs text-[#899791] font-mono">
                      Subhajit Sanpui · Cardiology Research Visualizer
                    </p>
                  </div>
                </div>

                {/* Specific Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0e2126] border border-[#23454e] hover:bg-[var(--coral)] hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer text-[#dfe6df]"
                  aria-label="Close 3D Heart Explorer"
                >
                  <span>Close Explorer</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive 3D Canvas & Inspection Deck */}
              <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
                {/* 3D Rotatable Heart Viewport */}
                <div
                  className="lg:col-span-7 bg-[#03080a] p-6 flex flex-col items-center justify-center relative cursor-grab active:cursor-grabbing select-none min-h-[340px]"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono text-[#899791] bg-[#071318]/80 px-3 py-1 rounded-full border border-[#142d34]">
                    <Rotate3d className="w-3.5 h-3.5 text-[var(--acid)] animate-spin" />
                    <span>DRAG TO ROTATE 3D PERSPECTIVE</span>
                  </div>

                  {/* 3D Heart Model Representation */}
                  <div
                    className="w-64 h-64 relative flex items-center justify-center transition-transform duration-75"
                    style={{
                      transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Beating Heart Core SVG */}
                    <motion.svg
                      animate={{ scale: [1, 1.08, 1, 1.14, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      viewBox="0 0 200 200"
                      className="w-56 h-56 drop-shadow-[0_0_35px_rgba(232,135,118,0.5)]"
                    >
                      <defs>
                        <radialGradient id="heartGrad" cx="40%" cy="40%" r="65%">
                          <stop offset="0%" stopColor="#f87171" />
                          <stop offset="55%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#7f1d1d" />
                        </radialGradient>
                      </defs>

                      {/* Aorta Arch */}
                      <path
                        d="M85 60 C80 20, 130 15, 135 55"
                        fill="none"
                        stroke="#fb7185"
                        strokeWidth="20"
                        strokeLinecap="round"
                      />
                      {/* Pulmonary Trunk */}
                      <path
                        d="M110 65 C125 45, 145 45, 155 70"
                        fill="none"
                        stroke="#818cf8"
                        strokeWidth="16"
                        strokeLinecap="round"
                      />
                      {/* Vena Cava */}
                      <path
                        d="M65 40 L65 75"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="16"
                        strokeLinecap="round"
                      />

                      {/* Main Ventricular & Atrial Body */}
                      <path
                        d="M100 185 C20 120, 30 70, 70 70 C88 70, 95 85, 100 95 C105 85, 112 70, 130 70 C170 70, 180 120, 100 185 Z"
                        fill="url(#heartGrad)"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                      />

                      {/* Coronary Arteries (Anterior Interventricular Artery) */}
                      <path
                        d="M100 95 Q105 130, 95 160"
                        fill="none"
                        stroke="#fef08a"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      <path
                        d="M102 120 Q120 135, 130 145"
                        fill="none"
                        stroke="#fef08a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  </div>

                  <div className="mt-4 text-[11px] font-mono text-[var(--acid)]">
                    CURRENT ORIENTATION: [{Math.round(rotX)}°, {Math.round(rotY)}°]
                  </div>
                </div>

                {/* Structure Selector & Telemetry Panel */}
                <div className="lg:col-span-5 p-6 bg-[#061216] border-t lg:border-t-0 lg:border-l border-[#132d34] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#899791] uppercase block mb-3">
                      SELECT ANATOMICAL STRUCTURE
                    </span>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {anatomicalStructures.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            if (soundEnabled) playHeartbeatSound()
                            setSelectedChamber(s)
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer text-xs font-mono ${
                            selectedChamber.id === s.id
                              ? 'bg-[var(--acid)]/15 border-[var(--acid)] text-[var(--paper)] font-bold shadow-md'
                              : 'bg-[#040b0e] border-[#142c33] text-[#899791] hover:text-[#dfe6df]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: s.color }}
                            />
                            <span className="truncate">{s.name.split(' ')[0]}</span>
                          </div>
                          <span className="text-[10px] text-[#9cc9b7] font-sans block truncate">
                            {s.bengaliName}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Structure Details Card */}
                    <div className="p-4 rounded-2xl bg-[#040b0e] border border-[#163038] shadow-inner">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-['Syne'] font-bold text-base text-[var(--paper)]">
                          {selectedChamber.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[var(--acid)]">
                          {selectedChamber.bengaliName}
                        </span>
                      </div>
                      <p className="text-xs text-[#b6c0bc] leading-relaxed mb-3">
                        {selectedChamber.role}
                      </p>
                      <div className="pt-2 border-t border-[#12262d] flex items-center justify-between text-[11px] font-mono text-[#899791]">
                        <span>HEMODYNAMIC PROFILE:</span>
                        <span className="text-[var(--coral)] font-bold">
                          {selectedChamber.pressure}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#132d34] flex items-center justify-between text-xs font-mono text-[#899791]">
                    <span>STATUS: NORMAL SINUS</span>
                    <span className="text-emerald-400">PULSE: 72 BPM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
