import { CHOR_DATES } from '../constants'

const DATE_TO_CHOR = new Map<string, number>()
for (const [chor, date] of Object.entries(CHOR_DATES)) {
  DATE_TO_CHOR.set(date, Number(chor))
}

export function getChorFromDate(date: Date | string): number | null {
  const dateStr = typeof date === 'string' ? date : formatDate(date)
  return DATE_TO_CHOR.get(dateStr) ?? null
}

export function getTodayChor(): number | null {
  return getChorFromDate(new Date())
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getDateFromChor(chor: number): string | null {
  return CHOR_DATES[chor] ?? null
}

export function formatChorDate(chor: number, locale: 'en' | 'zh'): string {
  const dateStr = CHOR_DATES[chor]
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  if (locale === 'zh') {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getAllChors(): number[] {
  return Array.from({ length: 15 }, (_, i) => i + 1)
}
