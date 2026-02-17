import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useLanguage } from '../i18n/LanguageContext'
import { CHOR_LABELS_ZH } from '../constants'
import type { DailyTotal } from '../types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

interface LineChartProps {
  dailyTotals: DailyTotal[]
  projection: number
  dailyAverage: number
  totalAmount: number
}

export default function LineChartScreen({ dailyTotals, projection, dailyAverage, totalAmount }: LineChartProps) {
  const { t, language } = useLanguage()

  const lastDataChor = useMemo(() => {
    for (let i = dailyTotals.length - 1; i >= 0; i--) {
      if (dailyTotals[i].count > 0) return dailyTotals[i].chor
    }
    return 0
  }, [dailyTotals])

  const labels = dailyTotals.map(d =>
    language === 'zh' ? CHOR_LABELS_ZH[d.chor] : `C${d.chor}`
  )

  const actualData = dailyTotals.map(d =>
    d.chor <= lastDataChor ? d.cumulative : null
  )

  const projectionData = useMemo(() => {
    if (lastDataChor === 0) return dailyTotals.map(() => null)
    const lastCumulative = dailyTotals.find(d => d.chor === lastDataChor)?.cumulative ?? 0
    const avgPerDay = lastDataChor > 0 ? lastCumulative / lastDataChor : 0

    return dailyTotals.map(d => {
      if (d.chor < lastDataChor) return null
      if (d.chor === lastDataChor) return lastCumulative
      return Math.round(lastCumulative + avgPerDay * (d.chor - lastDataChor))
    })
  }, [dailyTotals, lastDataChor])

  const avgLine = dailyTotals.map(() => dailyAverage)

  const chartData = {
    labels,
    datasets: [
      {
        label: t('chart.cumulative'),
        data: actualData,
        borderColor: '#B91C1C',
        backgroundColor: 'rgba(185, 28, 28, 0.04)',
        borderWidth: 2.5,
        pointBackgroundColor: '#B91C1C',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.35,
        spanGaps: false,
      },
      {
        label: t('chart.projection'),
        data: projectionData,
        borderColor: '#D97706',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        pointHoverRadius: 3,
        fill: false,
        tension: 0.35,
        spanGaps: true,
      },
      {
        label: t('chart.dailyAvg'),
        data: avgLine,
        borderColor: 'rgba(14, 15, 12, 0.08)',
        borderWidth: 1,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      tooltip: {
        backgroundColor: '#0E0F0C',
        titleFont: { family: 'Inter', size: 12, weight: 600 as const },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            if (ctx.parsed.y === null) return ''
            return `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 10, weight: 500 as const },
          color: '#6A6C6A',
          maxRotation: 0,
        },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(14, 15, 12, 0.04)' },
        ticks: {
          font: { family: 'Inter', size: 10 },
          color: '#6A6C6A',
          callback: (value: string | number) => `$${value}`,
        },
        border: { display: false },
      },
    },
  }

  if (lastDataChor === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-8 text-center">
        <div className="text-5xl mb-4">📊</div>
        <p className="text-content-tertiary text-sm">{t('chart.noData')}</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-6 space-y-4 animate-fade-in">
      <h2 className="text-[17px] font-semibold text-content-primary tracking-[-0.02em]">{t('chart.title')}</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-border p-4 text-center">
          <p className="text-[11px] text-content-tertiary font-medium">{t('common.total')}</p>
          <p className="text-[17px] font-bold text-content-primary mt-1 tracking-[-0.02em]">${totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 text-center">
          <p className="text-[11px] text-content-tertiary font-medium">{t('chart.projection')}</p>
          <p className="text-[17px] font-bold text-content-primary mt-1 tracking-[-0.02em]">${projection.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 text-center">
          <p className="text-[11px] text-content-tertiary font-medium">{t('chart.dailyAvg')}</p>
          <p className="text-[17px] font-bold text-content-primary mt-1 tracking-[-0.02em]">${dailyAverage.toLocaleString()}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="h-[260px]">
          <Line data={chartData} options={options} />
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-[2px] bg-cny-red rounded-full" />
            <span className="text-[11px] text-content-tertiary font-medium">{t('chart.cumulative')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-[2px] rounded-full" style={{ borderTop: '2px dashed #D97706', height: 0 }} />
            <span className="text-[11px] text-content-tertiary font-medium">{t('chart.projection')}</span>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div>
        <h3 className="text-[13px] font-semibold text-content-primary mb-3">
          {language === 'en' ? 'Daily breakdown' : '每日明细'}
        </h3>
        <div className="bg-white rounded-2xl border border-border divide-y divide-border">
          {dailyTotals.filter(d => d.count > 0).map(d => (
            <div key={d.chor} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[14px] text-content-primary">
                  {language === 'zh' ? CHOR_LABELS_ZH[d.chor] : `Chor ${d.chor}`}
                </p>
                <p className="text-[11px] text-content-tertiary mt-0.5">{d.count} {language === 'en' ? 'entries' : '条'}</p>
              </div>
              <span className="text-[15px] font-semibold text-content-primary">${d.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
