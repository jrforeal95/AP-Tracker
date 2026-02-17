export interface AngpaoEntry {
  id: string
  amount: number
  from: string
  category: Category
  chor: number
  date: string // ISO date string YYYY-MM-DD
  createdAt: number // timestamp
}

export type Category = 'father' | 'mother' | 'friends' | 'others'

export type TabId = 'dashboard' | 'add' | 'chart' | 'rankings' | 'more'

export type Language = 'en' | 'zh'

export interface RankingEntry {
  name: string
  total: number
  count: number
  biggest: number
}

export interface CategoryBreakdown {
  category: Category
  total: number
  percentage: number
  count: number
}

export interface DailyTotal {
  chor: number
  date: string
  total: number
  cumulative: number
  count: number
}

export interface QueuedAngpao {
  id: string
  photo: string      // base64 data URL
  from: string
  createdAt: number
}
