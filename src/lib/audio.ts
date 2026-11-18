/**
 * Web Audio API Synthesizer for Heartbeat (Lub-Dub) and Tech Sound FX
 * Zero external audio files, instant response, offline-capable.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Natural cardiac Lub-Dub sound
 */
export function playHeartbeatSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // First sound: "Lub" (S1 - closure of mitral/tricuspid valves)
    playTone(ctx, now, 68, 48, 0.16, 0.35)

    // Second sound: "Dub" (S2 - closure of aortic/pulmonary valves, slightly higher pitch, shorter)
    playTone(ctx, now + 0.14, 82, 54, 0.12, 0.3)
  } catch (err) {
    // Audio context prevented by autoplay policy
  }
}

function playTone(
  ctx: AudioContext,
  startTime: number,
  startFreq: number,
  endFreq: number,
  duration: number,
  gainLevel: number
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(startFreq, startTime)
  osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration)

  gain.gain.setValueAtTime(gainLevel, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration)
}

/**
 * Subtle sci-fi UI click sound
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  } catch {
    // Graceful ignore
  }
}
