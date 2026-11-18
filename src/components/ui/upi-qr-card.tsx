import React, { useState } from 'react'
import { Copy, Check, Heart, ShieldCheck } from 'lucide-react'

export function UpiQrCard() {
  const upiId = 'subhajitsanpui@yesfam'
  const [copied, setCopied] = useState(false)

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Pre-configured UPI intent: upi://pay?pa=subhajitsanpui@yesfam&pn=Subhajit%20Sanpui
  return (
    <div className="max-w-md mx-auto my-6 p-4 rounded-2xl bg-[#061216]/90 border border-[#1a3840] shadow-xl text-center">
      <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-widest text-[#9cc9b7] uppercase mb-2">
        <Heart className="w-3 h-3 text-[var(--coral)] animate-pulse" />
        <span>SUPPORT SUBHAJIT&apos;S CARDIOLOGY & TECH JOURNEY</span>
      </div>

      <div className="flex items-center justify-center gap-4">
        {/* Miniature Crisp UPI QR Box */}
        <div className="p-2 rounded-xl bg-white border border-[#23454e] shadow-md shrink-0">
          <svg viewBox="0 0 100 100" className="w-16 h-16 text-black" fill="currentColor">
            {/* Top-left marker */}
            <rect x="8" y="8" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="14" y="14" width="14" height="14" rx="2" fill="currentColor" />
            {/* Top-right marker */}
            <rect x="66" y="8" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="72" y="14" width="14" height="14" rx="2" fill="currentColor" />
            {/* Bottom-left marker */}
            <rect x="8" y="66" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="14" y="72" width="14" height="14" rx="2" fill="currentColor" />
            {/* UPI Data Bits */}
            <rect x="42" y="12" width="6" height="6" fill="currentColor" />
            <rect x="52" y="12" width="6" height="6" fill="currentColor" />
            <rect x="42" y="24" width="6" height="6" fill="currentColor" />
            <rect x="12" y="42" width="6" height="6" fill="currentColor" />
            <rect x="24" y="42" width="6" height="6" fill="currentColor" />
            <rect x="42" y="42" width="16" height="16" rx="2" fill="currentColor" />
            <rect x="68" y="42" width="6" height="6" fill="currentColor" />
            <rect x="80" y="42" width="6" height="6" fill="currentColor" />
            <rect x="42" y="68" width="6" height="6" fill="currentColor" />
            <rect x="52" y="68" width="6" height="6" fill="currentColor" />
            <rect x="68" y="68" width="20" height="20" rx="3" fill="currentColor" />
          </svg>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--paper)]">
            <ShieldCheck className="w-4 h-4 text-[var(--acid)]" />
            <span>UPI ID: {upiId}</span>
          </div>
          <p className="text-[11px] text-[#899791] mt-0.5">
            Any UPI app (GPay / PhonePe / Paytm / BHIM)
          </p>

          <button
            type="button"
            onClick={copyUpi}
            className="mt-2 px-3 py-1 rounded-lg bg-[#0c2229] border border-[#1e424d] hover:border-[var(--acid)] text-[10px] font-mono text-[var(--acid)] inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>UPI ID Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy UPI ID</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
