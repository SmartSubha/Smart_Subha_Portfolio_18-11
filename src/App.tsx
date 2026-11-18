/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  Check,
  Code2,
  Facebook,
  HeartPulse,
  Instagram,
  Laptop,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Stethoscope,
  X,
  Headphones,
  Home,
  Layers,
  User,
  Terminal,
  GraduationCap,
  Compass,
  Globe,
  Play,
  ShieldCheck,
  Download,
  Wrench,
} from 'lucide-react'
import { motion, useScroll, useSpring, type Variants } from 'motion/react'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { GlareCard } from '@/components/ui/glare-card'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { BackgroundCubesGrid } from '@/components/ui/background-cubes-grid'
import { FloatingDock, type DockItem } from '@/components/ui/floating-dock'

// Specialized components
import { BioFluidCanvas } from '@/components/ui/bio-fluid-canvas'
import { LiveEcgCanvas } from '@/components/ui/live-ecg-canvas'
import { VisionRoadmap } from '@/components/ui/vision-roadmap'
import { RealtimeEcgMonitor } from '@/components/ui/realtime-ecg-monitor'
import { VcardQrCard } from '@/components/ui/vcard-qr-card'
import { LiveActiveBadge } from '@/components/ui/live-active-badge'
import { AdminPanelModal, saveContactMessage } from '@/components/ui/admin-panel-modal'
import { CvModal } from '@/components/ui/cv-modal'
import { generateResumePdf } from '@/utils/generateResumePdf'

// Authentic portrait image uploaded by Subhajit Sanpui (for Hero Front)
const PROFILE_IMAGE = '/assets/aistudio/Subhajit-Sanpui_e673953e.jpg'

// Official Emblem / Logo uploaded by Subhajit Sanpui (for App Icon, Favicon, Brand Logo)
const APP_LOGO = '/assets/aistudio/file_00000000a2448208884829e99b4d5c60_6d4687cd.png'

// Live Web App Link for Devipaksha-Sharodiya
const DEVIPAKSHA_APP_URL = 'https://durgapujaa.netlify.app'

// Live Web App Link for PC Tool Website
const PC_TOOL_APP_URL = 'https://pctool.ai.studio'

// Staggered entrance animation variants for Projects section
const projectCardVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
}

const projectChildVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const cardiologyMilestones = [
  {
    step: '01',
    title: 'Human Heart Anatomy',
    desc: '4 Chambers (Right/Left Atria & Ventricles), Interventricular Septum, and Heart Valves (Tricuspid, Bicuspid/Mitral, Aortic & Pulmonary).',
    status: 'Mastering',
    tag: 'ANATOMY · CORE',
  },
  {
    step: '02',
    title: 'Cardiac Conduction System',
    desc: 'The electrical pacemaker network: Sinoatrial (SA) Node → Atrioventricular (AV) Node → Bundle of His → Purkinje Fibers.',
    status: 'In Progress',
    tag: 'ELECTROPHYSIOLOGY',
  },
  {
    step: '03',
    title: 'Normal Sinus Rhythm & ECG Waves',
    desc: 'Deciphering cardiac rhythm: P wave (atrial depolarization), QRS complex (ventricular depolarization), and T wave (repolarization).',
    status: 'Studying',
    tag: 'ECG DIAGNOSTICS',
  },
  {
    step: '04',
    title: 'Systemic & Pulmonary Circulation',
    desc: 'Dual-loop hemodynamics: oxygenation in pulmonary capillary beds and vital nutrient distribution through systemic arterial trees.',
    status: 'Foundational',
    tag: 'HEMODYNAMICS',
  },
  {
    step: '05',
    title: 'Preventive Cardiology & Health Tech',
    desc: 'Lifestyle cardiology, early cardiovascular disease detection, and blending computational tools with clinical human empathy.',
    status: 'Life Goal',
    tag: 'FUTURE MEDICINE',
  },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [activeTab, setActiveTab] = useState<'code' | 'cardiology'>('code')
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isCvModalOpen, setIsCvModalOpen] = useState(false)

  const handleDownloadResume = async () => {
    if (isGeneratingPdf) return
    setIsGeneratingPdf(true)
    try {
      await generateResumePdf()
    } catch (err) {
      console.error('Failed to generate resume PDF:', err)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Top page scroll progress calculation
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  })

  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    const o = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('revealed')),
      { threshold: 0.12 }
    )
    items.forEach((i) => o.observe(i))
    return () => o.disconnect()
  }, [])

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('sending')
    try {
      const f = e.currentTarget
      const formData = new FormData(f)
      const name = (formData.get('name') as string) || ''
      const email = (formData.get('email') as string) || ''
      const message = (formData.get('message') as string) || ''

      // Immediately save message to Admin Storage so Subha can read it with SUBHA ADMIN 420
      saveContactMessage({ name, email, message })

      await fetch('/contact.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      }).catch(() => {
        // Dev fallback
      })
      f.reset()
      setFormState('sent')
    } catch {
      setFormState('error')
    }
  }

  const dockItems: DockItem[] = [
    { title: 'Home', icon: <Home className="w-5 h-5" />, href: '#top' },
    { title: 'About', icon: <User className="w-5 h-5" />, href: '#about' },
    { title: 'Skills', icon: <Code2 className="w-5 h-5" />, href: '#skills' },
    { title: 'Projects', icon: <Layers className="w-5 h-5" />, href: '#projects' },
    { title: 'Roadmap', icon: <Compass className="w-5 h-5 text-[var(--acid)]" />, href: '#roadmap' },
    { title: 'Contact', icon: <Mail className="w-5 h-5" />, href: '#contact' },
    {
      title: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
      href: 'https://wa.me/8670225411',
    },
  ]

  return (
    <main className="site-shell relative tech-grid-bg min-h-screen text-[#e9eee9]">
      {/* Top Page Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[var(--acid)] via-[var(--mint)] to-[var(--coral)] origin-left z-50 shadow-[0_0_15px_rgba(200,233,95,0.7)]"
        style={{ scaleX }}
      />

      {/* Bio-Digital Fluid Particles (Erythrocytes & Code Nodes) in Background */}
      <BioFluidCanvas />

      {/* Animated Heartbeat Radial Pulse Glow behind the entire site */}
      <div className="heartbeat-ambient-glow" aria-hidden="true" />
      {/* Noise grain texture */}
      <div className="grain" aria-hidden="true" />
      {/* High-tech cubes grid mesh */}
      <BackgroundCubesGrid className="fixed inset-0 pointer-events-none" />

      {/* Primary Navigation */}
      <header className="nav-wrap backdrop-blur-xl bg-[#04090b]/85 border-b border-[#132a30] sticky top-0 z-40 transition-all flex items-center justify-between w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 shrink-0">
          <a className="brand flex items-center gap-2.5 sm:gap-3" href="#top" aria-label="Smart Subha, back to top">
            <span className="brand-mark shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden p-[1.5px] border border-[var(--acid)] shadow-[0_0_15px_rgba(200,233,95,0.4)] flex items-center justify-center bg-[#07161b]">
              <img src={APP_LOGO} alt="Smart Subha Emblem" className="w-full h-full object-cover rounded-full" />
            </span>
            <span className="font-['Syne'] font-bold tracking-wider text-sm sm:text-base">
              SMART SUBHA
              <small className="font-mono text-[#899791] tracking-widest hidden sm:block">dream · learn · build</small>
            </span>
          </a>

          {/* Desktop divider separating brand and live badge with generous spacing */}
          <span className="hidden sm:inline-block w-px h-5 bg-[#183942]" aria-hidden="true" />

          {/* Top Live Online Visitors Badge */}
          <div className="shrink-0">
            <LiveActiveBadge />
          </div>
        </div>

        <nav
          id="primary-navigation"
          aria-label="Primary navigation"
          className={`${menuOpen ? 'nav-links open' : 'nav-links'} lg:mx-auto`}
        >
          {['About', 'Skills', 'Projects', 'Roadmap', 'Contact'].map((x, i) => (
            <a
              key={x}
              href={'#' + x.toLowerCase()}
              className="py-2.5 sm:py-0 border-b border-[#142c33]/60 sm:border-0 last:border-b-0 flex items-center gap-3 text-sm sm:text-xs"
              onClick={() => {
                setMenuOpen(false)
              }}
            >
              <span className="text-[var(--acid)] font-mono text-xs">0{i + 1}</span>
              <span>{x}</span>
            </a>
          ))}
        </nav>

        {/* Right header actions: Secret Admin Console button, Let's talk CTA & Hamburger Menu */}
        <div className="nav-actions-right flex items-center gap-3 sm:gap-5 lg:gap-6 shrink-0 ml-auto justify-end">
          {/* Secret Password Key Button (SUBHA ADMIN 420) - hidden on mobile */}
          <AdminPanelModal />

          <MagneticButton intensity={0.25} className="hidden md:inline-block">
            <a className="nav-cta !m-0 !justify-self-end" href="#contact">
              Let’s talk <ArrowDownRight />
            </a>
          </MagneticButton>

          <button
            type="button"
            className="menu-button p-2 rounded-xl text-white hover:text-[var(--acid)] hover:bg-[#07171d] transition-colors focus:outline-none"
            onClick={() => {
              setMenuOpen(!menuOpen)
            }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {menuOpen ? <X className="w-6 h-6 text-[var(--acid)]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Hero Section — Balanced Two-Column Editorial Grid */}
      <section className="hero relative overflow-hidden" id="top">
        <BackgroundBeams />

        {/* Left Column: Editorial Headline & Narrative */}
        <div className="hero-copy relative z-10">
          <div className="eyebrow">
            <span />
            CLASS 10 STUDENT · BATCH 2027 · INDIA
          </div>

          <h1>
            Learning the heart.
            <br />
            <em>Building</em> the future.
          </h1>

          <p className="hero-intro">
            Hi, I’m <strong>Subhajit Sanpui</strong> — a Class 10 student with an unwavering dream
            of becoming a <strong>cardiologist</strong>. Alongside biology, I’m learning{' '}
            <strong>code</strong> to turn medical curiosity into impactful software.
          </p>

          <div className="hero-actions flex flex-wrap items-center gap-3 sm:gap-4">
            <MagneticButton intensity={0.3}>
              <a className="button primary" href="#projects">
                Explore my work <ArrowDownRight />
              </a>
            </MagneticButton>

            <MagneticButton intensity={0.3}>
              <a className="button" href="#about">
                My story
              </a>
            </MagneticButton>

            <MagneticButton intensity={0.3}>
              <button
                type="button"
                onClick={() => setIsCvModalOpen(true)}
                className="button inline-flex items-center gap-2 cursor-pointer border border-[var(--acid)]/50 text-[var(--acid)] hover:bg-[var(--acid)]/10 shadow-[0_0_15px_rgba(200,233,95,0.15)]"
                title="View & Download Subhajit Sanpui's CV"
              >
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </button>
            </MagneticButton>
          </div>

          <div className="mini-proof">
            <span>
              <strong>02</strong> live projects
            </span>
            <span>
              <strong>80%</strong> HTML knowledge
            </span>
            <span>
              <strong>01</strong> big dream
            </span>
          </div>
        </div>

        {/* Right Column: Portrait Stage with Subhajit's Uploaded Image */}
        <div className="portrait-stage relative z-10">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="portrait-frame group overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(200,233,95,0.15)] border-2 border-[var(--acid)]/30 rounded-3xl aspect-[3/4] sm:aspect-[4/5] max-h-[580px]">
            <img
              src={PROFILE_IMAGE}
              alt="Subhajit Sanpui - Class 10 Student & Aspiring Cardiologist"
              className="w-full h-full object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105"
            />
            <span className="photo-label font-mono tracking-widest bg-[#04090b]/90 border border-[var(--acid)]/40 text-[var(--acid)]">
              SUBHAJIT / CLASS 10 (2027)
            </span>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            whileTap={{ scale: 0.94 }}
            tabIndex={0}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="floating-card pulse-card border border-[var(--coral)]/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer touch-manipulation active:scale-95 active:border-[var(--coral)]"
          >
            <HeartPulse className="text-[var(--coral)] animate-pulse" />
            <span>
              Future focus<strong className="text-[var(--coral)]">Cardiology</strong>
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            whileTap={{ scale: 0.94 }}
            tabIndex={0}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="floating-card status-card border border-[var(--acid)]/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer touch-manipulation active:scale-95 active:border-[var(--acid)]"
          >
            <span className="status-dot animate-ping" />
            <span>
              Currently<strong className="text-[var(--acid)]">Learning code</strong>
            </span>
          </motion.div>
        </div>

        {/* Realistic Continuous Physiological ECG Line Canvas right below the photo */}
        <div className="ecg-line opacity-75">
          <LiveEcgCanvas />
        </div>
      </section>

      {/* 01 / ABOUT — Upgraded High-Tech Manifesto */}
      <section className="section-pad py-20 border-b border-[#132a30]" id="about" data-reveal>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#9cc9b7] uppercase mb-6">
            <span className="w-8 h-[1.5px] bg-[var(--acid)] shadow-[0_0_8px_var(--acid)]" />
            <span>01 / ABOUT SUBHAJIT</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Title & World Pillars Block */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="kicker text-[var(--acid)] mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--acid)]" /> A curious mind, in progress
                </p>
                <h2 className="font-['Syne'] text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                  Two worlds.
                  <br />
                  <span className="text-[var(--acid)] drop-shadow-[0_0_25px_rgba(200,233,95,0.45)]">
                    One purpose.
                  </span>
                </h2>
              </div>

              {/* Animated World Pillars with Mobile Tap Support */}
              <div className="grid grid-cols-1 gap-4 pt-2">
                {/* World 01 */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 6 }}
                  whileTap={{ scale: 0.98, x: 4 }}
                  tabIndex={0}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="p-5 rounded-2xl bg-gradient-to-r from-[#12080a] to-[#07151a] border border-[#2b181a] hover:border-[var(--coral)]/80 active:border-[var(--coral)] active:bg-[#190d10] active:scale-[0.98] transition-all shadow-xl group cursor-pointer touch-manipulation"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--coral)]/15 border border-[var(--coral)]/40 flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-110 transition-transform shadow-[0_0_15px_rgba(232,135,118,0.2)]">
                      <HeartPulse className="w-6 h-6 text-[var(--coral)] animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--coral)] font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)]" />
                        WORLD 01 · MEDICINE
                      </span>
                      <h4 className="text-base font-bold text-[var(--paper)] mt-0.5">
                        Cardiovascular Science & Empathy
                      </h4>
                      <p className="text-xs text-[#899791] mt-1 font-mono">
                        Human care · Surgical mastery · Cardiology
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* World 02 */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 6 }}
                  whileTap={{ scale: 0.98, x: 4 }}
                  tabIndex={0}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="p-5 rounded-2xl bg-gradient-to-r from-[#08120b] to-[#07151a] border border-[#1c2e1f] hover:border-[var(--acid)]/80 active:border-[var(--acid)] active:bg-[#0c1c14] active:scale-[0.98] transition-all shadow-xl group cursor-pointer touch-manipulation"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--acid)]/15 border border-[var(--acid)]/40 flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-110 transition-transform shadow-[0_0_15px_rgba(200,233,95,0.2)]">
                      <Code2 className="w-6 h-6 text-[var(--acid)]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--acid)] font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--acid)]" />
                        WORLD 02 · TECHNOLOGY
                      </span>
                      <h4 className="text-base font-bold text-[var(--paper)] mt-0.5">
                        Modern Web Architecture & Logic
                      </h4>
                      <p className="text-xs text-[#899791] mt-1 font-mono">
                        Frontend · React · Problem solving
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Narrative copy & Animated Identity Spectrum */}
            <div className="lg:col-span-7 bg-[#061216]/90 p-5 sm:p-8 lg:p-10 rounded-3xl border border-[#1a3840] shadow-2xl relative">
              <div className="text-base sm:text-xl text-[#e9eee9] leading-relaxed font-light border-l-2 border-[var(--acid)] pl-4 sm:pl-5">
                I’m a <strong className="font-bold text-[var(--acid)]">Class 10 student (Batch 2027)</strong> who
                believes medicine and technology can work together to help people live healthier, longer
                lives.
              </div>

              <p className="text-sm sm:text-base text-[#b6c0bc] leading-relaxed mt-5 sm:mt-6">
                Right now, I’m building my foundations — exploring how the human cardiovascular
                system functions, strengthening my web development skills, and turning ideas into
                functioning software one milestone at a time.
              </p>

              {/* Upgraded Identity Spectrum Grid with Mobile Tap Glow */}
              <div className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-[#132a30]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[var(--acid)] uppercase font-semibold flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--acid)] animate-ping inline-block shrink-0" />
                    IDENTITY SPECTRUM
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#899791]">
                    SUBHAJIT SANPUI · 2027
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                  {[
                    { title: 'Student', icon: GraduationCap, sub: 'Class 10 · 2027', color: 'var(--acid)', glow: 'rgba(200,233,95,0.25)' },
                    { title: 'Learner', icon: BookOpen, sub: 'Biology & Web', color: 'var(--mint)', glow: 'rgba(156,201,183,0.25)' },
                    { title: 'Dreamer', icon: HeartPulse, sub: 'Cardiologist', color: 'var(--coral)', glow: 'rgba(232,135,118,0.25)' },
                    { title: 'Creator', icon: Sparkles, sub: 'Apps & Beats', color: '#60a5fa', glow: 'rgba(96,165,250,0.25)' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.title}
                        whileHover={{ y: -5, scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        tabIndex={0}
                        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                        className="p-3 sm:p-3.5 rounded-2xl bg-[#040c0f] border border-[#18363f] hover:border-[var(--acid)] active:border-[var(--acid)] active:bg-[#071920] active:scale-95 transition-all group cursor-pointer text-center shadow-lg relative overflow-hidden touch-manipulation"
                      >
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-110"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${item.color} 35%, transparent)`,
                            boxShadow: `0 0 15px ${item.glow}`,
                          }}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: item.color }} />
                        </div>
                        <strong className="block text-xs sm:text-sm font-['Syne'] text-[var(--paper)] tracking-wide">
                          {item.title}
                        </strong>
                        <span className="text-[9px] sm:text-[10px] font-mono text-[#899791] mt-0.5 block truncate">
                          {item.sub}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upgraded Dual Paths (A & B) */}
      <section className="section-pad py-16" data-reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Path A - Medicine */}
          <CardSpotlight
            spotlightColor="rgba(232, 135, 118, 0.28)"
            tabIndex={0}
            className="p-6 sm:p-10 border-2 border-[#2b181a] hover:border-[var(--coral)]/80 active:border-[var(--coral)] active:scale-[0.98] transition-all duration-300 rounded-3xl bg-gradient-to-br from-[#12080a] via-[#091114] to-[#04090b] relative overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.5)] cursor-pointer touch-manipulation"
          >
            <div className="flex items-center justify-between pb-6 border-b border-[#2b181a]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-[var(--coral)]/15 border border-[var(--coral)]/40 flex items-center justify-center font-mono font-bold text-[var(--coral)] shrink-0">
                  A
                </span>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[var(--coral)] uppercase block">
                    DESTINATION · MEDICINE
                  </span>
                  <span className="text-xs font-mono text-[#899791]">Cardiology &amp; Surgical Care</span>
                </div>
              </div>
              <HeartPulse className="w-8 h-8 text-[var(--coral)] group-hover:scale-110 group-active:scale-110 transition-transform animate-pulse shrink-0" />
            </div>

            <div className="py-6 sm:py-8">
              <h3 className="font-['Syne'] text-2xl sm:text-4xl font-extrabold text-[var(--paper)] group-hover:text-[var(--coral)] transition-colors">
                Heal hearts.
              </h3>
              <p className="mt-3 sm:mt-4 text-[#b6c0bc] text-sm sm:text-base leading-relaxed">
                My primary dream is to become a cardiologist — understanding the human cardiovascular
                system in exquisite detail and bringing life-saving care with deep clinical empathy.
              </p>
            </div>

            <div className="pt-6 border-t border-[#2b181a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[var(--coral)]">
                <Stethoscope className="w-4 h-4 shrink-0" />
                <span>Medicine · Biology · Human care</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[var(--coral)]/10 text-[var(--coral)] border border-[var(--coral)]/30 text-[10px] tracking-wider uppercase self-start sm:self-auto">
                TARGET: MD CARDIOLOGY
              </span>
            </div>
          </CardSpotlight>

          {/* Path B - Technology */}
          <CardSpotlight
            spotlightColor="rgba(200, 233, 95, 0.28)"
            tabIndex={0}
            className="p-6 sm:p-10 border-2 border-[#1c2e1f] hover:border-[var(--acid)]/80 active:border-[var(--acid)] active:scale-[0.98] transition-all duration-300 rounded-3xl bg-gradient-to-br from-[#08120b] via-[#091114] to-[#04090b] relative overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.5)] cursor-pointer touch-manipulation"
          >
            <div className="flex items-center justify-between pb-6 border-b border-[#1c2e1f]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-[var(--acid)]/15 border border-[var(--acid)]/40 flex items-center justify-center font-mono font-bold text-[var(--acid)] shrink-0">
                  B
                </span>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[var(--acid)] uppercase block">
                    THE TOOLKIT · TECH
                  </span>
                  <span className="text-xs font-mono text-[#899791]">Web Systems &amp; Code</span>
                </div>
              </div>
              <Braces className="w-8 h-8 text-[var(--acid)] group-hover:scale-110 group-active:scale-110 transition-transform shrink-0" />
            </div>

            <div className="py-6 sm:py-8">
              <h3 className="font-['Syne'] text-2xl sm:text-4xl font-extrabold text-[var(--paper)] group-hover:text-[var(--acid)] transition-colors">
                Build ideas.
              </h3>
              <p className="mt-3 sm:mt-4 text-[#b6c0bc] text-sm sm:text-base leading-relaxed">
                Coding gives me a powerful scientific toolkit to build tools, visualize data, and
                solve complex challenges. I’m learning the modern web today, with Python and AI ahead.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1c2e1f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[var(--acid)]">
                <Code2 className="w-4 h-4 shrink-0" />
                <span>HTML (80%) · CSS (5%) · JS (0%)</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[var(--acid)]/10 text-[var(--acid)] border border-[var(--acid)]/30 text-[10px] tracking-wider uppercase self-start sm:self-auto">
                ENGINE: FULLSTACK WEB
              </span>
            </div>
          </CardSpotlight>
        </div>
      </section>

      {/* 02 / LEARNING LOG */}
      <section className="section-pad py-16" id="skills" data-reveal>
        <div className="max-w-6xl mx-auto">
          <div className="section-index text-[#9cc9b7] mb-2">02 / LEARNING LOG</div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="kicker text-[var(--acid)]">Continuous Progress</p>
              <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold">
                My current
                <br />
                <span className="text-[var(--acid)]">learning pulse.</span>
              </h2>
            </div>

            <div className="w-full sm:w-auto">
              <p className="text-sm text-[#899791] max-w-sm mb-4">
                Honest progress, not inflated numbers. Every percentage is a committed step in the
                journey.
              </p>

              <div className="grid grid-cols-2 sm:inline-flex w-full sm:w-auto p-1.5 bg-[#091519] border border-[#1b373f] rounded-2xl shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('code')
                  }}
                  className={`flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-[var(--acid)] text-[#04090b] font-bold shadow-[0_0_20px_rgba(200,233,95,0.4)]'
                      : 'text-[#9cc9b7] hover:text-[var(--paper)]'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Code Track
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('cardiology')
                  }}
                  className={`flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'cardiology'
                      ? 'bg-[var(--coral)] text-white font-bold shadow-[0_0_20px_rgba(232,135,118,0.4)]'
                      : 'text-[#9cc9b7] hover:text-[var(--paper)]'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  Cardiology Track
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'code' ? (
            <div className="p-6 sm:p-8 rounded-3xl border border-[#18363e] bg-[#061014]/90 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#142c33] text-xs font-mono">
                <div className="flex items-center gap-2 text-[var(--acid)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--acid)] animate-ping" />
                  <span>ENVIRONMENT: DEV_WORKSPACE_V2027</span>
                </div>
                <div className="text-[#899791] hidden sm:block">STATUS: LEARNING SPRINTS ACTIVE</div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    name: 'HTML',
                    level: 80,
                    note: 'Strong foundation & semantic structuring',
                    status: 'Active Mastery',
                    color: 'var(--acid)',
                  },
                  {
                    name: 'CSS',
                    level: 5,
                    note: 'Building the visual layout layer & responsiveness',
                    status: 'In Progress',
                    color: 'var(--mint)',
                  },
                  {
                    name: 'JavaScript',
                    level: 0,
                    note: 'Next scheduled track on 2026-27 roadmap',
                    status: 'Queued',
                    color: '#60a5fa',
                  },
                  {
                    name: 'Python + Medical AI',
                    level: 0,
                    note: 'Long-term bioinformatics & health data processing',
                    status: 'Planned',
                    color: 'var(--coral)',
                  },
                ].map((s) => (
                  <div key={s.name} className="p-4 rounded-2xl bg-[#09171c]/70 border border-[#162f36] hover:border-[var(--acid)]/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-['Syne'] text-lg font-bold text-[var(--paper)]">{s.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#23454e] text-[#9cc9b7]">
                          {s.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-[#899791]">{s.note}</span>
                        <span className="font-mono text-base font-bold" style={{ color: s.color }}>
                          {String(s.level).padStart(2, '0')}%
                        </span>
                      </div>
                    </div>

                    <div className="h-3 w-full rounded-full bg-[#040b0e] overflow-hidden p-0.5 border border-[#14282e]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.max(s.level, 2)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full rounded-full shadow-[0_0_12px_rgba(200,233,95,0.5)]"
                        style={{ backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardiologyMilestones.map((m) => (
                <div
                  key={m.step}
                  className="p-6 rounded-3xl bg-[#081318]/90 border border-[#1c323a] hover:border-[var(--coral)] transition-all shadow-xl group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-[var(--coral)] tracking-wider">
                        {m.tag}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-[var(--coral)]/10 text-[var(--coral)] flex items-center justify-center font-mono text-xs font-bold border border-[var(--coral)]/30">
                        {m.step}
                      </span>
                    </div>

                    <h3 className="font-['Syne'] text-xl font-bold text-[var(--paper)] group-hover:text-[var(--coral)] transition-colors">
                      {m.title}
                    </h3>
                    <p className="mt-3 text-[#b6c0bc] text-xs leading-relaxed">{m.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#142830] flex items-center justify-between text-xs font-mono text-[#899791]">
                    <span>Status:</span>
                    <span className="text-[var(--coral)] font-semibold">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 03 / PROJECTS — Expansive Standalone Showcase */}
      <section className="section-pad py-20" id="projects" data-reveal>
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-['Manrope',sans-serif] font-bold tracking-widest text-[#9cc9b7] uppercase mb-2">
                <span className="w-6 h-[1.5px] bg-[var(--acid)]" />
                <span>03 / PROJECTS · LIVE SHOWCASE</span>
              </div>
              <p className="kicker text-[var(--acid)] mb-2">Real Proof of Progress</p>
              <h2 className="font-['Syne'] text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                Things I’ve
                <br />
                <span className="text-[var(--acid)] drop-shadow-[0_0_25px_rgba(200,233,95,0.4)]">
                  made real.
                </span>
              </h2>
            </div>
            <div className="max-w-md">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--acid)]/10 text-[var(--acid)] border border-[var(--acid)]/30 text-xs font-mono font-bold tracking-wider uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-[var(--acid)] animate-pulse" />
                SMART SUBHA · LIVE PROJECTS SHOWCASE
              </span>
              <p className="font-['Manrope',sans-serif] text-sm sm:text-base text-slate-300 leading-relaxed">
                Functional deployments running on the web. No placeholders — built and published one
                line at a time.
              </p>
            </div>
          </div>

          {/* PROJECT 01: Music Mind (Separate & Large) */}
          <motion.div
            tabIndex={0}
            variants={projectCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mb-14 rounded-3xl border-2 border-[#1c373e] hover:border-[var(--acid)] active:border-[var(--acid)] active:scale-[0.99] active:shadow-[0_0_35px_rgba(200,233,95,0.4)] transition-all duration-300 bg-gradient-to-br from-[#09191e]/95 via-[#071318]/95 to-[#040c0f] p-5 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden relative group cursor-pointer touch-manipulation"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--acid)]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--acid)]/15 transition-all duration-500" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: Project Info */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <motion.div variants={projectChildVariants} className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[var(--acid)]/15 text-[var(--acid)] border border-[var(--acid)]/30">
                      PROJECT / 01 · AUDIO WEB APP
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      DEPLOYED
                    </span>
                  </motion.div>

                  <motion.h3 variants={projectChildVariants} className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Music Mind
                  </motion.h3>
                  <motion.p variants={projectChildVariants} className="font-['Syne'] text-xl sm:text-2xl font-bold text-[var(--acid)] mt-2">
                    Beats, in motion.
                  </motion.p>

                  <motion.p variants={projectChildVariants} className="font-['Manrope',sans-serif] text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                    A personal web application built to play beats, experiment with sound and rhythm, and
                    serve as a responsive frontend showcase.
                  </motion.p>

                  <motion.div variants={projectChildVariants} className="flex flex-wrap gap-2 mt-6">
                    {['Audio Beats Engine', 'Interactive UI', 'Responsive Design', 'Vite & Netlify'].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-[11px] sm:text-xs font-mono text-[#9cc9b7] px-2.5 sm:px-3 py-1 rounded-lg bg-[#07171d] border border-[#1b3d45]"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </motion.div>
                </div>

                <motion.div variants={projectChildVariants} className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-[#18363f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9cc9b7]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>LIVE DEPLOYMENT ON NETLIFY</span>
                  </div>

                  <MagneticButton intensity={0.25} className="w-full sm:w-auto">
                    <a
                      href="https://ais-pre-z7meguzgpkxxpuajifaqdn-752094771694.asia-northeast1.run.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3.5 rounded-full bg-[var(--acid)] text-[#04090b] font-['Manrope',sans-serif] text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(200,233,95,0.45)] hover:bg-[#d8f86f] transition-all"
                    >
                      <span>Launch Music Mind</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </MagneticButton>
                </motion.div>
              </div>

              {/* Right Column: Visual Browser Stage */}
              <motion.div variants={projectChildVariants} className="lg:col-span-7">
                <a
                  href="https://ais-pre-z7meguzgpkxxpuajifaqdn-752094771694.asia-northeast1.run.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-[#23454e] bg-[#03090b] shadow-2xl overflow-hidden hover:border-[var(--acid)] transition-all duration-300 group/screen"
                >
                  {/* Browser Bar (Clean URL, no raw hash links) */}
                  <div className="h-10 bg-[#091a20] border-b border-[#1b3840] px-3 sm:px-4 flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <div className="px-2.5 sm:px-3 py-1 rounded-md bg-[#051115] border border-[#1b373e] text-[10px] sm:text-[11px] font-mono text-[#9cc9b7] flex items-center gap-1.5 truncate">
                      <Globe className="w-3 h-3 text-[var(--acid)] shrink-0" />
                      <span className="font-semibold text-white tracking-wide">musicmind.app / interactive-audio</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline-block shrink-0">
                      LIVE · 200 OK
                    </span>
                  </div>

                  {/* Browser Content Stage */}
                  <div className="p-6 sm:p-10 min-h-[220px] sm:min-h-[300px] bg-gradient-to-br from-[#0c232b] via-[#07161b] to-[#040b0e] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Simulated Equalizer Wavebars */}
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1.5 opacity-25 h-20 sm:h-24 px-4 sm:px-8 pointer-events-none">
                      {[40, 65, 85, 30, 95, 70, 50, 100, 80, 45, 90, 60, 75, 35, 85, 55, 95, 40, 65, 80].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="w-1.5 sm:w-2 bg-[var(--acid)] rounded-t-full transition-all duration-500"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>

                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[var(--acid)]/15 border-2 border-[var(--acid)]/50 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(200,233,95,0.3)] group-hover/screen:scale-110 transition-transform duration-300">
                      <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--acid)]" />
                    </div>

                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[var(--acid)] uppercase mb-2">
                      BEATS IN MOTION · SMART SUBHA
                    </span>
                    <h4 className="font-['Syne'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Music Mind
                    </h4>
                    <span className="mt-4 px-3.5 sm:px-4 py-1.5 rounded-full bg-[var(--acid)]/10 text-[var(--acid)] border border-[var(--acid)]/30 font-mono text-[10px] sm:text-xs font-bold tracking-wider inline-flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>CLICK TO LAUNCH LIVE APPLICATION</span>
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* PROJECT 02: My Data Space (Separate & Large) */}
          <motion.div
            tabIndex={0}
            variants={projectCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mb-14 rounded-3xl border-2 border-[#1c373e] hover:border-[var(--mint)] active:border-[var(--mint)] active:scale-[0.99] active:shadow-[0_0_35px_rgba(156,201,183,0.4)] transition-all duration-300 bg-gradient-to-br from-[#09191e]/95 via-[#071318]/95 to-[#040c0f] p-5 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden relative group cursor-pointer touch-manipulation"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--mint)]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--mint)]/15 transition-all duration-500" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: Project Info */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <motion.div variants={projectChildVariants} className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[var(--mint)]/15 text-[var(--mint)] border border-[var(--mint)]/30">
                      PROJECT / 02 · DATA UTILITY
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      DEPLOYED
                    </span>
                  </motion.div>

                  <motion.h3 variants={projectChildVariants} className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    My Data Space
                  </motion.h3>
                  <motion.p variants={projectChildVariants} className="font-['Syne'] text-xl sm:text-2xl font-bold text-[var(--mint)] mt-2">
                    Data, kept close.
                  </motion.p>

                  <motion.p variants={projectChildVariants} className="font-['Manrope',sans-serif] text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                    A personal web space crafted to securely store important information and keep vital
                    resources within instant reach.
                  </motion.p>

                  <motion.div variants={projectChildVariants} className="flex flex-wrap gap-2 mt-6">
                    {['Encrypted Storage', 'Quick Retrieval', 'Minimalist UI', 'Cloud Deployed'].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-[11px] sm:text-xs font-mono text-[#9cc9b7] px-2.5 sm:px-3 py-1 rounded-lg bg-[#07171d] border border-[#1b3d45]"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </motion.div>
                </div>

                <motion.div variants={projectChildVariants} className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-[#18363f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9cc9b7]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>SECURE PERSONAL REPOSITORY</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <MagneticButton intensity={0.25} className="w-full sm:w-auto">
                      <a
                        href="https://dataofsmartsubha.netlify.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3.5 rounded-full bg-[var(--mint)] text-[#04090b] font-['Manrope',sans-serif] text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(156,201,183,0.45)] hover:bg-[#b5e3d1] transition-all"
                      >
                        <span>Open My Data Space</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </MagneticButton>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Visual Browser Stage */}
              <motion.div variants={projectChildVariants} className="lg:col-span-7">
                <a
                  href="https://dataofsmartsubha.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-[#23454e] bg-[#03090b] shadow-2xl overflow-hidden hover:border-[var(--mint)] transition-all duration-300 group/screen"
                >
                  {/* Browser Bar (Clean URL, no raw hash links) */}
                  <div className="h-10 bg-[#091a20] border-b border-[#1b3840] px-3 sm:px-4 flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <div className="px-2.5 sm:px-3 py-1 rounded-md bg-[#051115] border border-[#1b373e] text-[10px] sm:text-[11px] font-mono text-[#9cc9b7] flex items-center gap-1.5 truncate">
                      <Globe className="w-3 h-3 text-[var(--mint)] shrink-0" />
                      <span className="font-semibold text-white tracking-wide">mydataspace.vault / secure-cloud</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline-block shrink-0">
                      LIVE · 200 OK
                    </span>
                  </div>

                  {/* Browser Content Stage */}
                  <div className="p-6 sm:p-10 min-h-[220px] sm:min-h-[300px] bg-gradient-to-br from-[#1b1c2b] via-[#0d161f] to-[#040b0e] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Simulated Data Grid Background */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#9cc9b7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[var(--mint)]/15 border-2 border-[var(--mint)]/50 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(156,201,183,0.3)] group-hover/screen:scale-110 transition-transform duration-300">
                      <Laptop className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--mint)]" />
                    </div>

                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[var(--mint)] uppercase mb-2">
                      DATA KEPT CLOSE · PERSONAL REPOSITORY
                    </span>
                    <h4 className="font-['Syne'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      My Data Space
                    </h4>
                    <span className="mt-4 px-3.5 sm:px-4 py-1.5 rounded-full bg-[var(--mint)]/10 text-[var(--mint)] border border-[var(--mint)]/30 font-mono text-[10px] sm:text-xs font-bold tracking-wider inline-flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>CLICK TO LAUNCH SECURE VAULT</span>
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* PROJECT 03: Devipaksha-Sharodiya */}
          <motion.div
            tabIndex={0}
            variants={projectCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mb-14 rounded-3xl border-2 border-[#1c373e] hover:border-[var(--coral)] active:border-[var(--coral)] active:scale-[0.99] active:shadow-[0_0_35px_rgba(232,135,118,0.4)] transition-all duration-300 bg-gradient-to-br from-[#191116]/95 via-[#071318]/95 to-[#040c0f] p-5 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden relative group cursor-pointer touch-manipulation"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--coral)]/12 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--coral)]/18 transition-all duration-500" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: App Info */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <motion.div variants={projectChildVariants} className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[var(--coral)]/15 text-[var(--coral)] border border-[var(--coral)]/30">
                      PROJECT / 03 · PUJA WEB APP
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      DEPLOYED
                    </span>
                  </motion.div>

                  <motion.h3 variants={projectChildVariants} className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Devipaksha-Sharodiya
                  </motion.h3>
                  <motion.p variants={projectChildVariants} className="font-['Syne'] text-lg sm:text-xl font-bold text-[var(--coral)] mt-2">
                    Inspired by Devipaksha and Sharodiya
                  </motion.p>
                  <motion.p variants={projectChildVariants} className="text-xs font-mono tracking-wider uppercase text-amber-300/90 mt-1">
                    Curated by Smart Subha ®
                  </motion.p>

                  <motion.p variants={projectChildVariants} className="font-['Manrope',sans-serif] text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                    A dedicated Durga Puja guidance &amp; pandal-hopping companion app featuring interactive
                    Pandal Locator + Add support, creative Puja Canvas, and real-time OAuth cloud sync.
                  </motion.p>

                  <motion.div variants={projectChildVariants} className="flex flex-wrap gap-2 mt-6">
                    {[
                      'Pandal Locator + Add',
                      'Puja Canvas',
                      'Real Time Sync via oAuth',
                      'Durga Puja Guidance',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] sm:text-xs font-mono text-[#f4c0b6] px-2.5 sm:px-3 py-1 rounded-lg bg-[#180d12] border border-[#3f2329]"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </div>

                <motion.div variants={projectChildVariants} className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-[#18363f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#f4c0b6]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>LIVE DEPLOYMENT · PUJA COMPANION</span>
                  </div>

                  <MagneticButton intensity={0.25} className="w-full sm:w-auto">
                    <a
                      href={DEVIPAKSHA_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3.5 rounded-full bg-[var(--coral)] text-[#04090b] font-['Manrope',sans-serif] text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(232,135,118,0.45)] hover:bg-[#f29f90] transition-all"
                    >
                      <span>Launch App</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </MagneticButton>
                </motion.div>
              </div>

              {/* Right Column: Visual Browser Stage */}
              <motion.div variants={projectChildVariants} className="lg:col-span-7">
                <a
                  href={DEVIPAKSHA_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-[#3a2429] bg-[#03090b] shadow-2xl overflow-hidden hover:border-[var(--coral)] transition-all duration-300 group/screen"
                >
                  {/* Browser Bar (Clean URL, no raw deploy URL shown) */}
                  <div className="h-10 bg-[#140d11] border-b border-[#2e1b20] px-3 sm:px-4 flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <div className="px-2.5 sm:px-3 py-1 rounded-md bg-[#090608] border border-[#341f24] text-[10px] sm:text-[11px] font-mono text-[#f4c0b6] flex items-center gap-1.5 truncate">
                      <Globe className="w-3 h-3 text-[var(--coral)] shrink-0" />
                      <span className="font-semibold text-white tracking-wide">devipaksha-sharodiya.app / puja-guide</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline-block shrink-0">
                      LIVE · 200 OK
                    </span>
                  </div>

                  {/* App Visual Stage */}
                  <div className="p-6 sm:p-10 min-h-[220px] sm:min-h-[300px] bg-gradient-to-br from-[#2a1219] via-[#120d14] to-[#040b0e] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Festive Radial Pattern */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e88776_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[var(--coral)]/15 border-2 border-[var(--coral)]/50 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(232,135,118,0.3)] group-hover/screen:scale-110 transition-transform duration-300">
                      <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--coral)]" />
                    </div>

                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[var(--coral)] uppercase mb-2">
                      CURATED BY SMART SUBHA ® · PANDAL GUIDE
                    </span>
                    <h4 className="font-['Syne'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Devipaksha-Sharodiya
                    </h4>
                    <span className="mt-4 px-3.5 sm:px-4 py-1.5 rounded-full bg-[var(--coral)]/15 text-[var(--coral)] border border-[var(--coral)]/35 font-mono text-[10px] sm:text-xs font-bold tracking-wider inline-flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>CLICK TO LAUNCH LIVE APPLICATION</span>
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* PROJECT 04: PC Tool Website */}
          <motion.div
            tabIndex={0}
            variants={projectCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="rounded-3xl border-2 border-[#1c373e] hover:border-indigo-400 active:border-indigo-400 active:scale-[0.99] active:shadow-[0_0_35px_rgba(129,140,248,0.4)] transition-all duration-300 bg-gradient-to-br from-[#101326]/95 via-[#071318]/95 to-[#040c0f] p-5 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden relative group cursor-pointer touch-manipulation"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/12 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/18 transition-all duration-500" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: Project Info */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <motion.div variants={projectChildVariants} className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-400/30">
                      PROJECT / 04 · UTILITY SUITE
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      DEPLOYED
                    </span>
                  </motion.div>

                  <motion.h3 variants={projectChildVariants} className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    PC Tool
                  </motion.h3>
                  <motion.p variants={projectChildVariants} className="font-['Syne'] text-lg sm:text-xl font-bold text-indigo-300 mt-2">
                    Free online image &amp; PDF tools.
                  </motion.p>

                  <motion.p variants={projectChildVariants} className="font-['Manrope',sans-serif] text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                    A fast browser-based toolkit crafted by SMART SUBHA for editing images, PDFs, ID cards,
                    government documents, and event cards — running securely right inside your browser.
                  </motion.p>

                  <motion.div variants={projectChildVariants} className="flex flex-wrap gap-2 mt-6">
                    {[
                      'Image & PDF Tools',
                      'ID & Gov Docs',
                      'Event Cards',
                      'In-Browser Privacy',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] sm:text-xs font-mono text-indigo-200 px-2.5 sm:px-3 py-1 rounded-lg bg-[#0d1224] border border-[#273157]"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </div>

                <motion.div variants={projectChildVariants} className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-[#18363f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>LIVE UTILITY · IN-BROWSER SUITE</span>
                  </div>

                  <MagneticButton intensity={0.25} className="w-full sm:w-auto">
                    <a
                      href={PC_TOOL_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3.5 rounded-full bg-indigo-400 text-[#04090b] font-['Manrope',sans-serif] text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(129,140,248,0.45)] hover:bg-indigo-300 transition-all"
                    >
                      <span>Open PC Tool</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </MagneticButton>
                </motion.div>
              </div>

              {/* Right Column: Visual Browser Stage */}
              <motion.div variants={projectChildVariants} className="lg:col-span-7">
                <a
                  href={PC_TOOL_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-[#2a3352] bg-[#03090b] shadow-2xl overflow-hidden hover:border-indigo-400 transition-all duration-300 group/screen"
                >
                  {/* Browser Bar */}
                  <div className="h-10 bg-[#0d1121] border-b border-[#222a47] px-3 sm:px-4 flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <div className="px-2.5 sm:px-3 py-1 rounded-md bg-[#060913] border border-[#252e4d] text-[10px] sm:text-[11px] font-mono text-indigo-200 flex items-center gap-1.5 truncate">
                      <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span className="font-semibold text-white tracking-wide">pc-tool.workspace / image-pdf-suite</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline-block shrink-0">
                      LIVE · 200 OK
                    </span>
                  </div>

                  {/* Browser Content Stage */}
                  <div className="p-6 sm:p-10 min-h-[220px] sm:min-h-[300px] bg-gradient-to-br from-[#161b36] via-[#0b1224] to-[#040b0e] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Subtle Tech Grid Background */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-500/15 border-2 border-indigo-400/50 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(129,140,248,0.3)] group-hover/screen:scale-110 transition-transform duration-300">
                      <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400" />
                    </div>

                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-indigo-300 uppercase mb-2">
                      IMAGE, PDF &amp; DOCUMENT SUITE · SMART SUBHA
                    </span>
                    <h4 className="font-['Syne'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      PC Tool Website
                    </h4>
                    <span className="mt-4 px-3.5 sm:px-4 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/35 font-mono text-[10px] sm:text-xs font-bold tracking-wider inline-flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>CLICK TO LAUNCH PC TOOL SUITE</span>
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Future Roadmap Section (2026 → 2035+) */}
      <VisionRoadmap />

      {/* 04 / MY COMPONENTS */}
      <section className="components section-pad py-16" data-reveal>
        <div>
          <div className="section-index text-[#9cc9b7]">04 / MY COMPONENTS</div>
          <h2 className="font-['Syne']">
            The everyday
            <br />
            setup behind
            <br />
            <span className="text-[var(--acid)]">the dream.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#899791] mt-3">
            Simple tools. Serious curiosity. This is where learning, testing and creating happens.
          </p>
        </div>

        <div className="component-stack">
          {[
            ['01', 'Galaxy Book 4', 'Primary learning & research station', Laptop],
            ['02', 'Redmi 9 Power', 'Mobile testing & ideas on the go', Phone],
            ['03', 'Curious mind', 'The most important component driving every line of code', Sparkles],
          ].map(([n, t, d, I]) => {
            const Icon = I as typeof Laptop
            return (
              <GlareCard key={t as string} className="w-full">
                <div className="device-card p-6 flex items-start gap-4">
                  <span className="font-mono text-sm text-[var(--acid)]">{n as string}</span>
                  <Icon className="w-8 h-8 text-[var(--acid)] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-['Syne'] text-lg font-bold text-[var(--paper)]">{t as string}</h3>
                    <p className="text-sm text-[#b6c0bc] mt-1">{d as string}</p>
                  </div>
                </div>
              </GlareCard>
            )
          })}
        </div>
      </section>

      {/* 05 / GET IN TOUCH + One-Click Digital vCard */}
      <section className="contact section-pad py-16" id="contact" data-reveal>
        <div className="contact-copy">
          <div className="section-index text-[#9cc9b7]">05 / GET IN TOUCH</div>
          <p className="kicker text-[var(--acid)]">Always open to learning</p>
          <h2 className="font-['Syne']">
            Let’s start a
            <br />
            <span className="text-[var(--acid)]">conversation.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#b6c0bc]">
            Have feedback, an idea, or just want to say hello? My inbox is open.
          </p>

          <div className="direct-links space-y-3 mt-6">
            <a href="mailto:iamsubha4200@gmail.com" className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[var(--acid)]" />
              iamsubha4200@gmail.com
            </a>
            <a href="tel:+918670225411" className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[var(--acid)]" />
              +91 86702 25411
            </a>
            <a
              href="https://maps.app.goo.gl/aXEcZQx5nRLLR6yo6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <MapPin className="w-5 h-5 text-[var(--acid)]" />
              Find me on the map
            </a>
          </div>

          {/* One-click Digital vCard & QR Code */}
          <div className="mt-8">
            <VcardQrCard />
          </div>
        </div>

        <CardSpotlight
          spotlightColor="rgba(200, 233, 95, 0.2)"
          className="contact-panel p-5 sm:p-8 border-2 border-[#1c373e] shadow-2xl rounded-3xl bg-[#071318]"
        >
          {formState === 'sent' ? (
            <div className="success-state py-8 text-center">
              <span className="w-14 h-14 mx-auto rounded-full bg-[var(--acid)]/20 text-[var(--acid)] flex items-center justify-center mb-4">
                <Check className="w-7 h-7" />
              </span>
              <h3 className="text-2xl font-bold font-['Syne'] text-[var(--paper)]">Message received.</h3>
              <p className="text-[#b6c0bc] mt-2 mb-6 text-sm">Thanks for reaching out. I’ll get back to you as soon as I can.</p>
              <button
                type="button"
                onClick={() => setFormState('idle')}
                className="px-6 py-2.5 rounded-full bg-[var(--acid)] text-[var(--ink)] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={submitForm}
              className="space-y-4"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p hidden>
                <label>
                  Do not fill
                  <input name="bot-field" />
                </label>
              </p>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9cc9b7]">
                Your name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="What should I call you?"
                  className="mt-1 w-full bg-[#0a181c] border border-[#1b363e] rounded-lg p-3 text-[var(--paper)] focus:border-[var(--acid)] outline-none text-sm"
                />
              </label>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9cc9b7]">
                Your email
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full bg-[#0a181c] border border-[#1b363e] rounded-lg p-3 text-[var(--paper)] focus:border-[var(--acid)] outline-none text-sm"
                />
              </label>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9cc9b7]">
                Your message
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Write your message here..."
                  className="mt-1 w-full bg-[#0a181c] border border-[#1b363e] rounded-lg p-3 text-[var(--paper)] focus:border-[var(--acid)] outline-none resize-none text-sm"
                />
              </label>
              {formState === 'error' && (
                <p className="form-error text-xs text-[var(--coral)]" role="alert">
                  That didn’t send. Please try again or email me directly.
                </p>
              )}
              <MagneticButton intensity={0.25} className="w-full">
                <button
                  type="submit"
                  className="submit-button w-full flex items-center justify-center gap-2 py-3.5 rounded-full dev-btn-primary font-mono font-bold tracking-wider uppercase cursor-pointer"
                  disabled={formState === 'sending'}
                >
                  {formState === 'sending' ? 'Sending...' : 'Send message'}
                  <Send className="w-4 h-4" />
                </button>
              </MagneticButton>
            </form>
          )}
        </CardSpotlight>
      </section>

      {/* Real-time Animated SVG Heartbeat Monitor in the Footer */}
      <RealtimeEcgMonitor />

      {/* Hyper-Attractive Interactive Social Links Showcase */}
      <section className="py-14 sm:py-20 px-4 sm:px-10 border-t border-b border-[#142e36] bg-[#050f13]/70 relative overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-['Manrope',sans-serif] font-bold tracking-widest text-[#9cc9b7] uppercase mb-2">
                <span className="w-6 h-[1.5px] bg-[var(--acid)]" />
                <span>DIRECT CHANNELS &amp; SOCIAL HUBS</span>
              </div>
              <h2 className="font-['Manrope',sans-serif] font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                Connect with Subhajit directly
              </h2>
            </div>
            <p className="font-['Manrope',sans-serif] text-sm text-slate-300 max-w-sm leading-relaxed">
              Tap any verified channel below to start a conversation, follow my journey, or initiate an instant WhatsApp message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Instagram Card */}
            <a
              href="https://www.instagram.com/smartxsubha?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#110e1a]/90 to-[#070b10]/95 border border-pink-500/25 hover:border-pink-500/60 active:border-pink-500/80 active:scale-[0.97] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_-10px_rgba(225,48,108,0.35)] flex flex-col justify-between overflow-hidden cursor-pointer touch-manipulation"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-pink-500/15 via-rose-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(225,48,108,0.4)] group-hover:scale-110 group-active:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-['Manrope',sans-serif] font-bold tracking-wider uppercase bg-pink-500/15 text-pink-300 border border-pink-500/30">
                    FEED &amp; STORIES
                  </span>
                </div>

                <div className="font-['Manrope',sans-serif] text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Instagram
                </div>
                <h3 className="font-['Manrope',sans-serif] font-bold text-xl sm:text-2xl text-white group-hover:text-pink-300 transition-colors tracking-tight">
                  @SMARTXSUBHA
                </h3>
                <p className="font-['Manrope',sans-serif] text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Catch daily study milestones, beat production clips, and send direct Instagram messages.
                </p>
              </div>

              <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[#1b2b30] flex items-center justify-between text-xs font-['Manrope',sans-serif] font-bold text-pink-400 group-hover:text-pink-300">
                <span className="tracking-wider uppercase">Open Profile</span>
                <div className="w-8 h-8 rounded-full bg-pink-500/15 flex items-center justify-center text-pink-300 group-hover:bg-pink-500 group-hover:text-white transition-all group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </a>

            {/* Facebook Card */}
            <a
              href="https://www.facebook.com/crazyxsubha"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0a1424]/90 to-[#070b10]/95 border border-blue-500/25 hover:border-blue-500/60 active:border-blue-500/80 active:scale-[0.97] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_-10px_rgba(24,119,242,0.35)] flex flex-col justify-between overflow-hidden cursor-pointer touch-manipulation"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-500/15 via-sky-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(24,119,242,0.4)] group-hover:scale-110 group-active:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <Facebook className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-['Manrope',sans-serif] font-bold tracking-wider uppercase bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    COMMUNITY
                  </span>
                </div>

                <div className="font-['Manrope',sans-serif] text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Facebook Profile
                </div>
                <h3 className="font-['Manrope',sans-serif] font-bold text-xl sm:text-2xl text-white group-hover:text-blue-300 transition-colors tracking-tight">
                  SUBHAJIT SANPUI
                </h3>
                <p className="font-['Manrope',sans-serif] text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Personal network, academic updates, and long-form posts on medicine and technology.
                </p>
              </div>

              <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[#1b2b30] flex items-center justify-between text-xs font-['Manrope',sans-serif] font-bold text-blue-400 group-hover:text-blue-300">
                <span className="tracking-wider uppercase">Connect Now</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-300 group-hover:bg-[#1877F2] group-hover:text-white transition-all group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </a>

            {/* WhatsApp Direct Chat Card */}
            <a
              href="https://wa.me/8670225411"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0a1e17]/90 to-[#070b10]/95 border border-emerald-500/30 hover:border-emerald-500/70 active:border-emerald-500/90 active:scale-[0.97] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_-10px_rgba(37,211,102,0.4)] flex flex-col justify-between overflow-hidden cursor-pointer touch-manipulation"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/20 via-teal-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(37,211,102,0.45)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-['Manrope',sans-serif] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DIRECT CHAT</span>
                  </div>
                </div>

                <div className="font-['Manrope',sans-serif] text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  WhatsApp Quick Message
                </div>
                <h3 className="font-['Manrope',sans-serif] font-bold text-xl sm:text-2xl text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                  +91 86702 25411
                </h3>
                <p className="font-['Manrope',sans-serif] text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Fastest way to get in touch. Click to open WhatsApp directly on your phone or desktop.
                </p>
              </div>

              <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[#1b2b30] flex items-center justify-between text-xs font-['Manrope',sans-serif] font-bold text-emerald-400 group-hover:text-emerald-300">
                <span className="tracking-wider uppercase">Send WhatsApp Ping</span>
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-300 group-hover:bg-[#25D366] group-hover:text-[#052e16] transition-all group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-28">
        <a className="brand flex items-center gap-2.5 sm:gap-3" href="#top">
          <span className="brand-mark w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden p-[1.5px] border border-[var(--acid)] shadow-[0_0_15px_rgba(200,233,95,0.4)] inline-flex items-center justify-center bg-[#07161b]">
            <img src={APP_LOGO} alt="Smart Subha Emblem" className="w-full h-full object-cover rounded-full" />
          </span>
          <span>
            SMART SUBHA
            <small>dream · learn · build</small>
          </span>
        </a>
        <p>
          Designed around a big dream.
          <br />
          Built one line at a time.
        </p>
        <a
          href="#top"
          className="font-mono text-xs uppercase tracking-widest text-[#9cc9b7] hover:text-[var(--acid)]"
        >
          Back to top ↑
        </a>
      </footer>

      {/* Floating Dock fixed at bottom for sleek navigation on all devices (mobile + desktop) */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[98vw] flex justify-center pointer-events-auto">
        <FloatingDock items={dockItems} />
      </div>

      {/* Official Curriculum Vitae Viewer & PDF Download Modal */}
      <CvModal isOpen={isCvModalOpen} onClose={() => setIsCvModalOpen(false)} />

    </main>
  )
}
