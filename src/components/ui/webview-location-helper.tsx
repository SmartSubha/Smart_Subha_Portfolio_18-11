import React, { useState } from 'react'
import { MapPin, AlertTriangle, CheckCircle2, Copy, Check, Terminal, ExternalLink, X, ShieldAlert } from 'lucide-react'

export function WebviewLocationHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle')
  const [locationData, setLocationData] = useState<{
    latitude?: number
    longitude?: number
    city?: string
    region?: string
    source?: string
    error?: string
  } | null>(null)

  const testLocation = () => {
    setStatus('testing')
    setLocationData(null)

    // 1. Try native browser geolocation first
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus('success')
          setLocationData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            source: 'GPS / Native Geolocation API (Success)',
          })
        },
        async (error) => {
          // Native failed (e.g. WebView denied or blocked)
          // 2. Automatically try IP Geolocation Fallback
          try {
            const res = await fetch('https://ipapi.co/json/')
            if (!res.ok) throw new Error('IP service unreachable')
            const data = await res.json()
            setStatus('success')
            setLocationData({
              latitude: data.latitude,
              longitude: data.longitude,
              city: data.city,
              region: data.region,
              source: 'IP-Based Fallback (Works inside APK without GPS permission!)',
              error: `Native error: ${error.message} (Solved with IP Fallback)`,
            })
          } catch (ipErr) {
            setStatus('failed')
            setLocationData({
              error: `Native GPS Blocked: "${error.message}". In Android APK WebView, you must grant Geolocation permission in WebChromeClient.`,
            })
          }
        },
        { timeout: 7000 }
      )
    } else {
      setStatus('failed')
      setLocationData({ error: 'Geolocation API not supported in this environment.' })
    }
  }

  const codeSnippet = `// Add this to your Android APK (MainActivity.java):
myWebView.getSettings().setGeolocationEnabled(true);
myWebView.getSettings().setJavaScriptEnabled(true);

myWebView.setWebChromeClient(new WebChromeClient() {
    @Override
    public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
        // Automatically allow location in WebView
        callback.invoke(origin, true, false);
    }
});`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081a20] hover:bg-[#0c242c] border border-[#1b3d45] text-[11px] font-mono text-[#9cc9b7] hover:text-[var(--mint)] transition-all cursor-pointer"
        title="Fix Location in Android APK / WebView"
      >
        <MapPin className="w-3.5 h-3.5 text-[var(--mint)]" />
        <span>APK Location Guide & Fix</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-xl bg-[#07161b] border-2 border-[#1c3f48] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(156,201,183,0.15)] max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#899791] hover:text-white hover:bg-[#122e36] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[var(--mint)]/15 border border-[var(--mint)]/40 flex items-center justify-center text-[var(--mint)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-['Syne'] text-lg font-bold text-white">
                  APK Location Guide & Diagnostic
                </h4>
                <p className="text-xs font-mono text-[#8ca399]">
                  Why Android APK says &quot;Turn on location from browser settings&quot;
                </p>
              </div>
            </div>

            {/* Explanation in Bengali & English */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-300 bg-[#040e12] p-4 rounded-2xl border border-[#142e36]">
              <p>
                <strong className="text-[var(--mint)]">কেন এমন হয়?</strong> আপনার তৈরি করা Android
                APK-র ভেতর <code className="text-[var(--acid)]">WebView</code> ডিফল্টভাবে লোকেশন ব্লক
                করে রাখে। ফোনে লোকেশন অন থাকলেও APK-র কোডে <code className="text-[var(--acid)]">WebChromeClient</code> সেট না থাকলে
                &quot;Browser settings theke Location on korte hobe&quot; দেখায়।
              </p>
              <p>
                <strong className="text-white">What causes this:</strong> Android WebViews require explicit permission callback handling in Java/Kotlin.
              </p>
            </div>

            {/* Test Location Button */}
            <div className="my-5 p-4 rounded-2xl bg-[#091c22] border border-[#1b3d45]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Live Location Tester
                </span>
                <button
                  type="button"
                  onClick={testLocation}
                  disabled={status === 'testing'}
                  className="px-4 py-2 rounded-xl bg-[var(--mint)] text-[#04090b] font-bold text-xs hover:bg-[#b5e3d1] transition-all cursor-pointer disabled:opacity-50"
                >
                  {status === 'testing' ? 'Testing GPS & IP...' : 'Run Location Diagnostic'}
                </button>
              </div>

              {locationData && (
                <div className="text-xs font-mono bg-[#051115] p-3 rounded-xl border border-[#183942] space-y-1.5">
                  <div className="flex items-center gap-2">
                    {status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="font-bold text-white">{locationData.source || 'Result'}</span>
                  </div>
                  {locationData.latitude && (
                    <p className="text-[#9cc9b7]">
                      Coordinates: {locationData.latitude.toFixed(4)}° N, {locationData.longitude?.toFixed(4)}° E
                    </p>
                  )}
                  {locationData.city && (
                    <p className="text-[#9cc9b7]">
                      Detected Area: {locationData.city}, {locationData.region}
                    </p>
                  )}
                  {locationData.error && (
                    <p className="text-amber-300 text-[11px] mt-1">{locationData.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* Solution for Android APK Developer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#9cc9b7] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[var(--mint)]" />
                  <span>APK Fix Code (MainActivity.java)</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0b242c] hover:bg-[#123642] text-[11px] font-mono text-[var(--mint)] transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-[#030a0d] border border-[#16333b] text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {codeSnippet}
              </pre>

              <p className="text-[11px] text-[#789086] mt-2">
                Also ensure <code className="text-white">AndroidManifest.xml</code> has:
                <br />
                <code className="text-amber-300">&lt;uses-permission android:name=&quot;android.permission.ACCESS_FINE_LOCATION&quot; /&gt;</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
