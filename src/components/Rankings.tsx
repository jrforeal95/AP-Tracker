import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useLanguage } from '../i18n/LanguageContext'
import { CATEGORIES } from '../constants'
import type { RankingEntry, CategoryBreakdown, AngpaoEntry } from '../types'

ChartJS.register(ArcElement, Tooltip)

interface RankingsProps {
  rankings: RankingEntry[]
  categoryBreakdown: CategoryBreakdown[]
  biggestAngpao: AngpaoEntry | null
}

const RANK_ACCENTS = [
  { border: 'border-l-amber-400', badge: 'bg-amber-400 text-amber-900', label: '1' },
  { border: 'border-l-gray-400', badge: 'bg-gray-400 text-white', label: '2' },
  { border: 'border-l-amber-600', badge: 'bg-amber-600 text-white', label: '3' },
]

const CATEGORY_COLORS: Record<string, string> = {
  father: '#B91C1C',
  mother: '#D97706',
  friends: '#059669',
  others: '#6366F1',
}

export default function Rankings({ rankings, categoryBreakdown, biggestAngpao }: RankingsProps) {
  const { t, language } = useLanguage()

  const donutData = useMemo(() => ({
    labels: categoryBreakdown.map(c => {
      const cat = CATEGORIES.find(ct => ct.id === c.category)
      return language === 'en' ? cat?.labelEn ?? c.category : cat?.labelZh ?? c.category
    }),
    datasets: [{
      data: categoryBreakdown.map(c => c.total),
      backgroundColor: categoryBreakdown.map(c => CATEGORY_COLORS[c.category] ?? '#9CA3AF'),
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 4,
    }],
  }), [categoryBreakdown, language])

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      tooltip: {
        backgroundColor: '#0E0F0C',
        titleFont: { family: 'Inter', size: 12, weight: 600 as const },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (ctx: { label?: string; parsed: number }) => {
            return ` ${ctx.label}: $${ctx.parsed.toLocaleString()}`
          },
        },
      },
    },
  }

  if (rankings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-8 text-center">
        <div className="text-5xl mb-4">🏆</div>
        <p className="text-content-tertiary text-sm">{t('rankings.noData')}</p>
      </div>
    )
  }

  const top3 = rankings.slice(0, 3)
  const rest = rankings.slice(3)

  return (
    <div className="px-6 py-6 space-y-4 animate-fade-in">
      <h2 className="text-[17px] font-semibold text-content-primary tracking-[-0.02em]">{t('rankings.title')}</h2>

      {/* Top 3 */}
      <div className="space-y-3">
        {top3.map((r, i) => (
          <div
            key={r.name}
            className={`bg-white rounded-2xl border border-border border-l-[3px] ${RANK_ACCENTS[i].border}
                        px-5 py-4 flex items-center gap-4`}
          >
            <span className={`w-7 h-7 rounded-xl ${RANK_ACCENTS[i].badge} flex items-center justify-center
                             text-[11px] font-bold flex-shrink-0`}>
              {RANK_ACCENTS[i].label}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] text-content-primary truncate">{r.name}</p>
              <p className="text-[11px] text-content-tertiary mt-0.5">{r.count} {language === 'en' ? 'angpao' : '个红包'}</p>
            </div>
            <span className="text-[18px] font-bold text-content-primary tracking-[-0.02em]">${r.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Biggest Single Angpao */}
      {biggestAngpao && (
        <div className="bg-white rounded-2xl border-[1.5px] border-cny-gold/25 px-6 py-5">
          <p className="text-[11px] font-semibold text-cny-gold uppercase tracking-widest mb-2">
            {t('rankings.biggestSingle')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] font-bold text-content-primary tracking-[-0.03em]">${biggestAngpao.amount}</span>
            <span className="text-[13px] text-content-tertiary font-medium">
              {language === 'en' ? 'from' : '来自'} {biggestAngpao.from}
            </span>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-5">
            {t('rankings.categoryBreakdown')}
          </h3>
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 flex-shrink-0">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
            <div className="flex-1 space-y-3">
              {categoryBreakdown.map(c => {
                const cat = CATEGORIES.find(ct => ct.id === c.category)
                return (
                  <div key={c.category} className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[c.category] }}
                    />
                    <span className="text-[12px] text-content-secondary font-medium flex-1 truncate">
                      {language === 'en' ? cat?.labelEn : cat?.labelZh}
                    </span>
                    <span className="text-[12px] font-semibold text-content-primary">{c.percentage}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Full Ranking List */}
      {rest.length > 0 && (
        <div>
          <h3 className="text-[13px] font-semibold text-content-primary mb-3">
            {t('rankings.fullList')}
          </h3>
          <div className="bg-white rounded-2xl border border-border divide-y divide-border">
            {rest.map((r, i) => (
              <div key={r.name} className="px-5 py-4 flex items-center gap-4">
                <span className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-content-tertiary">
                  {i + 4}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[14px] text-content-primary truncate">{r.name}</p>
                  <p className="text-[11px] text-content-tertiary mt-0.5">{r.count} {language === 'en' ? 'angpao' : '个红包'}</p>
                </div>
                <span className="text-[15px] font-semibold text-content-primary">${r.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
