import { useState, useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { CATEGORIES } from '../constants'
import { getTodayChor } from '../utils/chor'
import { haptic } from '../utils/haptic'
import RelativesCalculator from './RelativesCalculator'
import type { AngpaoEntry, TabId } from '../types'

interface DashboardProps {
  entries: AngpaoEntry[]
  totalAmount: number
  todayEntries: AngpaoEntry[]
  dailyAverage: number
  projection: number
  onNavigate: (tab: TabId) => void
  onDelete: (id: string) => void
  onEdit: (entry: AngpaoEntry) => void
}

export default function Dashboard({
  entries,
  totalAmount,
  todayEntries,
  dailyAverage,
  projection,
  onNavigate,
  onDelete,
  onEdit,
}: DashboardProps) {
  const { t, language } = useLanguage()
  const todayChor = getTodayChor()
  const todayTotal = todayEntries.reduce((s, e) => s + e.amount, 0)
  const [showAll, setShowAll] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showRelativesCalc, setShowRelativesCalc] = useState(false)

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter(e =>
      e.from.toLowerCase().includes(q) ||
      (e.note && e.note.toLowerCase().includes(q))
    )
  }, [entries, searchQuery])

  const displayEntries = showAll ? filteredEntries : filteredEntries.slice(0, 5)

  const handleEntryTap = (id: string) => {
    haptic()
    if (expandedId === id) {
      setExpandedId(null)
      setConfirmId(null)
    } else {
      setExpandedId(id)
      setConfirmId(null)
    }
  }

  const handleDelete = (id: string) => {
    haptic()
    if (confirmId === id) {
      onDelete(id)
      setConfirmId(null)
      setExpandedId(null)
    } else {
      setConfirmId(id)
    }
  }

  if (entries.length === 0) {
    const tips = [
      { emoji: '🧧', text: t('dashboard.emptyTip1') },
      { emoji: '📸', text: t('dashboard.emptyTip2') },
      { emoji: '📊', text: t('dashboard.emptyTip3') },
    ]
    return (
      <>
        <div className="px-6 py-8 space-y-6 animate-fade-in">
          <div className="flex flex-col items-center text-center pt-4">
            <div className="text-7xl mb-5">🧧</div>
            <h2 className="text-xl font-semibold text-content-primary mb-2">
              {t('dashboard.noEntries')}
            </h2>
            <p className="text-content-tertiary text-sm mb-6 max-w-[250px] leading-relaxed">
              {t('dashboard.noEntriesHint')}
            </p>
            <button
              onClick={() => { haptic(); onNavigate('add') }}
              className="bg-cny-red text-white font-semibold px-8 py-3.5 rounded-2xl text-[15px]
                         active:scale-[0.97] transition-transform shadow-sm"
            >
              + {t('add.title')}
            </button>
          </div>

          {/* Tip Cards */}
          <div className="space-y-3 pt-2">
            {tips.map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border px-5 py-4 flex items-center gap-4">
                <span className="text-xl">{tip.emoji}</span>
                <p className="text-[13px] text-content-secondary leading-snug">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Relatives Calculator FAB */}
        <button
          onClick={() => { haptic(); setShowRelativesCalc(true) }}
          className="fixed bottom-24 right-5 w-12 h-12 rounded-2xl bg-cny-gold text-white flex items-center justify-center
                     shadow-[0_4px_12px_rgba(217,119,6,0.3)] active:scale-90 transition-transform z-40"
        >
          <span className="text-xl">👪</span>
        </button>

        {/* Relatives Calculator Modal */}
        {showRelativesCalc && (
          <RelativesCalculator onClose={() => setShowRelativesCalc(false)} />
        )}
      </>
    )
  }

  return (
    <div className="px-6 py-6 space-y-4">
      {/* Hero Total Card */}
      <div className="bg-white rounded-2xl border border-border p-6 border-l-[3px] border-l-cny-red animate-fade-in">
        <p className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-2">
          {t('dashboard.totalCollected')}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-content-tertiary text-lg font-medium">$</span>
          <span className="text-[36px] font-bold text-content-primary tracking-[-0.03em] leading-none">
            {totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex gap-8 mt-5 pt-5 border-t border-border">
          <div>
            <p className="text-[11px] text-content-tertiary font-medium">
              {t('dashboard.projection')}
            </p>
            <p className="text-[17px] font-semibold text-content-primary mt-1">
              ${projection.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-content-tertiary font-medium">
              {t('dashboard.dailyAvg')}
            </p>
            <p className="text-[17px] font-semibold text-content-primary mt-1">
              ${dailyAverage.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      {todayChor && (
        <div className="bg-white rounded-2xl border border-border px-6 py-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-content-primary">
                {t('dashboard.todayStats')} — {language === 'zh' ? `初${todayChor === 10 ? '十' : ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五'][todayChor-1]}` : `Chor ${todayChor}`}
              </p>
              <p className="text-[11px] text-content-tertiary mt-1">
                {t('dashboard.todayCount', { count: todayEntries.length })}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[22px] font-bold text-content-primary tracking-[-0.02em]">
                ${todayTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in">
        <button
          onClick={() => onNavigate('chart')}
          className="bg-white rounded-2xl border border-border p-5 text-left
                     active:bg-gray-50 transition-colors"
        >
          <p className="text-[24px] font-bold text-content-primary tracking-[-0.02em]">{entries.length}</p>
          <p className="text-[12px] text-content-tertiary mt-1 font-medium">{t('common.entries')}</p>
        </button>

        <button
          onClick={() => onNavigate('rankings')}
          className="bg-white rounded-2xl border border-border p-5 text-left
                     active:bg-gray-50 transition-colors"
        >
          <p className="text-[24px] font-bold text-content-primary tracking-[-0.02em]">
            {new Set(entries.map(e => e.from)).size}
          </p>
          <p className="text-[12px] text-content-tertiary mt-1 font-medium">
            {language === 'en' ? 'givers' : '来源'}
          </p>
        </button>
      </div>

      {/* Entries List */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-content-primary">
            {showAll ? (language === 'en' ? 'All Entries' : '全部记录') : t('dashboard.recentEntries')}
          </h3>
          {filteredEntries.length > 5 && (
            <button
              onClick={() => { setShowAll(!showAll); setExpandedId(null); setConfirmId(null) }}
              className="text-[12px] font-medium text-cny-red active:opacity-70 transition-opacity"
            >
              {showAll ? (language === 'en' ? 'Show less' : '收起') : t('dashboard.viewAll')}
            </button>
          )}
        </div>

        {/* Search Bar */}
        {entries.length > 3 && (
          <div className="relative mb-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-content-tertiary">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowAll(true) }}
              placeholder={t('dashboard.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-border text-[13px] font-medium
                         text-content-primary placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cny-red/15
                         focus:border-cny-red/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-500">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="bg-white rounded-2xl border border-border divide-y divide-border">
          {displayEntries.map((entry) => {
            const cat = CATEGORIES.find(c => c.id === entry.category)
            const isExpanded = expandedId === entry.id
            const isConfirming = confirmId === entry.id

            return (
              <div key={entry.id}>
                <button
                  onClick={() => handleEntryTap(entry.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left active:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">{cat?.emoji ?? '🧧'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[14px] text-content-primary truncate">{entry.from}</p>
                    <p className="text-[11px] text-content-tertiary mt-0.5">
                      {language === 'en' ? cat?.labelEn : cat?.labelZh} · {language === 'zh' ? `初${['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五'][entry.chor-1]}` : `Chor ${entry.chor}`}
                    </p>
                    {entry.note && (
                      <p className="text-[11px] text-content-tertiary mt-0.5 italic truncate">
                        {entry.note}
                      </p>
                    )}
                  </div>
                  <span className="text-[15px] font-semibold text-content-primary">
                    ${entry.amount}
                  </span>
                </button>

                {/* Edit / Delete action row */}
                {isExpanded && (
                  <div className="px-5 pb-4 flex items-center justify-end gap-2 animate-fade-in">
                    {isConfirming && (
                      <button
                        onClick={() => { setConfirmId(null); setExpandedId(null) }}
                        className="px-4 py-2 rounded-xl text-[12px] font-medium text-content-secondary
                                   border border-border active:bg-gray-50 transition-colors"
                      >
                        {t('common.cancel')}
                      </button>
                    )}
                    {!isConfirming && (
                      <button
                        onClick={() => { onEdit(entry); setExpandedId(null) }}
                        className="px-4 py-2 rounded-xl text-[12px] font-medium text-cny-red border border-cny-red/25
                                   active:bg-cny-red-50 transition-colors"
                      >
                        {t('dashboard.editEntry')}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className={`px-4 py-2 rounded-xl text-[12px] font-medium transition-colors ${
                        isConfirming
                          ? 'bg-red-600 text-white active:bg-red-700'
                          : 'text-red-600 border border-red-200 active:bg-red-50'
                      }`}
                    >
                      {isConfirming ? (t('common.confirm')) : t('common.delete')}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Relatives Calculator FAB */}
      <button
        onClick={() => { haptic(); setShowRelativesCalc(true) }}
        className="fixed bottom-24 right-5 w-12 h-12 rounded-2xl bg-cny-gold text-white flex items-center justify-center
                   shadow-[0_4px_12px_rgba(217,119,6,0.3)] active:scale-90 transition-transform z-40"
      >
        <span className="text-xl">👪</span>
      </button>

      {/* Relatives Calculator Modal */}
      {showRelativesCalc && (
        <RelativesCalculator onClose={() => setShowRelativesCalc(false)} />
      )}
    </div>
  )
}
