import { useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { haptic } from '../utils/haptic'
import RecapScreen from './RecapScreen'
import type { AngpaoEntry, RankingEntry, CategoryBreakdown } from '../types'

interface MorePageProps {
  entries: AngpaoEntry[]
  onImport: (entries: AngpaoEntry[]) => void
  totalAmount: number
  rankings: RankingEntry[]
  categoryBreakdown: CategoryBreakdown[]
  biggestAngpao: AngpaoEntry | null
  dailyAverage: number
  projection: number
}

export default function MorePage({
  entries,
  onImport,
  totalAmount,
  rankings,
  categoryBreakdown,
  biggestAngpao,
  dailyAverage,
  projection,
}: MorePageProps) {
  const { t, language } = useLanguage()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showRecap, setShowRecap] = useState(false)
  const [importConfirm, setImportConfirm] = useState<AngpaoEntry[] | null>(null)

  const handleExport = () => {
    haptic()
    const data = JSON.stringify(entries, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `angpao-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage(t('export.exportSuccess'))
    setTimeout(() => setMessage(null), 2000)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as AngpaoEntry[]
        if (Array.isArray(data)) {
          setImportConfirm(data)
        }
      } catch {
        setMessage('Invalid file format')
        setTimeout(() => setMessage(null), 2000)
      }
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const confirmImport = () => {
    haptic()
    if (importConfirm) {
      onImport(importConfirm)
      setImportConfirm(null)
      setMessage(t('export.importSuccess'))
      setTimeout(() => setMessage(null), 2000)
    }
  }

  const giverCount = new Set(entries.map(e => e.from)).size

  return (
    <>
      <div className="px-6 py-6 space-y-5 animate-fade-in">
        <h2 className="text-[17px] font-semibold text-content-primary tracking-[-0.02em]">{t('more.title')}</h2>

        {/* Data Management */}
        <div className="bg-white rounded-2xl border border-border divide-y divide-border">
          <button
            onClick={handleExport}
            className="w-full px-5 py-4 flex items-center gap-4 active:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-cny-red-50 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] text-cny-red">
                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-content-primary">{t('export.export')}</p>
              <p className="text-[11px] text-content-tertiary mt-0.5">{t('more.exportDesc')}</p>
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-content-tertiary/50">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>

          <label className="w-full px-5 py-4 flex items-center gap-4 active:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-cny-gold-50 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] text-cny-gold">
                <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-content-primary">{t('export.import')}</p>
              <p className="text-[11px] text-content-tertiary mt-0.5">{t('more.importDesc')}</p>
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-content-tertiary/50">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {/* Year Recap */}
        <button
          onClick={() => setShowRecap(true)}
          disabled={entries.length === 0}
          className="w-full bg-white rounded-2xl border border-border px-5 py-5 active:bg-gray-50 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cny-red to-cny-gold flex items-center justify-center">
              <span className="text-white text-sm">🎆</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-content-primary">{t('more.recap')}</p>
              <p className="text-[11px] text-content-tertiary mt-0.5">{t('more.recapDesc')}</p>
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-content-tertiary/50">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </div>
        </button>

        {/* App Info */}
        <div className="text-center pt-6">
          <p className="text-[11px] text-content-tertiary/50 font-medium">Angpao Tracker v2.0</p>
          <p className="text-[11px] text-content-tertiary/50 mt-0.5">CNY 2026</p>
        </div>

        {/* Toast */}
        {message && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-content-primary text-white px-5 py-2.5 rounded-2xl
                          text-[13px] font-medium shadow-[0_4px_16px_rgba(0,0,0,0.12)] z-50 animate-fade-in">
            {message}
          </div>
        )}
      </div>

      {/* Import Confirmation Modal */}
      {importConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-8 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-[16px] font-semibold text-content-primary mb-2">
              {t('export.importConfirmTitle')}
            </h3>
            <p className="text-[14px] text-content-secondary leading-relaxed mb-6">
              {t('export.importConfirmBody', {
                existing: entries.length,
                incoming: importConfirm.length,
              })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setImportConfirm(null)}
                className="flex-1 py-3 rounded-2xl text-[14px] font-medium text-content-secondary
                           border border-border active:bg-gray-50 transition-colors"
              >
                {t('export.importCancel')}
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 py-3 rounded-2xl text-[14px] font-semibold text-white
                           bg-cny-red active:bg-red-800 transition-colors"
              >
                {t('export.importConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recap Full Screen Overlay */}
      {showRecap && (
        <RecapScreen
          language={language}
          totalAmount={totalAmount}
          entryCount={entries.length}
          giverCount={giverCount}
          dailyAverage={dailyAverage}
          projection={projection}
          topGivers={rankings}
          categoryBreakdown={categoryBreakdown}
          biggestAngpao={biggestAngpao}
          onClose={() => setShowRecap(false)}
        />
      )}
    </>
  )
}
