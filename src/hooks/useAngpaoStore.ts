import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../constants'
import type { AngpaoEntry, Category, QueuedAngpao } from '../types'
import { getChorFromDate, formatDate } from '../utils/chor'
import * as stats from '../utils/stats'

export function useAngpaoStore() {
  const [entries, setEntries] = useLocalStorage<AngpaoEntry[]>(STORAGE_KEYS.entries, [])
  const [queuedItems, setQueuedItems] = useLocalStorage<QueuedAngpao[]>(STORAGE_KEYS.queue, [])

  const addEntry = useCallback((amount: number, from: string, category: Category, chor?: number, note?: string) => {
    const now = new Date()
    const date = formatDate(now)
    const entry: AngpaoEntry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount,
      from: from.trim(),
      category,
      chor: chor ?? getChorFromDate(now) ?? 1,
      date,
      createdAt: Date.now(),
      ...(note?.trim() ? { note: note.trim() } : {}),
    }
    setEntries(prev => [entry, ...prev])
    return entry
  }, [setEntries])

  const editEntry = useCallback((id: string, updates: Partial<Pick<AngpaoEntry, 'amount' | 'from' | 'category' | 'chor' | 'note'>>) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      return {
        ...e,
        ...(updates.amount !== undefined ? { amount: updates.amount } : {}),
        ...(updates.from !== undefined ? { from: updates.from.trim() } : {}),
        ...(updates.category !== undefined ? { category: updates.category } : {}),
        ...(updates.chor !== undefined ? { chor: updates.chor } : {}),
        ...(updates.note !== undefined ? { note: updates.note.trim() || undefined } : {}),
      }
    }))
  }, [setEntries])

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [setEntries])

  const importEntries = useCallback((imported: AngpaoEntry[]) => {
    setEntries(imported)
  }, [setEntries])

  const addToQueue = useCallback((photo: string, from: string) => {
    const item: QueuedAngpao = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      photo,
      from: from.trim(),
      createdAt: Date.now(),
    }
    setQueuedItems(prev => [item, ...prev])
    return item
  }, [setQueuedItems])

  const removeFromQueue = useCallback((id: string) => {
    setQueuedItems(prev => prev.filter(q => q.id !== id))
  }, [setQueuedItems])

  const totalAmount = useMemo(() => stats.getTotalAmount(entries), [entries])
  const todayEntries = useMemo(() => stats.getTodayEntries(entries), [entries])
  const rankings = useMemo(() => stats.getRankings(entries), [entries])
  const categoryBreakdown = useMemo(() => stats.getCategoryBreakdown(entries), [entries])
  const dailyTotals = useMemo(() => stats.getDailyTotals(entries), [entries])
  const projection = useMemo(() => stats.getProjection(entries), [entries])
  const biggestAngpao = useMemo(() => stats.getBiggestAngpao(entries), [entries])
  const dailyAverage = useMemo(() => stats.getDailyAverage(entries), [entries])
  const recentContacts = useMemo(() => stats.getRecentContacts(entries), [entries])

  return {
    entries,
    addEntry,
    editEntry,
    deleteEntry,
    importEntries,
    queuedItems,
    addToQueue,
    removeFromQueue,
    totalAmount,
    todayEntries,
    rankings,
    categoryBreakdown,
    dailyTotals,
    projection,
    biggestAngpao,
    dailyAverage,
    recentContacts,
  }
}
