import type { Category } from './types'

// CNY 2025: Jan 29 (Chor 1) to Feb 12 (Chor 15)
export const CHOR_DATES: Record<number, string> = {
  1: '2025-01-29',
  2: '2025-01-30',
  3: '2025-01-31',
  4: '2025-02-01',
  5: '2025-02-02',
  6: '2025-02-03',
  7: '2025-02-04',
  8: '2025-02-05',
  9: '2025-02-06',
  10: '2025-02-07',
  11: '2025-02-08',
  12: '2025-02-09',
  13: '2025-02-10',
  14: '2025-02-11',
  15: '2025-02-12',
}

export const CHOR_LABELS_ZH: Record<number, string> = {
  1: '初一', 2: '初二', 3: '初三', 4: '初四', 5: '初五',
  6: '初六', 7: '初七', 8: '初八', 9: '初九', 10: '初十',
  11: '十一', 12: '十二', 13: '十三', 14: '十四', 15: '十五 (元宵)',
}

export const PRESET_AMOUNTS = [10, 20, 50, 100, 200]

export const CATEGORIES: { id: Category; labelEn: string; labelZh: string; emoji: string }[] = [
  { id: 'father', labelEn: "Father's Side", labelZh: '父方', emoji: '👴' },
  { id: 'mother', labelEn: "Mother's Side", labelZh: '母方', emoji: '👵' },
  { id: 'friends', labelEn: 'Friends', labelZh: '朋友', emoji: '🧑‍🤝‍🧑' },
  { id: 'others', labelEn: 'Others', labelZh: '其他', emoji: '🧧' },
]

export const STORAGE_KEYS = {
  entries: 'angpao_entries',
  language: 'angpao_language',
  queue: 'angpao_queue',
} as const
