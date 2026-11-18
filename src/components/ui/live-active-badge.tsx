import React, { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

const STORAGE_PRESENCE_KEY = 'smartsubha_live_presence_sessions'
const SESSION_TIMEOUT_MS = 6000

export function LiveActiveBadge() {
  const [activeUsers, setActiveUsers] = useState<number>(1)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Unique ID for this browser tab session
    const tabId = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    // Broadcast channel for instantaneous cross-tab communication
    let channel: BroadcastChannel | null = null
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('smartsubha_presence_channel')
      }
    } catch {
      // Fallback if BroadcastChannel is restricted
    }

    const cleanAndCountSessions = (): number => {
      try {
        const raw = localStorage.getItem(STORAGE_PRESENCE_KEY)
        const now = Date.now()
        let sessions: Record<string, number> = {}

        if (raw) {
          try {
            sessions = JSON.parse(raw)
          } catch {
            sessions = {}
          }
        }

        // Keep only active sessions updated within SESSION_TIMEOUT_MS
        const active: Record<string, number> = {}
        for (const [id, ts] of Object.entries(sessions)) {
          if (now - ts < SESSION_TIMEOUT_MS) {
            active[id] = ts
          }
        }

        // Register/refresh current tab heartbeat
        active[tabId] = now
        localStorage.setItem(STORAGE_PRESENCE_KEY, JSON.stringify(active))

        const count = Object.keys(active).length
        return Math.max(1, count)
      } catch {
        return 1
      }
    }

    // Initial count
    const initialCount = cleanAndCountSessions()
    setActiveUsers(initialCount)

    // Notify other tabs
    channel?.postMessage({ type: 'join', tabId })

    // Heartbeat every 2.5 seconds to maintain active presence
    const heartbeatInterval = setInterval(() => {
      const count = cleanAndCountSessions()
      setActiveUsers(count)
      channel?.postMessage({ type: 'heartbeat', tabId, count })
    }, 2500)

    // Listen to messages from other tabs
    const handleChannelMessage = (event: MessageEvent) => {
      if (event.data?.type === 'join' || event.data?.type === 'leave') {
        const count = cleanAndCountSessions()
        setActiveUsers(count)
      } else if (typeof event.data?.count === 'number') {
        setActiveUsers(Math.max(1, event.data.count))
      }
    }

    channel?.addEventListener('message', handleChannelMessage)

    // Listen to storage events from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_PRESENCE_KEY) {
        const count = cleanAndCountSessions()
        setActiveUsers(count)
      }
    }
    window.addEventListener('storage', handleStorage)

    // Cleanup on tab close/unload
    const handleUnload = () => {
      try {
        const raw = localStorage.getItem(STORAGE_PRESENCE_KEY)
        if (raw) {
          const sessions = JSON.parse(raw)
          delete sessions[tabId]
          localStorage.setItem(STORAGE_PRESENCE_KEY, JSON.stringify(sessions))
        }
        channel?.postMessage({ type: 'leave', tabId })
      } catch {
        // ignore
      }
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearInterval(heartbeatInterval)
      channel?.removeEventListener('message', handleChannelMessage)
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('beforeunload', handleUnload)
      handleUnload()
      channel?.close()
    }
  }, [])

  return (
    <div
      className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#07171d]/90 border border-[#1b3d45] shadow-[0_0_12px_rgba(34,197,94,0.15)] text-[10px] sm:text-[11px] font-mono select-none shrink-0"
      title="Real active visitors currently on this portfolio"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
      </span>
      <span className="text-emerald-400 font-semibold tracking-wide whitespace-nowrap">
        {activeUsers} <span className="hidden xs:inline">online now</span><span className="xs:hidden">live</span>
      </span>
      <Users className="w-3 h-3 text-[#9cc9b7]/60 ml-0.5 hidden sm:inline-block" />
    </div>
  )
}
