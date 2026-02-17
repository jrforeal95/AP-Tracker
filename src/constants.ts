import type { Category } from './types'

// CNY 2026: Feb 17 (Chor 1) to Mar 3 (Chor 15)
export const CHOR_DATES: Record<number, string> = {
  1: '2026-02-17',
  2: '2026-02-18',
  3: '2026-02-19',
  4: '2026-02-20',
  5: '2026-02-21',
  6: '2026-02-22',
  7: '2026-02-23',
  8: '2026-02-24',
  9: '2026-02-25',
  10: '2026-02-26',
  11: '2026-02-27',
  12: '2026-02-28',
  13: '2026-03-01',
  14: '2026-03-02',
  15: '2026-03-03',
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
