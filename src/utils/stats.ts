import type { AngpaoEntry, RankingEntry, CategoryBreakdown, DailyTotal, Category } from '../types'
import { CHOR_DATES } from '../constants'
import { getChorFromDate } from './chor'

export function getTotalAmount(entries: AngpaoEntry[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0)
}

export function getTodayEntries(entries: AngpaoEntry[]): AngpaoEntry[] {
  const today = new Date()
  const todayChor = getChorFromDate(today)
  if (!todayChor) return []
  return entries.filter(e => e.chor === todayChor)
}

export function getRankings(entries: AngpaoEntry[]): RankingEntry[] {
  const map = new Map<string, { total: number; count: number; biggest: number }>()

  for (const e of entries) {
    const existing = map.get(e.from) || { total: 0, count: 0, biggest: 0 }
    existing.total += e.amount
    existing.count += 1
    existing.biggest = Math.max(existing.biggest, e.amount)
    map.set(e.from, existing)
  }

  return Array.from(map.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.total - a.total)
}

export function getCategoryBreakdown(entries: AngpaoEntry[]): CategoryBreakdown[] {
  const total = getTotalAmount(entries)
  if (total === 0) return []

  const map = new Map<Category, { total: number; count: number }>()
  for (const e of entries) {
    const existing = map.get(e.category) || { total: 0, count: 0 }
    existing.total += e.amount
    existing.count += 1
    map.set(e.category, existing)
  }

  return Array.from(map.entries())
    .map(([category, stats]) => ({
      category,
      total: stats.total,
      percentage: Math.round((stats.total / total) * 100),
      count: stats.count,
    }))
    .sort((a, b) => b.total - a.total)
}

export function getDailyTotals(entries: AngpaoEntry[]): DailyTotal[] {
  const dailyMap = new Map<number, { total: number; count: number }>()

  for (const e of entries) {
    const existing = dailyMap.get(e.chor) || { total: 0, count: 0 }
    existing.total += e.amount
    existing.count += 1
    dailyMap.set(e.chor, existing)
  }

  let cumulative = 0
  const results: DailyTotal[] = []

  for (let chor = 1; chor <= 15; chor++) {
    const day = dailyMap.get(chor)
    const dayTotal = day?.total ?? 0
    cumulative += dayTotal
    results.push({
      chor,
      date: CHOR_DATES[chor],
      total: dayTotal,
      cumulative,
      count: day?.count ?? 0,
    })
  }

  return results
}

export function getProjection(entries: AngpaoEntry[]): number {
  if (entries.length === 0) return 0
  const total = getTotalAmount(entries)
  const chors = new Set(entries.map(e => e.chor))
  const daysTracked = chors.size
  if (daysTracked === 0) return 0
  const dailyAvg = total / daysTracked
  return Math.round(dailyAvg * 15)
}

export function getBiggestAngpao(entries: AngpaoEntry[]): AngpaoEntry | null {
  if (entries.length === 0) return null
  return entries.reduce((max, e) => e.amount > max.amount ? e : max, entries[0])
}

export function getDailyAverage(entries: AngpaoEntry[]): number {
  if (entries.length === 0) return 0
  const total = getTotalAmount(entries)
  const chors = new Set(entries.map(e => e.chor))
  return chors.size > 0 ? Math.round(total / chors.size) : 0
}

export function getRecentContacts(entries: AngpaoEntry[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt)
  for (const e of sorted) {
    if (!seen.has(e.from)) {
      seen.add(e.from)
      result.push(e.from)
    }
    if (result.length >= 10) break
  }
  return result
}
