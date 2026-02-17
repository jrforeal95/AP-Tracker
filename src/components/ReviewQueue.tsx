import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { PRESET_AMOUNTS, CATEGORIES } from '../constants'
import { getTodayChor, getAllChors } from '../utils/chor'
import type { Category, QueuedAngpao } from '../types'

interface ReviewQueueProps {
  item: QueuedAngpao
  onSave: (amount: number, from: string, category: Category, chor?: number) => void
  onRemoveFromQueue: (id: string) => void
  onBack: () => void
}

export default function ReviewQueue({ item, onSave, onRemoveFromQueue, onBack }: ReviewQueueProps) {
  const { t, language } = useLanguage()
  const [amount, setAmount] = useState<number | ''>('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [category, setCategory] = useState<Category>('father')
  const [chor, setChor] = useState(getTodayChor() ?? 1)
  const [saved, setSaved] = useState(false)
  const inputRef = { current: null as HTMLInputElement | null }

  const handlePreset = (val: number) => {
    setSelectedPreset(val)
    setAmount(val)
  }

  const handleCustom = () => {
    setSelectedPreset(null)
    setAmount('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleSave = () => {
    const finalAmount = typeof amount === 'number' ? amount : 0
    if (finalAmount <= 0) return

    onSave(finalAmount, item.from, category, chor)
    onRemoveFromQueue(item.id)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onBack()
    }, 800)
  }

  const canSave = typeof amount === 'number' && amount > 0

  const chorLabels = language === 'zh'
    ? ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五']
    : getAllChors().map(c => `Chor ${c}`)

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

      {/* Photo + Name header */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <img
          src={item.photo}
          alt={item.from}
          className="w-full max-h-[200px] object-cover"
        />
        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest">
            {language === 'en' ? 'From' : '来自'}
          </p>
          <p className="text-[17px] font-semibold text-content-primary mt-1">{item.from}</p>
        </div>
      </div>

      {/* Amount Section */}
      <div>
        <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-4 block">
          {t('add.amount')}
        </label>

        <div className="flex gap-2 flex-wrap mb-4">
          {PRESET_AMOUNTS.map(val => (
            <button
              key={val}
              onClick={() => handlePreset(val)}
              className={`flex-1 min-w-[60px] py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200
                ${selectedPreset === val
                  ? 'bg-cny-red text-white shadow-sm'
                  : 'bg-white text-content-primary border border-border active:bg-gray-50'
                }`}
            >
              ${val}
            </button>
          ))}
          <button
            onClick={handleCustom}
            className={`flex-1 min-w-[60px] py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200
              ${selectedPreset === null && amount !== ''
                ? 'bg-cny-red text-white shadow-sm'
                : 'bg-white text-content-tertiary border border-border active:bg-gray-50'
              }`}
          >
            {t('add.custom')}
          </button>
        </div>

        {selectedPreset === null && (
          <div className="relative animate-fade-in">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-content-tertiary text-lg font-medium">$</span>
            <input
              ref={el => { inputRef.current = el }}
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={e => setAmount(e.target.value ? Number(e.target.value) : '')}
              placeholder="0"
              className="w-full pl-11 pr-5 py-4 bg-white rounded-2xl border border-border text-[24px] font-bold
                         text-content-primary placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cny-red/15
                         focus:border-cny-red/30 transition-all"
            />
          </div>
        )}

        {selectedPreset !== null && (
          <div className="text-center py-2">
            <span className="text-[32px] font-bold text-content-primary tracking-[-0.03em]">${selectedPreset}</span>
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-4 block">
          {t('add.category')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`py-3.5 px-4 rounded-2xl text-[14px] font-medium transition-all duration-200 flex items-center gap-2.5
                ${category === cat.id
                  ? 'bg-cny-red-50 text-cny-red border-[1.5px] border-cny-red/25'
                  : 'bg-white text-content-secondary border border-border active:bg-gray-50'
                }`}
            >
              <span className="text-base">{cat.emoji}</span>
              {language === 'en' ? cat.labelEn : cat.labelZh}
            </button>
          ))}
        </div>
      </div>

      {/* Chor Selector */}
      <div>
        <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-4 block">
          {t('add.chor')}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {getAllChors().map((c, i) => (
            <button
              key={c}
              onClick={() => setChor(c)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-[12px] font-semibold transition-all duration-200 relative
                ${chor === c
                  ? 'bg-cny-red text-white'
                  : 'bg-white text-content-secondary border border-border active:bg-gray-50'
                }`}
            >
              {chorLabels[i]}
              {c === getTodayChor() && chor !== c && (
                <span className="absolute -top-0.5 -right-0.5 w-[6px] h-[6px] rounded-full bg-cny-red" />
              )}
            </button>
          ))}
        </div>
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
          ? '✓ ' + t('add.saved')
          : (language === 'en' ? 'Open & Record' : '打开并记录')
        }
      </button>
    </div>
  )
}
