import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { CATEGORIES } from '../constants'
import { getTodayChor } from '../utils/chor'
import type { AngpaoEntry, TabId } from '../types'

interface DashboardProps {
  entries: AngpaoEntry[]
  totalAmount: number
  todayEntries: AngpaoEntry[]
  dailyAverage: number
  projection: number
  onNavigate: (tab: TabId) => void
  onDelete: (id: string) => void
}

export default function Dashboard({
  entries,
  totalAmount,
  todayEntries,
  dailyAverage,
  projection,
  onNavigate,
  onDelete,
}: DashboardProps) {
  const { t, language } = useLanguage()
  const todayChor = getTodayChor()
  const todayTotal = todayEntries.reduce((s, e) => s + e.amount, 0)
  const [showAll, setShowAll] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const displayEntries = showAll ? entries : entries.slice(0, 5)

  const handleEntryTap = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      setConfirmId(null)
    } else {
      setExpandedId(id)
      setConfirmId(null)
    }
  }

  const handleDelete = (id: string) => {
    if (confirmId === id) {
      onDelete(id)
      setConfirmId(null)
      setExpandedId(null)
    } else {
      setConfirmId(id)
    }
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <div className="text-6xl mb-6">🧧</div>
        <h2 className="text-xl font-semibold text-content-primary mb-2">
          {t('dashboard.noEntries')}
        </h2>
        <p className="text-content-tertiary text-sm mb-8 max-w-[250px] leading-relaxed">
          {t('dashboard.noEntriesHint')}
        </p>
        <button
          onClick={() => onNavigate('add')}
          className="bg-cny-red text-white font-semibold px-8 py-3.5 rounded-2xl text-[15px]
                     active:scale-[0.97] transition-transform"
        >
          + {t('add.title')}
        </button>
      </div>
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
          {entries.length > 5 && (
            <button
              onClick={() => { setShowAll(!showAll); setExpandedId(null); setConfirmId(null) }}
              className="text-[12px] font-medium text-cny-red active:opacity-70 transition-opacity"
            >
              {showAll ? (language === 'en' ? 'Show less' : '收起') : t('dashboard.viewAll')}
            </button>
          )}
        </div>
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
                  </div>
                  <span className="text-[15px] font-semibold text-content-primary">
                    ${entry.amount}
                  </span>
                </button>

                {/* Delete action row */}
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
    </div>
  )
}
