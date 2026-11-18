import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { playHeartbeatSound, playClickSound } from '@/lib/audio'

export function SoundToggle({
  soundEnabled,
  setSoundEnabled,
}: {
  soundEnabled: boolean
  setSoundEnabled: (val: boolean) => void
}) {
  const toggle = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    if (next) {
      playHeartbeatSound()
    } else {
      playClickSound()
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer font-mono text-xs ${
        soundEnabled
          ? 'bg-[var(--coral)]/15 border-[var(--coral)]/50 text-[var(--coral)] shadow-[0_0_15px_rgba(232,135,118,0.3)]'
          : 'bg-[#071318]/60 border-[#1c373e] text-[#899791] hover:text-[#dfe6df]'
      }`}
      title={soundEnabled ? 'Mute Heartbeat & UI SFX' : 'Enable Heartbeat & UI SFX'}
      aria-label="Toggle Sound Effects"
    >
      {soundEnabled ? (
        <>
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline tracking-wider">SOUND ON</span>
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--coral)] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--coral)]" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span className="hidden sm:inline tracking-wider">SFX OFF</span>
        </>
      )}
    </button>
  )
}
