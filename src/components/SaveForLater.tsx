import { useState, useRef, useCallback } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

interface SaveForLaterProps {
  onSave: (photo: string, from: string) => void
  onBack: () => void
}

function resizeImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('No canvas context'))
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

export default function SaveForLater({ onSave, onBack }: SaveForLaterProps) {
  const { language } = useLanguage()
  const [photo, setPhoto] = useState<string | null>(null)
  const [from, setFrom] = useState('')
  const [saved, setSaved] = useState(false)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const resized = await resizeImage(file, 800)
      setPhoto(resized)
    } catch {
      // silently fail
    }
    e.target.value = ''
  }, [])

  const handleSave = () => {
    if (!photo || !from.trim()) return
    onSave(photo, from)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onBack()
    }, 800)
  }

  const canSave = photo !== null && from.trim().length > 0

  return (
    <div className="px-6 py-6 space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-medium text-content-tertiary active:opacity-70 transition-opacity"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
        {language === 'en' ? 'Back' : '返回'}
      </button>

      {/* Photo Section */}
      <div>
        <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-4 block">
          {language === 'en' ? 'Photo' : '照片'}
        </label>

        {photo ? (
          <div className="relative">
            <img
              src={photo}
              alt="Angpao"
              className="w-full max-h-[300px] object-cover rounded-2xl border border-border"
            />
            <button
              onClick={() => setPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-black/50 flex items-center justify-center
                         active:bg-black/70 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[13px] text-content-tertiary">
              {language === 'en' ? 'Snap a photo of the angpao' : '拍一张红包的照片'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => cameraRef.current?.click()}
                className="bg-white border border-border rounded-2xl py-8 flex flex-col items-center gap-3
                           active:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-cny-red-50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-content-primary">
                  {language === 'en' ? 'Camera' : '拍照'}
                </span>
              </button>

              <button
                onClick={() => galleryRef.current?.click()}
                className="bg-white border border-border rounded-2xl py-8 flex flex-col items-center gap-3
                           active:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-cny-gold-50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-content-primary">
                  {language === 'en' ? 'Gallery' : '相册'}
                </span>
              </button>
            </div>
          </div>
        )}

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* From Field */}
      <div>
        <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-4 block">
          {language === 'en' ? 'From' : '来自'}
        </label>
        <input
          type="text"
          value={from}
          onChange={e => setFrom(e.target.value)}
          placeholder={language === 'en' ? 'e.g. Uncle Tan, Grandma' : '如：陈叔叔、奶奶'}
          className="w-full px-5 py-4 bg-white rounded-2xl border border-border text-[15px] font-medium
                     text-content-primary placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cny-red/15
                     focus:border-cny-red/30 transition-all"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!canSave}
        className={`w-full py-4 rounded-2xl text-[16px] font-semibold transition-all duration-200 ${
          saved
            ? 'bg-[#2F5711] text-white'
            : canSave
              ? 'bg-cny-red text-white active:scale-[0.98] shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {saved
          ? (language === 'en' ? '✓ Saved!' : '✓ 已保存！')
          : (language === 'en' ? 'Save for Later' : '保存稍后打开')
        }
      </button>
    </div>
  )
}
