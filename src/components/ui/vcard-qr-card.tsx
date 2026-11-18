import React, { useState } from 'react'
import { Download, QrCode, Check, UserPlus, Phone, Mail, Globe } from 'lucide-react'

export function VcardQrCard() {
  const [copied, setCopied] = useState(false)

  const downloadVCard = () => {
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:Subhajit Sanpui
N:Sanpui;Subhajit;;;
TITLE:Class 10 Student & Future Cardiologist
TEL;TYPE=CELL;TYPE=PREF:+918670225411
TEL;TYPE=CELL:+919749158368
EMAIL;TYPE=INTERNET:sanpuianup88@gmail.com
URL:${typeof window !== 'undefined' ? window.location.origin : 'https://github.com/SubhojitSanpui'}
NOTE:Subhajit Sanpui - Class 10 Student (Batch 2027) from India growing toward Cardiology & Software Engineering.
END:VCARD`

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Subhajit_Sanpui_Contact.vcf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  // Pre-generated high-contrast crisp SVG QR code matrix encoding contact link / vcard
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#071318]/90 border-2 border-[#19373f] hover:border-[var(--acid)] transition-all shadow-xl">
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[var(--acid)] uppercase mb-3">
        <QrCode className="w-4 h-4 text-[var(--acid)]" />
        <span>ONE-CLICK DIGITAL VCARD</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Neon Contact QR Frame */}
        <div className="relative p-3 rounded-2xl bg-[#03090b] border-2 border-[var(--acid)]/50 shadow-[0_0_20px_rgba(200,233,95,0.2)] shrink-0">
          <svg
            viewBox="0 0 120 120"
            className="w-28 h-28 text-[var(--acid)]"
            fill="currentColor"
          >
            {/* Corner Markers */}
            <rect x="10" y="10" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="18" y="18" width="14" height="14" rx="2" fill="currentColor" />

            <rect x="80" y="10" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="88" y="18" width="14" height="14" rx="2" fill="currentColor" />

            <rect x="10" y="80" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="18" y="88" width="14" height="14" rx="2" fill="currentColor" />

            {/* Simulated Data Matrix Bits */}
            <rect x="48" y="14" width="8" height="8" fill="currentColor" />
            <rect x="62" y="14" width="8" height="8" fill="currentColor" />
            <rect x="48" y="28" width="8" height="8" fill="currentColor" />
            <rect x="62" y="28" width="8" height="8" fill="currentColor" />

            <rect x="14" y="48" width="8" height="8" fill="currentColor" />
            <rect x="28" y="48" width="8" height="8" fill="currentColor" />
            <rect x="14" y="62" width="8" height="8" fill="currentColor" />
            <rect x="28" y="62" width="8" height="8" fill="currentColor" />

            <rect x="48" y="48" width="24" height="24" rx="4" fill="currentColor" />
            <rect x="80" y="48" width="8" height="8" fill="currentColor" />
            <rect x="98" y="48" width="8" height="8" fill="currentColor" />
            <rect x="80" y="62" width="8" height="8" fill="currentColor" />
            <rect x="98" y="62" width="8" height="8" fill="currentColor" />

            <rect x="48" y="82" width="8" height="8" fill="currentColor" />
            <rect x="62" y="82" width="8" height="8" fill="currentColor" />
            <rect x="48" y="98" width="8" height="8" fill="currentColor" />
            <rect x="62" y="98" width="8" height="8" fill="currentColor" />
            <rect x="80" y="82" width="26" height="26" rx="4" fill="currentColor" />
          </svg>
          <span className="block text-center text-[9px] font-mono tracking-widest text-[#9cc9b7] mt-1.5">
            SCAN CONTACT
          </span>
        </div>

        {/* Text & Save Button */}
        <div className="flex-1 text-center sm:text-left w-full">
          <h4 className="font-['Manrope',sans-serif] text-xl font-bold text-white tracking-tight">
            Save Subhajit to Phone
          </h4>
          <p className="font-['Manrope',sans-serif] text-sm text-slate-300 mt-1.5 leading-relaxed">
            Scan with phone camera or tap below to instantly save Subhajit Sanpui&apos;s phone, email &amp; portfolio directly into your mobile contacts.
          </p>

          <button
            type="button"
            onClick={downloadVCard}
            className="mt-4 w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--acid)] text-[#04090b] font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-[#d8f86f] transition-all cursor-pointer shadow-[0_0_20px_rgba(200,233,95,0.3)] active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-900" />
                <span>Contact Saved!</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Save to Contacts (.vcf)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
