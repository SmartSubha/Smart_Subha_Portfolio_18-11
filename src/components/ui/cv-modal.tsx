import React, { useEffect, useState } from 'react'
import { X, Printer, Download, ExternalLink, QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import { generateResumePdf } from '@/utils/generateResumePdf'

interface CvModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CvModal({ isOpen, onClose }: CvModalProps) {
  const [musicQr, setMusicQr] = useState<string>('')
  const [dataSpaceQr, setDataSpaceQr] = useState<string>('')
  const [portfolioQr, setPortfolioQr] = useState<string>('')
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  const musicUrl = 'https://ais-pre-z7meguzgpkxxpuajifaqdn-752094771694.asia-northeast1.run.app/'
  const dataSpaceUrl = 'https://dataofsmartsubha.netlify.app'
  const portfolioUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : 'https://ais-pre-sulpbmuvswuwy4aghpjmov-430241317112.asia-southeast1.run.app/'

  useEffect(() => {
    // Generate QR code data URLs for the 3 featured links
    QRCode.toDataURL(musicUrl, { margin: 1, width: 140, color: { dark: '#0a161d', light: '#ffffff' } })
      .then(setMusicQr)
      .catch(console.error)

    QRCode.toDataURL(dataSpaceUrl, { margin: 1, width: 140, color: { dark: '#0a161d', light: '#ffffff' } })
      .then(setDataSpaceQr)
      .catch(console.error)

    QRCode.toDataURL(portfolioUrl, { margin: 1, width: 140, color: { dark: '#0a161d', light: '#ffffff' } })
      .then(setPortfolioQr)
      .catch(console.error)
  }, [portfolioUrl])

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
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true)
    try {
      await generateResumePdf()
    } catch (err) {
      console.error('Failed to generate PDF:', err)
      // Fallback to print
      window.print()
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Print-specific style overrides */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-cv, #printable-cv * {
            visibility: visible !important;
          }
          #printable-cv {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col bg-[#071318] rounded-2xl border border-[#1b3b44] shadow-2xl overflow-hidden print:max-h-none print:max-w-none print:border-none print:bg-transparent">
        {/* Modal Top Bar (Controls) */}
        <div className="no-print flex items-center justify-between px-4 py-3 bg-[#0a1820] border-b border-[#18363f] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--acid)] animate-pulse" />
            <h3 className="font-['Syne'] font-bold text-sm sm:text-base text-white tracking-wide">
              Official Curriculum Vitae — Subhajit Sanpui
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e232c] hover:bg-[#14323e] border border-[#1b3d47] text-xs font-mono text-[#cbd5e1] hover:text-white transition-colors cursor-pointer"
              title="Print or Save as PDF via browser"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--acid)] text-[#04090b] text-xs font-mono font-bold tracking-wider hover:bg-[#d8f86f] transition-all cursor-pointer shadow-[0_0_15px_rgba(200,233,95,0.3)] disabled:opacity-50"
              title="Download standalone PDF document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#122832] transition-colors ml-1 cursor-pointer"
              aria-label="Close CV viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable CV Page */}
        <div className="overflow-y-auto p-2 sm:p-6 bg-[#04090c] flex justify-center print:p-0 print:overflow-visible">
          {/* THE EXACT CV DOCUMENT (Matching Screenshot 1:1) */}
          <div
            id="printable-cv"
            className="w-full max-w-[820px] bg-white text-[#1e293b] shadow-2xl p-6 sm:p-8 font-sans text-[13px] leading-relaxed select-text print:p-6"
            style={{ minHeight: '1080px' }}
          >
            {/* 1. DARK HEADER BLOCK */}
            <div className="bg-[#08121a] text-white rounded-xl p-5 sm:p-6 flex flex-col-reverse sm:flex-row justify-between items-start gap-4 shadow-md">
              <div className="flex-1">
                <h1 className="font-serif font-extrabold text-2xl sm:text-3xl tracking-wider text-slate-100 uppercase">
                  SUBHAJIT SANPUI
                </h1>
                <p className="text-[11px] sm:text-xs font-mono font-bold text-[#84cc16] tracking-wider mt-1 uppercase">
                  CLASS 10 SCHOLAR (BATCH 2027) · ASPIRING CARDIOLOGIST · WEB BUILDER
                </p>

                <div className="text-[11px] sm:text-xs text-slate-300 mt-3 space-y-0.5">
                  <p>
                    WhatsApp: <span className="text-white font-medium">+91 86702 25411</span> &nbsp;|&nbsp; Location:{' '}
                    <span className="text-white font-medium">West Bengal, India</span>
                  </p>
                  <p>
                    Instagram: <span className="text-white font-medium">@SMARTXSUBHA</span> &nbsp;|&nbsp; Facebook:{' '}
                    <span className="text-white font-medium">SUBHAJIT SANPUI</span>
                  </p>
                </div>

                {/* 3 Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-md bg-[#052017] text-[#4ade80] border border-[#15803d]/40">
                    WBBSE BOARD 2027
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#280f12] text-[#f87171] border border-[#991b1b]/40">
                    PRE-MEDICINE TRACK
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#0c2333] text-[#38bdf8] border border-[#0369a1]/40">
                    FRONTEND WEB DEV
                  </span>
                </div>
              </div>

              {/* Subhajit's Photo on Top Right */}
              <div className="shrink-0 self-center sm:self-start">
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden border-2 border-[#84cc16]/80 shadow-[0_0_15px_rgba(132,204,22,0.3)] bg-[#0c1f26]">
                  <img
                    src="/assets/aistudio/Subhajit-Sanpui_e673953e.jpg"
                    alt="Subhajit Sanpui"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* ECG WAVEFORM DIVIDER (Neon Green) */}
            <div className="my-4 relative flex items-center justify-center">
              <svg viewBox="0 0 700 24" className="w-full h-6 text-[#84cc16]" fill="none" stroke="currentColor">
                <path
                  d="M0 12 L220 12 L230 4 L240 20 L250 2 L260 22 L270 12 L430 12 L440 4 L450 20 L460 2 L470 22 L480 12 L700 12"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* SECTION 1: EXECUTIVE PROFILE & CAREER VISION */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 bg-[#15803d] rounded-[2px] shrink-0" />
                <h2 className="font-bold text-xs sm:text-[13px] tracking-wider text-slate-900 uppercase">
                  EXECUTIVE PROFILE &amp; CAREER VISION
                </h2>
                <div className="flex-1 h-px bg-slate-200 ml-2" />
              </div>
              <p className="text-[12px] text-slate-700 leading-relaxed text-justify">
                Focused Class 10 student (WBBSE Batch 2027) with an unwavering commitment to becoming a professional
                Cardiologist and medical technologist. Harmonizing deep pre-medical biological sciences (cardiac
                electrophysiology, hemodynamics, myocardial mechanics) with self-driven computational engineering (HTML,
                CSS, TypeScript, and modern web systems) to pioneer empathetic, data-driven patient monitoring solutions
                for tomorrow’s clinical practice.
              </p>
            </div>

            {/* SECTION 2: EDUCATION & MEDICAL ENTRANCE ROADMAP */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#15803d] rounded-[2px] shrink-0" />
                <h2 className="font-bold text-xs sm:text-[13px] tracking-wider text-slate-900 uppercase">
                  EDUCATION &amp; MEDICAL ENTRANCE ROADMAP
                </h2>
                <div className="flex-1 h-px bg-slate-200 ml-2" />
              </div>

              <div className="space-y-3.5">
                {/* Milestone 1 */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[12.5px] text-[#15803d]">
                      Secondary Examination (Madhyamik / Class 10)
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-600">
                      2026 – 2027 [ACTIVE]
                    </span>
                  </div>
                  <p className="italic text-[11px] text-slate-500">West Bengal Board of Secondary Education (WBBSE)</p>
                  <p className="text-[11.5px] text-slate-600 mt-0.5">
                    Focus: Biological Sciences, Physical Sciences &amp; Mathematics. Building academic rigor and board excellence.
                  </p>
                </div>

                {/* Milestone 2 */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[12.5px] text-[#b91c1c]">
                      Higher Secondary Science (10+2) &amp; NEET-UG Pre-Medical
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-600">
                      2027 – 2029 [TARGET]
                    </span>
                  </div>
                  <p className="italic text-[11px] text-slate-500">
                    Physics, Chemistry &amp; Advanced Cellular Biology Specialization
                  </p>
                  <p className="text-[11.5px] text-slate-600 mt-0.5">
                    Competitive preparation for National Eligibility cum Entrance Test (NEET-UG) targeting premier Medical Colleges.
                  </p>
                </div>

                {/* Milestone 3 */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[12.5px] text-slate-900">
                      MBBS Medical Degree &amp; Cardiology Specialization (MD / DM)
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-600">
                      2030 – 2035+ [LIFE MISSION]
                    </span>
                  </div>
                  <p className="italic text-[11px] text-slate-500">
                    Cardiovascular Diagnostics, Clinical Rotations &amp; Interventional Cardiology
                  </p>
                  <p className="text-[11.5px] text-slate-600 mt-0.5">
                    Mastery of echocardiography, angiographic interventions, arrhythmia management, and digital cardiac care.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: DUAL COMPETENCIES & TECHNICAL FOUNDATION */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#15803d] rounded-[2px] shrink-0" />
                <h2 className="font-bold text-xs sm:text-[13px] tracking-wider text-slate-900 uppercase">
                  DUAL COMPETENCIES &amp; TECHNICAL FOUNDATION
                </h2>
                <div className="flex-1 h-px bg-slate-200 ml-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Left Card: Cardiology & Biomedical */}
                <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-3.5 shadow-xs">
                  <h3 className="font-bold text-xs font-mono tracking-wider text-[#b91c1c] uppercase mb-2">
                    CARDIOLOGY &amp; BIOMEDICAL
                  </h3>
                  <ul className="text-[11px] text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>4-Chamber Heart Anatomy &amp; Valvular Bloodflow</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>Intrinsic Conduction: SA Node, AV Node, Purkinje</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>ECG Waveform Analysis: P, QRS, ST &amp; T Morphology</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>Systemic &amp; Pulmonary Hemodynamics Dynamics</span>
                    </li>
                  </ul>
                </div>

                {/* Right Card: Web Development & Computing */}
                <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-3.5 shadow-xs">
                  <h3 className="font-bold text-xs font-mono tracking-wider text-[#15803d] uppercase mb-2">
                    WEB DEVELOPMENT &amp; COMPUTING
                  </h3>
                  <ul className="text-[11px] text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>HTML5 Semantic Page Structure (80% Proficiency)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>Modern CSS3, Flexbox, Grid &amp; Tailwind Framework</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>Responsive Mobile &amp; Desktop Layout Engineering</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>Git Version Control &amp; Netlify / Cloud Deployments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 4: FEATURED LIVE DEPLOYMENTS (SCAN QR TO OPEN) */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#15803d] rounded-[2px] shrink-0" />
                <h2 className="font-bold text-xs sm:text-[13px] tracking-wider text-slate-900 uppercase">
                  FEATURED LIVE DEPLOYMENTS (SCAN QR TO OPEN)
                </h2>
                <div className="flex-1 h-px bg-slate-200 ml-2" />
              </div>

              <div className="space-y-3">
                {/* Project 01: Music Mind */}
                <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-3.5 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-[12px] sm:text-[12.5px] text-slate-900">
                        01 / Music Mind — Interactive Audio Beats Web Application
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#15803d] bg-emerald-100 shrink-0">
                        LIVE ON CLOUD
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                      Interactive web application engineered for audio beat experimentation, sound synthesis, and
                      real-time playback.
                    </p>
                    <a
                      href={musicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10.5px] font-mono font-semibold text-[#15803d] hover:underline mt-2"
                    >
                      <span>Tap or scan the real QR code to test beats live !—</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="shrink-0 flex flex-col items-center">
                    {musicQr ? (
                      <img src={musicQr} alt="Music Mind QR" className="w-16 h-16 sm:w-18 sm:h-18 rounded border border-slate-300" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-200 rounded animate-pulse" />
                    )}
                    <span className="text-[8.5px] font-mono font-bold text-slate-600 mt-1">SCAN TO PLAY</span>
                  </div>
                </div>

                {/* Project 02: My Data Space */}
                <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-3.5 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-[12px] sm:text-[12.5px] text-slate-900">
                        02 / My Data Space — Secure Personal Repository &amp; Vault
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#15803d] bg-emerald-100 shrink-0">
                        LIVE ON NETLIFY
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                      Clean personal repository utility designed to store critical documents, reference notes, and vital
                      resources securely.
                    </p>
                    <a
                      href={dataSpaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10.5px] font-mono font-semibold text-[#15803d] hover:underline mt-2"
                    >
                      <span>Tap or scan the real QR code to open personal vault !—</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="shrink-0 flex flex-col items-center">
                    {dataSpaceQr ? (
                      <img src={dataSpaceQr} alt="My Data Space QR" className="w-16 h-16 sm:w-18 sm:h-18 rounded border border-slate-300" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-200 rounded animate-pulse" />
                    )}
                    <span className="text-[8.5px] font-mono font-bold text-slate-600 mt-1">SCAN TO OPEN</span>
                  </div>
                </div>

                {/* Bottom Banner Card: Official Digital Portfolio & Lab */}
                <div className="rounded-xl bg-[#08121a] text-white p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-md">
                  <div className="shrink-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden p-[1.5px] border-2 border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                      <img
                        src="/assets/aistudio/file_00000000a2448208884829e99b4d5c60_6d4687cd.png"
                        alt="Subhajit Emblem"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex-1 px-1">
                    <h5 className="font-bold text-[11.5px] sm:text-[12px] font-mono text-[#84cc16] tracking-wider uppercase">
                      OFFICIAL DIGITAL PORTFOLIO &amp; INTERACTIVE LAB
                    </h5>
                    <p className="text-[10.5px] text-slate-300 mt-0.5 leading-tight">
                      Experience real-time ECG simulation, interactive cardiovascular roadmap, and contact channels.
                    </p>
                    <p className="text-[10px] font-medium text-[#f87171] mt-1">
                      Scan the QR code on the right with any phone camera to visit instantly
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-center">
                    {portfolioQr ? (
                      <div className="p-0.5 bg-white rounded">
                        <img src={portfolioQr} alt="Portfolio QR" className="w-14 h-14 sm:w-16 sm:h-16 rounded" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-slate-700 rounded animate-pulse" />
                    )}
                    <span className="text-[8px] font-mono font-bold text-[#84cc16] mt-1">PORTFOLIO QR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-1 mt-6">
              <span>Subhajit Sanpui · Curriculum Vitae · WBBSE Batch 2027 · Future Cardiologist</span>
              <span>Designed &amp; Built with Code by Subhajit Sanpui</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
