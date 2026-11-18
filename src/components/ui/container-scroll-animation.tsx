import React, { useRef } from 'react'
import { useScroll, useTransform, motion } from 'motion/react'
import { cn } from '@/lib/utils'

export const ContainerScroll = ({
  titleComponent,
  children,
  className,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
  className?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const scaleDimensions = () => {
    return isMobile ? [0.85, 0.95] : [1.02, 1]
  }

  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [22, 0, -5])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -60])

  return (
    <div
      className={cn('relative flex items-center justify-center py-10 sm:py-20', className)}
      ref={containerRef}
    >
      <div
        className="w-full relative"
        style={{
          perspective: '1200px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  )
}

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center px-4"
    >
      {titleComponent}
    </motion.div>
  )
}

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: any
  scale: any
  translate: any
  children: React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className="max-w-5xl -mt-8 sm:-mt-12 mx-auto w-full border-4 border-[#18343b] p-2 sm:p-5 bg-[#071318]/95 backdrop-blur-2xl rounded-[30px] shadow-2xl relative"
    >
      <div className="bg-[#050e12] rounded-[24px] overflow-hidden border border-[var(--line)]">
        {/* Sleek Browser/IDE Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a1b20] border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-[#9cc9b7]/80 uppercase">
            SMART SUBHA · LIVE PROJECTS SHOWCASE
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--acid)]">
            <span className="w-2 h-2 rounded-full bg-[var(--acid)] animate-ping inline-block" />
            <span>DEPLOYED</span>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
