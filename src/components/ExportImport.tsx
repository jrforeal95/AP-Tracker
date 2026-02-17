import { useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import type { AngpaoEntry } from '../types'

interface ExportImportProps {
  entries: AngpaoEntry[]
  onImport: (entries: AngpaoEntry[]) => void
}

export default function ExportImport({ entries, onImport }: ExportImportProps) {
  const { t } = useLanguage()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleExport = () => {
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
          onImport(data)
          setMessage(t('export.importSuccess'))
          setTimeout(() => setMessage(null), 2000)
        }
      } catch {
        setMessage('Invalid file format')
        setTimeout(() => setMessage(null), 2000)
      }
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleExport}
        className="flex-1 py-2.5 px-4 bg-white rounded-lg border border-border text-xs font-medium
                   text-gray-600 active:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
        {t('export.export')}
      </button>

      <label className="flex-1 py-2.5 px-4 bg-white rounded-lg border border-border text-xs font-medium
                        text-gray-600 active:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
        {t('export.import')}
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </label>

      {message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg
                        text-sm font-medium shadow-lg z-50 animate-fade-in">
          {message}
        </div>
      )}
    </div>
  )
}
