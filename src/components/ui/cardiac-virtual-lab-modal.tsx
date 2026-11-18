import React, { useState, useEffect, useRef } from 'react'
import {
  Heart,
  Stethoscope,
  Activity,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  Award,
  Zap,
  Maximize2
} from 'lucide-react'

// Web Audio API Synthesizer for Heart Sounds (Auscultation S1, S2, and Murmurs)
class AuscultationAudioEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private timer: any = null

  constructor() {
    // Lazily created on first user gesture
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  // Play realistic S1 ("Lub") and S2 ("Dub") with valve-specific acoustic weighting
  public startAuscultationLoop(valveType: 'aortic' | 'pulmonic' | 'tricuspid' | 'mitral', bpm: number = 72) {
    this.stop()
    this.initCtx()

    const intervalMs = (60 / bpm) * 1000

    const triggerCycle = () => {
      if (this.isMuted || !this.ctx) return
      const now = this.ctx.currentTime

      // S1 (Closure of Mitral & Tricuspid valves - lower pitch, slightly longer)
      // Mitral area has louder S1
      const s1Gain = valveType === 'mitral' ? 0.45 : valveType === 'tricuspid' ? 0.38 : 0.25
      const s1Freq = valveType === 'mitral' ? 62 : 68
      this.synthesizeHeartTone(now, s1Freq, 42, 0.14, s1Gain)

      // Systolic interval (approx 1/3 of cardiac cycle)
      const s2Delay = Math.max(0.18, (intervalMs / 1000) * 0.35)

      // S2 (Closure of Aortic & Pulmonic valves - higher pitch, snappier)
      // Aortic & Pulmonic areas have louder S2
      const s2Gain = valveType === 'aortic' ? 0.48 : valveType === 'pulmonic' ? 0.42 : 0.22
      const s2Freq = valveType === 'aortic' ? 95 : 88

      if (valveType === 'pulmonic') {
        // Physiological splitting of S2 (A2 followed by P2 ~30ms later)
        this.synthesizeHeartTone(now + s2Delay, s2Freq, 58, 0.08, s2Gain * 0.75)
        this.synthesizeHeartTone(now + s2Delay + 0.035, s2Freq - 10, 50, 0.07, s2Gain * 0.6)
      } else {
        this.synthesizeHeartTone(now + s2Delay, s2Freq, 55, 0.09, s2Gain)
      }
    }

    triggerCycle()
    this.timer = setInterval(triggerCycle, intervalMs)
  }

  private synthesizeHeartTone(
    startTime: number,
    startFreq: number,
    endFreq: number,
    duration: number,
    gainLevel: number
  ) {
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(220, startTime)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(startFreq, startTime)
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration)

      gain.gain.setValueAtTime(0.001, startTime)
      gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + duration + 0.02)
    } catch {
      // Ignored if browser blocks
    }
  }
}

const audioEngine = new AuscultationAudioEngine()

interface CardiacLabModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CardiacVirtualLabModal({ isOpen, onClose }: CardiacLabModalProps) {
  const [activeTab, setActiveTab] = useState<'stethoscope' | 'bloodflow' | 'ecg'>('stethoscope')
  const [isAudioMuted, setIsAudioMuted] = useState(false)

  // 1. Auscultation State
  const [selectedValve, setSelectedValve] = useState<'aortic' | 'pulmonic' | 'tricuspid' | 'mitral'>('mitral')
  const [isListening, setIsListening] = useState(true)
  const [chestBpm, setChestBpm] = useState(72)

  // 2. Bloodflow State
  const [selectedChamber, setSelectedChamber] = useState<string>('lv')
  const [isAutoFlow, setIsAutoFlow] = useState(true)
  const [flowStep, setFlowStep] = useState(0)

