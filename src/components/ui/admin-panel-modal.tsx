import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheck,
  Lock,
  KeyRound,
  X,
  Mail,
  Trash2,
  Clock,
  User,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Terminal,
} from 'lucide-react'

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  isRead?: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  isRead?: boolean
}

const STORAGE_KEY = 'smartsubha_contact_messages'

export function getStoredMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    // Filter out any leftover seed messages if present
    if (Array.isArray(parsed)) {
      return parsed.filter((m) => m && !m.id?.startsWith('msg-seed-'))
    }
    return []
  } catch {
    return []
  }
}

export function saveContactMessage(msg: { name: string; email: string; message: string }) {
  try {
    const current = getStoredMessages()
    const now = new Date()
    const formatted = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const newEntry: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: msg.name.trim() || 'Anonymous Visitor',
      email: msg.email.trim() || 'no-email@provided.com',
      message: msg.message.trim(),
      timestamp: formatted,
      isRead: false,
    }

    const updated = [newEntry, ...current]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return true
  } catch (err) {
    console.error('Failed to save message:', err)
    return false
  }
}

export function AdminPanelModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  // Load messages whenever opened
  useEffect(() => {
    if (isOpen) {
      setMessages(getStoredMessages())
    }
  }, [isOpen])

  // Support ESC key to close modal effortlessly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Target password: SUBHA ADMIN 420 (case insensitive & trimmed)
    const normalized = passwordInput.trim().toUpperCase()
    if (normalized === 'SUBHA ADMIN 420') {
      setIsAuthenticated(true)
      setErrorMessage('')
      setPasswordInput('')
      setMessages(getStoredMessages())
    } else {
      setErrorMessage('Access Denied: Incorrect authorization key')
    }
  }

  const handleDelete = (id: string) => {
    const updated = messages.filter((m) => m.id !== id)
    setMessages(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const handleToggleRead = (id: string) => {
    const updated = messages.map((m) =>
      m.id === id ? { ...m, isRead: !m.isRead } : m
    )
    setMessages(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasswordInput('')
    setErrorMessage('')
    setIsOpen(false)
  }

  const unreadCount = messages.filter((m) => !m.isRead).length
  const displayedMessages =
    activeTab === 'unread' ? messages.filter((m) => !m.isRead) : messages

  return (
    <>
      {/* Discrete subtle key button in the navigation bar */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex w-9 h-9 rounded-xl bg-[#07171d]/80 border border-[#1b3d45] hover:border-[var(--acid)] text-[#899791] hover:text-[var(--acid)] transition-all items-center justify-center group shadow-md"
        title="Command Console"
        aria-label="Secret Admin Console"
      >
        <span className="font-mono text-xs font-bold opacity-75 group-hover:opacity-100 transition-opacity">
          ⌘
        </span>
      </button>

      {/* Modal Backdrop with outside click dismissal */}
      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-[#061217] border border-[#183a44] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] cursor-default"
            >
              {/* Modal Topbar */}
              <div className="px-6 py-4 bg-[#0a1a20] border-b border-[#183a44] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--acid)]/15 border border-[var(--acid)]/30 flex items-center justify-center text-[var(--acid)]">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-[var(--paper)] tracking-wider">
                      SUBHA ADMIN // COMMAND CONSOLE
                    </h3>
                    <p className="text-[10px] font-mono text-[#899791]">
                      {isAuthenticated
                        ? 'AUTHENTICATED SESSION · ACCESS GRANTED'
                        : 'PROTECTED SECURE ENCLAVE · SUBHA ONLY'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Lock & Exit Console"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Lock & Exit</span>
                    </button>
                  )}
                  {/* High visibility Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#0e242c] hover:bg-rose-500/20 border border-[#1d424e] hover:border-rose-500/40 text-[#9cc9b7] hover:text-rose-400 flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer"
                    aria-label="Close Admin Panel"
                    title="Close (Esc)"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close (Esc)</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              {!isAuthenticated ? (
                /* Password Entry Form */
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                    <Lock className="w-8 h-8" />
                  </div>

                  <h4 className="font-['Syne'] text-xl font-bold text-[var(--paper)] mb-2">
                    Subha Authorization Required
                  </h4>
                  <p className="text-xs text-[#899791] max-w-sm font-mono mb-6 leading-relaxed">
                    Enter your secret admin passkey to inspect incoming portfolio messages and telemetry.
                  </p>

                  <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value)
                          if (errorMessage) setErrorMessage('')
                        }}
                        placeholder="Enter master password..."
                        autoFocus
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#09181f] border border-[#1b3d48] text-sm text-[var(--paper)] placeholder:text-[#526a72] focus:border-[var(--acid)] focus:outline-none font-mono"
                      />
                      <KeyRound className="w-4 h-4 text-[#899791] absolute left-3.5 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-[#899791] hover:text-[var(--paper)] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {errorMessage && (
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-mono justify-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[var(--acid)] text-[#020a0d] font-bold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-[0_0_20px_rgba(200,233,95,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authenticate Session</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 rounded-xl bg-transparent border border-[#1a3842] text-[#899791] hover:text-[var(--paper)] hover:border-[#2d5966] text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel & Close</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Authenticated Messages Inbox */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Subnav & Metrics Bar */}
                  <div className="px-6 py-3 bg-[#08151a] border-b border-[#142e36] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          activeTab === 'all'
                            ? 'bg-[var(--acid)] text-[#020a0d] font-bold'
                            : 'text-[#899791] hover:text-[var(--paper)] bg-[#0c1f26]'
                        }`}
                      >
                        All Real Messages ({messages.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('unread')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          activeTab === 'unread'
                            ? 'bg-[var(--acid)] text-[#020a0d] font-bold'
                            : 'text-[#899791] hover:text-[var(--paper)] bg-[#0c1f26]'
                        }`}
                      >
                        Unread ({unreadCount})
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-[#9cc9b7]">
                      Real Messages: {messages.length} verified submissions
                    </div>
                  </div>

                  {/* Message List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
                    {displayedMessages.length === 0 ? (
                      <div className="py-16 text-center flex flex-col items-center justify-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#091a21] border border-[#183a44] flex items-center justify-center text-[var(--acid)] mb-3 shadow-[0_0_20px_rgba(200,233,95,0.1)]">
                          <Inbox className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-mono font-bold text-[var(--paper)]">
                          No messages received yet
                        </p>
                        <p className="text-xs text-[#899791] mt-2 font-mono max-w-md leading-relaxed">
                          All fake and sample messages have been removed. When a visitor writes to you using the Contact form at the bottom of the page, their message will appear here in real time.
                        </p>
                        <p className="text-[11px] text-[#5b7871] mt-1.5 font-mono">
                          (ওয়েবসাইটে কেউ ফর্ম ফিলাপ করলে সাথে সাথে এখানে দেখতে পাবেন)
                        </p>
                      </div>
                    ) : (
                      displayedMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            msg.isRead
                              ? 'bg-[#061419]/60 border-[#142e36] text-[#b6c0bc]'
                              : 'bg-[#081a22] border-[var(--acid)]/40 shadow-lg text-[var(--paper)]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  msg.isRead ? 'bg-slate-600' : 'bg-[var(--acid)] animate-pulse'
                                }`}
                              />
                              <h5 className="font-['Syne'] font-bold text-sm text-[var(--paper)]">
                                {msg.name}
                              </h5>
                              {!msg.isRead && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--acid)]/20 text-[var(--acid)] border border-[var(--acid)]/30">
                                  NEW
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleRead(msg.id)}
                                className="p-1.5 rounded-lg bg-[#0e262f] hover:bg-[#173844] text-[#899791] hover:text-[var(--paper)] transition-colors text-xs"
                                title={msg.isRead ? 'Mark Unread' : 'Mark Read'}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(msg.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors text-xs"
                                title="Delete Message"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#899791] mb-2.5">
                            <a
                              href={`mailto:${msg.email}`}
                              className="flex items-center gap-1.5 text-[#9cc9b7] hover:underline"
                            >
                              <Mail className="w-3 h-3 text-[var(--acid)]" />
                              <span>{msg.email}</span>
                            </a>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{msg.timestamp}</span>
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed font-sans bg-[#040e12] p-3 rounded-xl border border-[#10272f] text-[#d6e0db] whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Modal Bottom Footer with Close Button */}
                  <div className="px-6 py-3 bg-[#0a1a20] border-t border-[#183a44] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#748782]">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-[#132c34] text-[var(--paper)] text-[10px]">Esc</kbd> or click outside to close
                    </span>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#132c34] hover:bg-[#1a3c48] text-[var(--paper)] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close Console</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
