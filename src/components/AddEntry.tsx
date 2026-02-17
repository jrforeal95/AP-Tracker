import { useState, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { PRESET_AMOUNTS, CATEGORIES } from '../constants'
import { getTodayChor, getAllChors } from '../utils/chor'
import type { Category, TabId } from '../types'

interface AddEntryProps {
  recentContacts: string[]
  onSave: (amount: number, from: string, category: Category, chor?: number) => void
  onNavigate: (tab: TabId) => void
}

export default function AddEntry({ recentContacts, onSave, onNavigate }: AddEntryProps) {
  const { t, language } = useLanguage()
  const [amount, setAmount] = useState<number | ''>('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [from, setFrom] = useState('')
  const [category, setCategory] = useState<Category>('father')
  const [chor, setChor] = useState(getTodayChor() ?? 1)
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fromRef = useRef<HTMLInputElement>(null)

  const filteredContacts = from.length > 0
    ? recentContacts.filter(c => c.toLowerCase().includes(from.toLowerCase()))
    : recentContacts

  const handlePreset = (val: number) => {
    setSelectedPreset(val)
    setAmount(val)
    setTimeout(() => fromRef.current?.focus(), 100)
  }

  const handleCustom = () => {
    setSelectedPreset(null)
    setAmount('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleSave = () => {
    const finalAmount = typeof amount === 'number' ? amount : 0
    if (finalAmount <= 0 || !from.trim()) return

    onSave(finalAmount, from, category, chor)
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
      setAmount('')
      setSelectedPreset(null)
      setFrom('')
      onNavigate('dashboard')
    }, 800)
  }

  const canSave = (typeof amount === 'number' ? amount > 0 : false) && from.trim().length > 0

  const chorLabels = language === 'zh'
    ? ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五']
    : getAllChors().map(c => `Chor ${c}`)

  return (
    <div className="px-6 py-6 space-y-8 animate-fade-in">
      {/* Amount Section */}
      <div>
        <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-4 block">
          {t('add.amount')}
        </label>

        {/* Preset Buttons */}
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

        {/* Custom Amount Input */}
        {selectedPreset === null && (
          <div className="relative animate-fade-in">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-content-tertiary text-lg font-medium">$</span>
            <input
              ref={inputRef}
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

        {/* Show selected amount */}
        {selectedPreset !== null && (
          <div className="text-center py-2">
            <span className="text-[32px] font-bold text-content-primary tracking-[-0.03em]">${selectedPreset}</span>
          </div>
        )}
      </div>

      {/* From Field */}
      <div className="relative">
        <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-4 block">
          {t('add.from')}
        </label>
        <input
          ref={fromRef}
          type="text"
          value={from}
          onChange={e => {
            setFrom(e.target.value)
            setShowAutocomplete(true)
          }}
          onFocus={() => setShowAutocomplete(true)}
          onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
          placeholder={t('add.fromPlaceholder')}
          className="w-full px-5 py-4 bg-white rounded-2xl border border-border text-[15px] font-medium
                     text-content-primary placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cny-red/15
                     focus:border-cny-red/30 transition-all"
        />

        {/* Autocomplete Dropdown */}
        {showAutocomplete && filteredContacts.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-border
                          shadow-[0_4px_16px_rgba(0,0,0,0.06)] z-20 max-h-40 overflow-y-auto">
            <p className="px-4 py-2 text-[10px] font-semibold text-content-tertiary uppercase tracking-widest">
              {t('add.recentContacts')}
            </p>
            {filteredContacts.map(contact => (
              <button
                key={contact}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setFrom(contact)
                  setShowAutocomplete(false)
                }}
                className="w-full text-left px-4 py-3 text-[14px] font-medium text-content-primary hover:bg-gray-50
                           active:bg-gray-50 transition-colors border-t border-border"
              >
                {contact}
              </button>
            ))}
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
        {saved ? '✓ ' + t('add.saved') : t('add.save')}
      </button>
    </div>
  )
}