  // 3. ECG Diagnostics State
  const [selectedRhythm, setSelectedRhythm] = useState<'nsr' | 'tachy' | 'brady' | 'pvc' | 'afib'>('nsr')
  const [ecgBpm, setEcgBpm] = useState(72)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const phonocardiogramRef = useRef<HTMLCanvasElement | null>(null)

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
      audioEngine.stop()
    }
  }, [isOpen, onClose])

  // Manage auscultation audio loop
  useEffect(() => {
    if (isOpen && activeTab === 'stethoscope' && isListening) {
      audioEngine.setMuted(isAudioMuted)
      audioEngine.startAuscultationLoop(selectedValve, chestBpm)
    } else {
      audioEngine.stop()
    }
    return () => audioEngine.stop()
  }, [isOpen, activeTab, selectedValve, isListening, isAudioMuted, chestBpm])

  // Phonocardiogram (PCG) Visualizer Canvas for Tab 1
  useEffect(() => {
    if (!isOpen || activeTab !== 'stethoscope') return
    const canvas = phonocardiogramRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let x = 0
    const w = canvas.width
    const h = canvas.height
    const midY = h / 2

    ctx.fillStyle = '#051117'
    ctx.fillRect(0, 0, w, h)

    let cycleProgress = 0
    const cycleLength = (60 / chestBpm) * 60 // frames per beat at 60fps

    const render = () => {
      cycleProgress = (cycleProgress + 1) % cycleLength
      const phase = cycleProgress / cycleLength

      let amp = 0
      // S1 sound burst at phase 0.0 - 0.12
      if (phase >= 0.0 && phase <= 0.12) {
        const subPhase = phase / 0.12
        const envelope = Math.sin(subPhase * Math.PI)
        const mult = selectedValve === 'mitral' ? 1.0 : selectedValve === 'tricuspid' ? 0.8 : 0.5
        amp = Math.sin(cycleProgress * 1.8) * 36 * envelope * mult
      }
      // S2 sound burst at phase 0.35 - 0.44
      else if (phase >= 0.35 && phase <= 0.45) {
        const subPhase = (phase - 0.35) / 0.10
        const envelope = Math.sin(subPhase * Math.PI)
        const mult = selectedValve === 'aortic' ? 1.0 : selectedValve === 'pulmonic' ? 0.9 : 0.45
        amp = Math.sin(cycleProgress * 2.4) * 40 * envelope * mult
      } else {
        // Quiet baseline with micro physiological murmur / noise
        amp = (Math.random() - 0.5) * 2.5
      }

      ctx.fillStyle = 'rgba(5, 17, 23, 0.15)'
      ctx.fillRect(x, 0, 4, h)

      ctx.beginPath()
      ctx.strokeStyle = '#c8e95f'
      ctx.lineWidth = 1.8
      ctx.shadowBlur = 8
      ctx.shadowColor = '#c8e95f'
      ctx.moveTo(x, midY)
      ctx.lineTo(x + 1, midY + amp)
      ctx.stroke()
      ctx.shadowBlur = 0

      x = (x + 2) % w

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [isOpen, activeTab, selectedValve, chestBpm])

  // ECG Diagnostic Canvas Render for Tab 3
  useEffect(() => {
    if (!isOpen || activeTab !== 'ecg') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let cursorX = 0
    const w = canvas.width
    const h = canvas.height
    const midY = h * 0.55

    // Initialize grid background
    const drawGrid = () => {
      ctx.fillStyle = '#040d12'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = '#0e2933'
      ctx.lineWidth = 0.5
      for (let gx = 0; gx < w; gx += 20) {
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        ctx.lineTo(gx, h)
        ctx.stroke()
      }
      for (let gy = 0; gy < h; gy += 20) {
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(w, gy)
        ctx.stroke()
      }
    }

    drawGrid()

    let t = 0
    let lastY = midY

    const renderEcg = () => {
      t += 1

      // Frequency calculation based on selected rhythm
      let period = 60
      let yOffset = 0

      if (selectedRhythm === 'nsr') period = 55
      else if (selectedRhythm === 'tachy') period = 30
      else if (selectedRhythm === 'brady') period = 90
      else if (selectedRhythm === 'pvc') period = 65
      else if (selectedRhythm === 'afib') period = Math.floor(25 + Math.random() * 45)

      const cycle = t % period
      const norm = cycle / period

      // Waveform generator based on clinical morphology
      if (selectedRhythm === 'afib') {
        // Chaotic baseline, irregular QRS
        const fWave = Math.sin(t * 0.8) * 3 + (Math.random() - 0.5) * 4
        if (norm > 0.4 && norm < 0.44) {
          yOffset = -55 // QRS spike
        } else if (norm >= 0.44 && norm < 0.48) {
          yOffset = 18 // S wave
        } else {
          yOffset = fWave
        }
      } else if (selectedRhythm === 'pvc' && Math.floor(t / period) % 3 === 2) {
        // Occasional Premature Ventricular Contraction (Wide, bizarre QRS)
        if (norm > 0.3 && norm < 0.38) {
          yOffset = 70 // Deep wide inverted S wave
        } else if (norm >= 0.38 && norm < 0.46) {
          yOffset = -80 // Tall wide R' wave
        } else if (norm >= 0.46 && norm < 0.6) {
          yOffset = -18 // Inverted T wave
        }
      } else {
        // Standard P-Q-R-S-T morphology
        if (norm > 0.15 && norm < 0.25) {
          // P-Wave (Atrial Depolarization)
          yOffset = -Math.sin(((norm - 0.15) / 0.1) * Math.PI) * 12
        } else if (norm >= 0.33 && norm < 0.36) {
          // Q-Wave (Septal Depolarization)
          yOffset = 6
        } else if (norm >= 0.36 && norm < 0.42) {
          // R-Wave (Ventricular Depolarization Spike)
          yOffset = -75
        } else if (norm >= 0.42 && norm < 0.46) {
          // S-Wave
          yOffset = 18
        } else if (norm >= 0.52 && norm < 0.68) {
          // T-Wave (Ventricular Repolarization)
          yOffset = -Math.sin(((norm - 0.52) / 0.16) * Math.PI) * 20
        }
      }

      const currentY = midY + yOffset

      // Clear advancing sweep line area
      ctx.fillStyle = '#040d12'
      ctx.fillRect(cursorX, 0, 16, h)

      // Re-draw grid lines in cleared slice
      ctx.strokeStyle = '#0e2933'
      ctx.lineWidth = 0.5
      const sliceLeft = cursorX
      for (let gx = sliceLeft - (sliceLeft % 20); gx <= sliceLeft + 16; gx += 20) {
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        ctx.lineTo(gx, h)
        ctx.stroke()
      }

      // Draw ECG trace
      ctx.beginPath()
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2.2
      ctx.shadowBlur = 10
      ctx.shadowColor = '#38bdf8'
      ctx.moveTo(cursorX - 2 < 0 ? 0 : cursorX - 2, lastY)
      ctx.lineTo(cursorX, currentY)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Glowing cursor head
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(cursorX, currentY, 2.5, 0, Math.PI * 2)
      ctx.fill()

      lastY = currentY
      cursorX = (cursorX + 2) % w
      if (cursorX === 0) {
        lastY = midY
      }

      animId = requestAnimationFrame(renderEcg)
    }

    animId = requestAnimationFrame(renderEcg)
    return () => cancelAnimationFrame(animId)
  }, [isOpen, activeTab, selectedRhythm])

  // Tab 2 Auto Circulation Progression
  useEffect(() => {
    if (!isOpen || activeTab !== 'bloodflow' || !isAutoFlow) return
    const bloodFlowSteps = [
      'cava',
      'ra',
      'tricuspid',
      'rv',
      'pulmonary_art',
      'lungs',
      'pulmonary_vein',
      'la',
      'mitral',
      'lv',
      'aorta',
      'systemic',
    ]

    const interval = setInterval(() => {
      setFlowStep((prev) => {
        const next = (prev + 1) % bloodFlowSteps.length
        setSelectedChamber(bloodFlowSteps[next])
        return next
      })
    }, 2200)

    return () => clearInterval(interval)
  }, [isOpen, activeTab, isAutoFlow])

  if (!isOpen) return null

  // Valve Auscultation Data Dictionary
  const valveData = {
    aortic: {
      name: 'Aortic Area (A2 Focus)',
      anatomicalSite: '2nd Right Intercostal Space, Sternal Border',
      soundChar: 'S2 louder than S1. Sharp, crisp click of aortic semilunar valve closure.',
      clinicalRelevance: 'Key site for detecting Aortic Stenosis (ejection systolic murmur) and Aortic Regurgitation (early diastolic decrescendo murmur).',
      frequency: 'High-frequency snapping closure against systemic pressure (80-120 mmHg).',
    },
    pulmonic: {
      name: 'Pulmonic Area (P2 Focus)',
      anatomicalSite: '2nd Left Intercostal Space, Sternal Border',
      soundChar: 'Shows physiological splitting of S2 into A2 & P2 during deep inspiration.',
      clinicalRelevance: 'Crucial for identifying Pulmonic Stenosis, Pulmonary Hypertension (loud P2), and Atrial Septal Defect (fixed split S2).',
      frequency: 'Lower pressure closure against pulmonary circulation (10-25 mmHg).',
    },
    tricuspid: {
      name: 'Tricuspid Area (T1 Focus)',
      anatomicalSite: '4th & 5th Left Lower Sternal Border',
      soundChar: 'S1 component from right atrioventricular valve. Increases intensity with inspiration (Carvallo’s sign).',
      clinicalRelevance: 'Site for evaluating Tricuspid Regurgitation (holosystolic murmur) and right ventricular heave.',
      frequency: 'Medium-low frequency vibration across right ventricular inflow.',
    },
    mitral: {
      name: 'Mitral Area / Cardiac Apex (M1 Focus)',
      anatomicalSite: '5th Left Intercostal Space, Mid-Clavicular Line',
      soundChar: 'S1 is loudest here ("Lub"). Formed by forceful coaptation of mitral leaflets.',
      clinicalRelevance: 'Primary auscultation area for Mitral Regurgitation (apical systolic radiation to axilla) and Mitral Stenosis (mid-diastolic rumble with opening snap).',
      frequency: 'High acoustic amplitude; point of maximal cardiac impulse (PMI).',
    },
  }

  // Bloodflow Chambers & Vessels Telemetry
  const chamberDetails: Record<
    string,
    { title: string; o2: string; pressure: string; role: string; type: 'deox' | 'trans' | 'ox' }
  > = {
    cava: {
      title: 'Vena Cava (Superior & Inferior)',
      o2: '70% – 75% (Deoxygenated)',
      pressure: '2 – 6 mmHg (Central Venous Pressure)',
      role: 'Returns oxygen-depleted venous blood from the upper and lower body back to the heart.',
      type: 'deox',
    },
    ra: {
      title: 'Right Atrium (RA)',
      o2: '75%',
      pressure: '2 – 8 mmHg',
      role: 'Receives systemic venous return; passive filling reservoir that contracts before ventricular diastole.',
      type: 'deox',
    },
    tricuspid: {
      title: 'Tricuspid Atrioventricular Valve',
      o2: '75%',
      pressure: 'Opens when RA pressure > RV pressure',
      role: 'Triple-leaflet valve that prevents backflow into the right atrium during right ventricular systole.',
      type: 'deox',
    },
    rv: {
      title: 'Right Ventricle (RV)',
      o2: '75%',
      pressure: '15 – 30 mmHg (Systolic) / 0 – 8 mmHg (Diastolic)',
      role: 'Crescent-shaped pump propelling deoxygenated blood through the low-resistance pulmonary vascular bed.',
      type: 'deox',
    },
    pulmonary_art: {
      title: 'Pulmonary Artery & Valve',
      o2: '75% (Only artery carrying deoxygenated blood)',
      pressure: '15 – 28 mmHg (Mean: 14 mmHg)',
      role: 'Branches into left and right pulmonary arteries conveying blood to bilateral lung alveoli.',
      type: 'deox',
    },
    lungs: {
      title: 'Pulmonary Capillary Alveolar Bed',
      o2: 'Oxygenation Step (Jumps 75% ➔ 98-100%)',
      pressure: '6 – 12 mmHg capillary wedge pressure',
      role: 'Diffusion site where carbon dioxide is exhaled and hemoglobin molecules bind fresh oxygen molecules.',
      type: 'trans',
    },
    pulmonary_vein: {
      title: 'Pulmonary Veins (4 Vessels)',
      o2: '98% – 100% (Oxygenated)',
      pressure: '4 – 12 mmHg',
      role: 'Four pulmonary veins deliver oxygen-rich, bright scarlet arterial blood into the left atrium.',
      type: 'ox',
    },
    la: {
      title: 'Left Atrium (LA)',
      o2: '98% – 100%',
      pressure: '4 – 12 mmHg',
      role: 'Receives fully oxygenated blood from pulmonary veins, delivering it into the powerful systemic left ventricle.',
      type: 'ox',
    },
    mitral: {
      title: 'Bicuspid / Mitral Valve',
      o2: '98% – 100%',
      pressure: 'High-pressure AV valve barrier',
      role: 'Dual-leaflet precision valve anchoring via chordae tendineae and papillary muscles to withstand left ventricular pressure.',
      type: 'ox',
    },
    lv: {
      title: 'Left Ventricle (LV) — Master Systemic Pump',
      o2: '98% – 100%',
      pressure: '100 – 120 mmHg (Systolic) / 4 – 12 mmHg (Diastolic)',
      role: 'Thick muscular myocardium responsible for generating cardiac output against systemic vascular resistance.',
      type: 'ox',
    },
    aorta: {
      title: 'Ascending Aorta & Aortic Valve',
      o2: '99%',
      pressure: '120 mmHg (Systolic) / 80 mmHg (Diastolic)',
      role: 'Elastic conduit vessel absorbing pulsatile kinetic stroke volume and distributing oxygenated blood to all organs.',
      type: 'ox',
    },
    systemic: {
      title: 'Systemic Microcirculation & Brain/Body',
      o2: 'Delivered to Tissues (Cellular respiration)',
      pressure: 'Mean Arterial Pressure (MAP) ~93 mmHg',
      role: 'Delivers glucose, oxygen, and nutrients to brain, coronary arteries, kidneys, and working skeletal muscle.',
      type: 'ox',
    },
  }

  // ECG Rhythm Diagnostic Profiles
  const rhythmProfiles = {
    nsr: {
      name: 'Normal Sinus Rhythm (NSR)',
      rate: '60 – 100 BPM',
      pWave: 'Normal, smooth, upright in Lead II (Atrial depolarization originating from SA Node)',
      prInterval: '0.12 – 0.20 sec (Normal AV node conduction delay)',
      qrs: '< 0.12 sec (Narrow, crisp ventricular depolarization)',
      clinicalSummary: 'Standard healthy cardiac electrophysiology with synchronous atrioventricular mechanical coupling.',
    },
    tachy: {
      name: 'Sinus Tachycardia',
      rate: '100 – 150+ BPM',
      pWave: 'Present, may merge into preceding T wave at elevated frequencies',
      prInterval: 'Shortened physiological AV conduction',
      qrs: 'Narrow (< 0.10 sec)',
      clinicalSummary: 'Triggered by sympathetic activation, high cardiac demand, physical exertion, pyrexia, or anxiety.',
    },
    brady: {
      name: 'Sinus Bradycardia',
      rate: '40 – 58 BPM',
      pWave: 'Present, upright with extended diastolic resting baseline',
      prInterval: 'Normal to borderline upper limit',
      qrs: 'Narrow (< 0.12 sec)',
      clinicalSummary: 'Frequently observed in high-endurance cardiovascular athletes, high vagal tone, or conduction slowdown.',
    },
    pvc: {
      name: 'Premature Ventricular Contraction (PVC)',
      rate: 'Variable with ectopic bursts',
      pWave: 'Absent prior to ectopic beat; retrograde P may occur',
      prInterval: 'Not measurable for ectopic beat',
      qrs: '> 0.14 sec (Wide, bizarre, notched ventricular morphology)',
      clinicalSummary: 'Ectopic ventricular pacemaker fires prematurely before normal SA nodal signal reaches the bundle branches.',
    },
    afib: {
      name: 'Atrial Fibrillation (AFib)',
      rate: 'Irregularly irregular ventricular response (110 – 160 BPM unmedicated)',
      pWave: 'Absent; replaced by erratic micro-oscillatory fibrillatory "f" waves (350-600/min)',
      prInterval: 'Unmeasurable',
      qrs: 'Narrow, but unpredictable R-R intervals',
      clinicalSummary: 'Chaotic micro-reentry circuits in atria causing loss of atrial kick and elevated thromboembolism / stroke risk.',
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[96vh] flex flex-col bg-[#051117] rounded-3xl border-2 border-[#163a45] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(200,233,95,0.15)] overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#081820] border-b border-[#13303a] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[var(--acid)] animate-ping" />
            <div>
              <h3 className="font-['Syne'] font-bold text-sm sm:text-base text-white tracking-wide flex items-center gap-2">
                <span>Cardiology &amp; Bio-Medical Virtual Lab</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--acid)]/15 text-[var(--acid)] border border-[var(--acid)]/30">
                  CLINICAL SUITE
                </span>
              </h3>
              <p className="text-[10.5px] font-mono text-[#9cc9b7]">
                Designed &amp; Engineered by Subhajit Sanpui (WBBSE Batch 2027 · Future Cardiologist)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-xl bg-[#0c222c] hover:bg-[#12313f] border border-[#1b4352] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[var(--acid)]" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132f3b] transition-colors cursor-pointer"
              aria-label="Close Lab"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Main Tab Selectors */}
        <div className="grid grid-cols-3 bg-[#06151c] border-b border-[#13303a] text-xs font-mono font-bold uppercase tracking-wider shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('stethoscope')}
            className={`py-3 sm:py-3.5 px-2 text-center transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border-r border-[#13303a] ${
              activeTab === 'stethoscope'
                ? 'bg-[#0d2631] text-[var(--acid)] border-b-2 border-b-[var(--acid)] shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-[#091e27]'
            }`}
          >
            <Stethoscope className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Stethoscope Auscultation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bloodflow')}
            className={`py-3 sm:py-3.5 px-2 text-center transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border-r border-[#13303a] ${
              activeTab === 'bloodflow'
                ? 'bg-[#0d2631] text-rose-400 border-b-2 border-b-rose-400 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-[#091e27]'
            }`}
          >
            <Heart className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Blood Flow Journey</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ecg')}
            className={`py-3 sm:py-3.5 px-2 text-center transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'ecg'
                ? 'bg-[#0d2631] text-sky-400 border-b-2 border-b-sky-400 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-[#091e27]'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span className="truncate">3. ECG Arrhythmia Lab</span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040c11]">
          
          {/* ==================================================== */}
          {/* TAB 1: VIRTUAL STETHOSCOPE & AUSCULTATION SIMULATOR */}
          {/* ==================================================== */}
          {activeTab === 'stethoscope' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#081b24] p-4 rounded-2xl border border-[#163844]">
                <div>
                  <h4 className="font-['Syne'] text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[var(--acid)]" />
                    <span>Cardiac Auscultation &amp; Phonocardiography Station</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Select a cardiac valve area to position the stethoscope bell and hear real-time synthesized valve coaptation tones.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9cc9b7]">
                    <span>Rate:</span>
                    <input
                      type="range"
                      min="50"
                      max="130"
                      value={chestBpm}
                      onChange={(e) => setChestBpm(Number(e.target.value))}
                      className="w-20 sm:w-28 accent-[var(--acid)] cursor-pointer"
                    />
                    <span className="font-bold text-white w-12">{chestBpm} BPM</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsListening(!isListening)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isListening
                        ? 'bg-[var(--acid)] text-[#04090b] shadow-[0_0_15px_rgba(200,233,95,0.4)]'
                        : 'bg-[#102b37] text-slate-300'
                    }`}
                  >
                    {isListening ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isListening ? 'Auscultating' : 'Paused'}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Thorax Chest Model (4 Valve Spots) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Visual Chest Cavity */}
                <div className="lg:col-span-6 rounded-3xl bg-[#061720] border-2 border-[#163742] p-5 sm:p-6 relative overflow-hidden flex flex-col items-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
                    Anatomical Thoracic Wall &amp; Precordial Valve Sites
                  </span>

                  {/* Anatomical Schematic SVG */}
                  <div className="relative w-64 h-72 sm:w-72 sm:h-80 flex items-center justify-center">
                    {/* Simulated Ribcage & Heart Silhouette */}
                    <svg viewBox="0 0 200 240" className="w-full h-full opacity-35" fill="none" stroke="currentColor">
                      {/* Sternum */}
                      <rect x="94" y="25" width="12" height="130" rx="3" stroke="#38bdf8" strokeWidth="2" />
                      {/* Rib Arches */}
                      <path d="M 94 45 Q 40 45 20 70 M 106 45 Q 160 45 180 70" stroke="#9cc9b7" strokeWidth="1.5" />
                      <path d="M 94 75 Q 35 75 15 105 M 106 75 Q 165 75 185 105" stroke="#9cc9b7" strokeWidth="1.5" />
                      <path d="M 94 105 Q 30 105 10 140 M 106 105 Q 170 105 190 140" stroke="#9cc9b7" strokeWidth="1.5" />
                      <path d="M 94 135 Q 25 140 10 180 M 106 135 Q 175 140 190 180" stroke="#9cc9b7" strokeWidth="1.5" />
                      {/* Myocardial Silhouette */}
                      <path
                        d="M 100 65 C 130 50 155 80 145 130 C 135 170 100 200 80 205 C 65 190 60 145 75 105 C 85 80 90 70 100 65 Z"
                        fill="rgba(239, 68, 68, 0.15)"
                        stroke="#f87171"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                      />
                    </svg>

                    {/* Valve 1: Aortic (Right 2nd ICS) */}
                    <button
                      type="button"
                      onClick={() => setSelectedValve('aortic')}
                      className={`absolute top-[60px] left-[45px] sm:top-[68px] sm:left-[55px] p-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedValve === 'aortic'
                          ? 'bg-[var(--acid)] text-[#04090b] font-bold shadow-[0_0_25px_rgba(200,233,95,0.8)] scale-110 z-20'
                          : 'bg-[#09222c] text-white border border-[#1a4454] hover:border-[var(--acid)]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-[11px] font-mono">Aortic (2nd R)</span>
                    </button>

                    {/* Valve 2: Pulmonic (Left 2nd ICS) */}
                    <button
                      type="button"
                      onClick={() => setSelectedValve('pulmonic')}
                      className={`absolute top-[60px] right-[40px] sm:top-[68px] sm:right-[50px] p-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedValve === 'pulmonic'
                          ? 'bg-[var(--acid)] text-[#04090b] font-bold shadow-[0_0_25px_rgba(200,233,95,0.8)] scale-110 z-20'
                          : 'bg-[#09222c] text-white border border-[#1a4454] hover:border-[var(--acid)]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                      <span className="text-[11px] font-mono">Pulmonic (2nd L)</span>
                    </button>

                    {/* Valve 3: Tricuspid (Left 4th-5th Sternal Border) */}
                    <button
                      type="button"
                      onClick={() => setSelectedValve('tricuspid')}
                      className={`absolute top-[135px] left-[70px] sm:top-[150px] sm:left-[80px] p-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedValve === 'tricuspid'
                          ? 'bg-[var(--acid)] text-[#04090b] font-bold shadow-[0_0_25px_rgba(200,233,95,0.8)] scale-110 z-20'
                          : 'bg-[#09222c] text-white border border-[#1a4454] hover:border-[var(--acid)]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="text-[11px] font-mono">Tricuspid (4th L)</span>
                    </button>

                    {/* Valve 4: Mitral / Apex (Left 5th ICS MCL) */}
                    <button
                      type="button"
                      onClick={() => setSelectedValve('mitral')}
                      className={`absolute top-[175px] right-[35px] sm:top-[195px] sm:right-[45px] p-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedValve === 'mitral'
                          ? 'bg-[var(--acid)] text-[#04090b] font-bold shadow-[0_0_25px_rgba(200,233,95,0.8)] scale-110 z-20'
                          : 'bg-[#09222c] text-white border border-[#1a4454] hover:border-[var(--acid)]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[11px] font-mono">Mitral / Apex (5th L)</span>
                    </button>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 text-center mt-3">
                    Stethoscope positioned at: <span className="font-bold text-[var(--acid)]">{valveData[selectedValve].name}</span>
                  </p>
                </div>

                {/* Real-time Phonocardiogram (PCG) & Valve Analysis */}
                <div className="lg:col-span-6 space-y-4">
                  {/* PCG Waveform Oscilloscope */}
                  <div className="rounded-3xl bg-[#061720] border-2 border-[#163742] p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[var(--acid)]" />
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          Phonocardiogram (PCG Acoustic Trace)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 animate-pulse font-bold">
                        ACTIVE STREAM
                      </span>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-[#163642] bg-[#051117] relative">
                      <canvas
                        ref={phonocardiogramRef}
                        width={480}
                        height={120}
                        className="w-full h-28 block"
                      />
                      <div className="absolute bottom-1.5 left-3 text-[9px] font-mono text-slate-500">
                        S1 (Mitral/Tricuspid) — Systole — S2 (Aortic/Pulmonic) — Diastole
                      </div>
                    </div>
                  </div>

                  {/* Clinical Description Card */}
                  <div className="rounded-3xl bg-[#071922] border-2 border-[#163945] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-['Syne'] font-bold text-white text-base">
                        {valveData[selectedValve].name}
                      </h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--acid)]/10 text-[var(--acid)] border border-[var(--acid)]/30 font-bold">
                        AUSCULTATION ZONE
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-mono text-slate-400">Anatomical Landmark: </span>
                        <span className="text-slate-200 font-medium">{valveData[selectedValve].anatomicalSite}</span>
                      </div>
                      <div>
                        <span className="font-mono text-slate-400">Acoustic Signature: </span>
                        <span className="text-[var(--acid)]">{valveData[selectedValve].soundChar}</span>
                      </div>
                      <div>
                        <span className="font-mono text-slate-400">Hemodynamic Profile: </span>
                        <span className="text-slate-300">{valveData[selectedValve].frequency}</span>
                      </div>
                      <div className="pt-2 border-t border-[#13323e]">
                        <span className="font-mono text-rose-300 font-bold block mb-1">Pathological Focus &amp; Murmurs:</span>
                        <p className="text-slate-300 leading-relaxed text-[11.5px]">
                          {valveData[selectedValve].clinicalRelevance}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: INTERACTIVE CARDIAC BLOODFLOW JOURNEY */}
          {/* ==================================================== */}
          {activeTab === 'bloodflow' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#180d12] p-4 rounded-2xl border border-rose-900/40">
                <div>
                  <h4 className="font-['Syne'] text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-400" />
                    <span>Double Circulation &amp; Chamber Hemodynamics Lab</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Follow oxygen-depleted blood as it flows through the right heart to the pulmonary circuit, oxygenates in the lungs, and returns through the systemic left heart.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAutoFlow(!isAutoFlow)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAutoFlow
                        ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : 'bg-[#24131a] text-slate-300'
                    }`}
                  >
                    {isAutoFlow ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isAutoFlow ? 'Auto Journey Running' : 'Manual Explore'}</span>
                  </button>
                </div>
              </div>

              {/* Pathway Breadcrumb Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px] font-mono">
                {[
                  { id: 'cava', label: '1. Vena Cava' },
                  { id: 'ra', label: '2. Right Atrium' },
                  { id: 'tricuspid', label: '3. Tricuspid' },
                  { id: 'rv', label: '4. Right Ventricle' },
                  { id: 'pulmonary_art', label: '5. Pulmonary Art.' },
                  { id: 'lungs', label: '6. Alveolar Lungs 💨' },
                  { id: 'pulmonary_vein', label: '7. Pulmonary Vein' },
                  { id: 'la', label: '8. Left Atrium' },
                  { id: 'mitral', label: '9. Mitral' },
                  { id: 'lv', label: '10. Left Ventricle' },
                  { id: 'aorta', label: '11. Aorta' },
                  { id: 'systemic', label: '12. Body System' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setIsAutoFlow(false)
                      setSelectedChamber(item.id)
                    }}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      selectedChamber === item.id
                        ? 'bg-rose-500 text-white font-bold shadow-md scale-105'
                        : 'bg-[#091a24] text-slate-300 hover:bg-[#0f2c3c] border border-[#183643]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Telemetry Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Chamber Telemetry Info Card */}
                <div className="md:col-span-7 rounded-3xl bg-[#071822] border-2 border-[#163945] p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        chamberDetails[selectedChamber].type === 'ox'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : chamberDetails[selectedChamber].type === 'trans'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      }`}>
                        {chamberDetails[selectedChamber].type === 'ox'
                          ? 'OXYGENATED SYSTEMIC CIRCUIT'
                          : chamberDetails[selectedChamber].type === 'trans'
                          ? 'PULMONARY TRANSITION & GAS EXCHANGE'
                          : 'DEOXYGENATED VENOUS RETURN'}
                      </span>

                      <span className="font-mono text-xs text-slate-400">
                        Physiological Stage
                      </span>
                    </div>

                    <h3 className="font-['Syne'] text-2xl font-extrabold text-white">
                      {chamberDetails[selectedChamber].title}
                    </h3>

                    <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                      {chamberDetails[selectedChamber].role}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#13323e]">
                    <div className="p-3.5 rounded-2xl bg-[#040e14] border border-[#122e39]">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Oxygen Saturation ($O_2$)
                      </span>
                      <span className="text-lg font-mono font-bold text-[var(--acid)] mt-1 block">
                        {chamberDetails[selectedChamber].o2}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#040e14] border border-[#122e39]">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Normal Chamber Pressure
                      </span>
                      <span className="text-lg font-mono font-bold text-rose-400 mt-1 block">
                        {chamberDetails[selectedChamber].pressure}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Circuit Comparison Graph / Facts */}
                <div className="md:col-span-5 rounded-3xl bg-[#071822] border-2 border-[#163945] p-6 space-y-4">
                  <h4 className="font-['Syne'] font-bold text-base text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--acid)]" />
                    <span>Cardiac Output &amp; Starling&apos;s Principles</span>
                  </h4>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-[#040e14] border border-[#122e39]">
                      <span className="font-mono font-bold text-[var(--acid)] block mb-0.5">
                        Cardiac Output Equation (CO):
                      </span>
                      <p className="font-mono text-[11px] text-white">
                        CO = HR × SV (approx. 72 bpm × 70 mL ≈ 5.04 L/min)
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#040e14] border border-[#122e39]">
                      <span className="font-mono font-bold text-sky-300 block mb-0.5">
                        Systemic vs Pulmonary Vascular Resistance:
                      </span>
                      <p className="text-[11px] text-slate-400">
                        LV operates against ~100-120 mmHg systemic pressure (high afterload), resulting in a myocardium 3× thicker than the RV.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#040e14] border border-[#122e39]">
                      <span className="font-mono font-bold text-emerald-400 block mb-0.5">
                        Frank-Starling Mechanism:
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Increased end-diastolic volume (preload) stretches myocardial sarcomeres to optimal actin-myosin overlap, maximizing stroke power.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: ECG WAVEFORM & ARRHYTHMIA DIAGNOSTIC LAB */}
          {/* ==================================================== */}
          {activeTab === 'ecg' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#071b26] p-4 rounded-2xl border border-sky-900/40">
                <div>
                  <h4 className="font-['Syne'] text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-400" />
                    <span>12-Lead Rhythm Diagnostics &amp; Vector Electrocardiography</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Select a cardiac electrophysiological rhythm to monitor the moving oscilloscope trace and examine P, QRS, and ST morphology.
                  </p>
                </div>

                {/* Rhythm Selector Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['nsr', 'tachy', 'brady', 'pvc', 'afib'] as const).map((rKey) => (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => {
                        setSelectedRhythm(rKey)
                        setQuizAnswer(null)
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        selectedRhythm === rKey
                          ? 'bg-sky-400 text-[#04090b] shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                          : 'bg-[#0a2330] text-slate-300 hover:text-white border border-[#163c4f]'
                      }`}
                    >
                      {rKey === 'nsr' && 'Normal Sinus'}
                      {rKey === 'tachy' && 'Tachycardia'}
                      {rKey === 'brady' && 'Bradycardia'}
                      {rKey === 'pvc' && 'Ectopic PVC'}
                      {rKey === 'afib' && 'Atrial Fib'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Moving ECG Oscilloscope Monitor Canvas */}
              <div className="rounded-3xl bg-[#040d12] border-2 border-[#163742] p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                      Lead II Oscilloscope Sweep (25 mm/s · 10 mm/mV)
                    </span>
                  </div>

                  <span className="text-xs font-mono text-sky-300 font-bold">
                    {rhythmProfiles[selectedRhythm].name}
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-[#14323e] bg-[#040d12] relative">
                  <canvas
                    ref={canvasRef}
                    width={760}
                    height={160}
                    className="w-full h-36 sm:h-44 block"
                  />
                  <div className="absolute top-2 right-3 px-2 py-1 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300">
                    Lead II Vector (+60°)
                  </div>
                </div>
              </div>

              {/* Anatomical Wave Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#061720] border border-[#163845]">
                  <span className="text-xs font-mono font-bold text-[var(--acid)] block mb-1">
                    P-Wave &amp; PR Interval
                  </span>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed">
                    <strong>P-Wave:</strong> Atrial depolarization via SA node (Right then Left Atrium). Normal amplitude &lt;2.5mm.
                    <br />
                    <strong>PR Interval:</strong> (0.12-0.20s) Represents physiological AV nodal transmission delay allowing ventricles to fill.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#061720] border border-[#163845]">
                  <span className="text-xs font-mono font-bold text-sky-400 block mb-1">
                    QRS Complex
                  </span>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed">
                    <strong>Ventricular Depolarization:</strong> Purkinje fibers and bundle of His drive synchronous explosive ventricular contraction. Normal duration: 0.08–0.11s (&lt;120ms).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#061720] border border-[#163845]">
                  <span className="text-xs font-mono font-bold text-rose-400 block mb-1">
                    ST Segment &amp; T-Wave
                  </span>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed">
                    <strong>ST Segment:</strong> Isoelectric plateau of ventricular action potential. ST elevation indicates acute myocardial infarction (STEMI).
                    <br />
                    <strong>T-Wave:</strong> Rapid ventricular repolarization phase.
                  </p>
                </div>
              </div>

              {/* Clinical Rhythm Summary */}
              <div className="p-4 rounded-2xl bg-[#081a24] border border-[#163a48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono text-slate-400">Selected Rhythm Diagnosis: </span>
                  <span className="font-bold text-white text-sm">{rhythmProfiles[selectedRhythm].name}</span>
                  <p className="text-slate-300 mt-1">{rhythmProfiles[selectedRhythm].clinicalSummary}</p>
                </div>
                <div className="shrink-0 font-mono text-[11px] text-[#9cc9b7] bg-[#051117] px-3 py-1.5 rounded-xl border border-[#14323e]">
                  Heart Rate: {rhythmProfiles[selectedRhythm].rate}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-[#06151c] border-t border-[#13303a] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 shrink-0">
          <span>Subhajit Sanpui · Madhyamik Scholar &amp; Future Cardiologist</span>
          <div className="flex items-center gap-3">
            <span className="text-[var(--acid)] font-bold">WBBSE Batch 2027</span>
            <span>•</span>
            <span className="text-sky-300 font-bold">NEET-UG Target 2029</span>
          </div>
        </div>

      </div>
    </div>
  )
}
