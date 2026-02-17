import { forwardRef } from 'react'
import type { RankingEntry, CategoryBreakdown, AngpaoEntry } from '../types'

// Shared base style for all story pages (9:16 ratio)
const BASE_STYLE: React.CSSProperties = {
  width: 540,
  height: 960,
  fontFamily: "'Inter', system-ui, sans-serif",
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
}

const GOLD = '#FBBF24'
const GOLD_DIM = 'rgba(251,191,36,0.6)'
const WHITE_60 = 'rgba(255,255,255,0.6)'
const WHITE_30 = 'rgba(255,255,255,0.3)'

// ─── Page 1: Cover ───
interface CoverProps { language: 'en' | 'zh'; totalAmount: number }
export const CoverPage = forwardRef<HTMLDivElement, CoverProps>(({ language, totalAmount }, ref) => (
  <div ref={ref} style={{
    ...BASE_STYLE,
    background: 'linear-gradient(160deg, #7F1D1D 0%, #991B1B 50%, #B91C1C 100%)',
    padding: '80px 48px',
  }}>
    {/* Gold glow top */}
    <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)' }} />
    {/* Gold glow bottom */}
    <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)' }} />

    <div style={{ fontSize: 64, marginBottom: 32 }}>🧧</div>
    <div style={{ fontSize: 16, color: WHITE_60, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.25em', marginBottom: 12 }}>
      CNY 2025
    </div>
    <div style={{ fontSize: 36, color: GOLD, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 48, textAlign: 'center' }}>
      {language === 'zh' ? '恭喜发财' : 'Gong Xi Fa Cai'}
    </div>

    <div style={{ fontSize: 14, color: WHITE_60, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
      {language === 'en' ? 'Total Collected' : '总收入'}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontSize: 36, color: GOLD_DIM, fontWeight: 600 }}>$</span>
      <span style={{ fontSize: 72, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {totalAmount.toLocaleString()}
      </span>
    </div>

    <div style={{ position: 'absolute', bottom: 48, fontSize: 12, color: WHITE_30, fontWeight: 500, letterSpacing: '0.08em' }}>
      🧧 Angpao Tracker
    </div>
  </div>
))
CoverPage.displayName = 'CoverPage'


// ─── Page 2: Stats Overview ───
interface StatsProps {
  language: 'en' | 'zh'; entryCount: number; giverCount: number
  dailyAverage: number; projection: number
}
export const StatsPage = forwardRef<HTMLDivElement, StatsProps>(
  ({ language, entryCount, giverCount, dailyAverage, projection }, ref) => {
    const stats = [
      { value: String(entryCount), label: language === 'en' ? 'Angpao Received' : '收到红包', emoji: '🧧' },
      { value: String(giverCount), label: language === 'en' ? 'Generous Givers' : '送红包的人', emoji: '🤝' },
      { value: `$${dailyAverage.toLocaleString()}`, label: language === 'en' ? 'Daily Average' : '日均收入', emoji: '📊' },
      { value: `$${projection.toLocaleString()}`, label: language === 'en' ? 'Projected Total' : '预计总额', emoji: '🚀' },
    ]
    return (
      <div ref={ref} style={{
        ...BASE_STYLE,
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
        padding: '80px 48px',
      }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(185,28,28,0.15) 0%, transparent 70%)' }} />

        <div style={{ fontSize: 14, color: 'rgba(248,113,113,0.8)', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.2em', marginBottom: 48, textAlign: 'center' }}>
          {language === 'en' ? 'Your Numbers' : '你的数据'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 20,
              padding: '28px 32px',
              display: 'flex', alignItems: 'center', gap: 24,
            }}>
              <span style={{ fontSize: 36 }}>{s.emoji}</span>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500, marginTop: 6 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: 48, fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500, letterSpacing: '0.08em' }}>
          🧧 Angpao Tracker
        </div>
      </div>
    )
  }
)
StatsPage.displayName = 'StatsPage'


// ─── Page 3: Top Givers ───
interface GiversProps { language: 'en' | 'zh'; topGivers: RankingEntry[] }
export const GiversPage = forwardRef<HTMLDivElement, GiversProps>(({ language, topGivers }, ref) => {
  const top5 = topGivers.slice(0, 5)
  const medals = ['🥇', '🥈', '🥉', '4', '5']

  return (
    <div ref={ref} style={{
      ...BASE_STYLE,
      background: 'linear-gradient(160deg, #78350F 0%, #92400E 50%, #A16207 100%)',
      padding: '80px 48px',
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300,
        background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />

      <div style={{ fontSize: 14, color: 'rgba(253,230,138,0.8)', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.2em', marginBottom: 16, textAlign: 'center' }}>
        {language === 'en' ? 'Top Givers' : '最佳红包'}
      </div>
      <div style={{ fontSize: 48, marginBottom: 48 }}>🏆</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        {top5.map((giver, i) => (
          <div key={giver.name} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: i === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: i === 0 ? '24px 24px' : '18px 24px',
            ...(i === 0 ? { border: '1px solid rgba(253,230,138,0.3)' } : {}),
          }}>
            <span style={{ fontSize: i < 3 ? 28 : 18, width: 40, textAlign: 'center',
              ...(i >= 3 ? { color: 'rgba(255,255,255,0.4)', fontWeight: 700 } : {}) }}>
              {medals[i]}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: i === 0 ? 18 : 15, fontWeight: 600, color: 'white' }}>{giver.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                {giver.count} {language === 'en' ? 'angpao' : '个红包'}
              </div>
            </div>
            <span style={{ fontSize: i === 0 ? 22 : 17, fontWeight: 800, color: '#FDE68A' }}>
              ${giver.total.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 48, fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500, letterSpacing: '0.08em' }}>
        🧧 Angpao Tracker
      </div>
    </div>
  )
})
GiversPage.displayName = 'GiversPage'


// ─── Page 4: Category Breakdown ───
const CATEGORY_COLORS: Record<string, string> = {
  father: '#EF4444', mother: '#F59E0B', friends: '#10B981', others: '#818CF8',
}
const CATEGORY_LABELS_EN: Record<string, string> = {
  father: "Father's Side", mother: "Mother's Side", friends: 'Friends', others: 'Others',
}
const CATEGORY_LABELS_ZH: Record<string, string> = {
  father: '父方', mother: '母方', friends: '朋友', others: '其他',
}
const CATEGORY_EMOJIS: Record<string, string> = {
  father: '👴', mother: '👵', friends: '🧑‍🤝‍🧑', others: '🧧',
}

interface CategoryProps { language: 'en' | 'zh'; categoryBreakdown: CategoryBreakdown[] }
export const CategoryPage = forwardRef<HTMLDivElement, CategoryProps>(({ language, categoryBreakdown }, ref) => (
  <div ref={ref} style={{
    ...BASE_STYLE,
    background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '80px 48px',
  }}>
    <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

    <div style={{ fontSize: 14, color: 'rgba(165,180,252,0.8)', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.2em', marginBottom: 48, textAlign: 'center' }}>
      {language === 'en' ? 'By Category' : '类别分布'}
    </div>

    {/* Stacked bar */}
    <div style={{ display: 'flex', height: 14, borderRadius: 7, overflow: 'hidden', width: '100%', marginBottom: 48 }}>
      {categoryBreakdown.map((cat) => (
        <div key={cat.category} style={{
          width: `${cat.percentage}%`, backgroundColor: CATEGORY_COLORS[cat.category] || '#818CF8',
          minWidth: cat.percentage > 0 ? 6 : 0,
        }} />
      ))}
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      {categoryBreakdown.map((cat) => (
        <div key={cat.category} style={{
          background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '22px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          borderLeft: `4px solid ${CATEGORY_COLORS[cat.category] || '#818CF8'}`,
        }}>
          <span style={{ fontSize: 28 }}>{CATEGORY_EMOJIS[cat.category] || '🧧'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>
              {language === 'en' ? CATEGORY_LABELS_EN[cat.category] : CATEGORY_LABELS_ZH[cat.category]}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              {cat.count} {language === 'en' ? 'angpao' : '个红包'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>${cat.total.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 2 }}>{cat.percentage}%</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ position: 'absolute', bottom: 48, fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500, letterSpacing: '0.08em' }}>
      🧧 Angpao Tracker
    </div>
  </div>
))
CategoryPage.displayName = 'CategoryPage'


// ─── Page 5: Biggest Angpao ───
interface BiggestProps { language: 'en' | 'zh'; biggestAngpao: AngpaoEntry | null }
export const BiggestPage = forwardRef<HTMLDivElement, BiggestProps>(({ language, biggestAngpao }, ref) => (
  <div ref={ref} style={{
    ...BASE_STYLE,
    background: 'linear-gradient(160deg, #7F1D1D 0%, #991B1B 50%, #B91C1C 100%)',
    padding: '80px 48px',
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.08) 0%, transparent 60%)' }} />

    <div style={{ fontSize: 14, color: 'rgba(253,230,138,0.8)', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.2em', marginBottom: 48, textAlign: 'center' }}>
      {language === 'en' ? 'Biggest Angpao' : '最大红包'}
    </div>

    <div style={{ fontSize: 80, marginBottom: 48 }}>🏆</div>

    {biggestAngpao ? (
      <>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 40, color: GOLD_DIM, fontWeight: 600 }}>$</span>
          <span style={{ fontSize: 80, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {biggestAngpao.amount.toLocaleString()}
          </span>
        </div>
        <div style={{ fontSize: 13, color: WHITE_60, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          {language === 'en' ? 'From' : '来自'}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: GOLD, textAlign: 'center' }}>
          {biggestAngpao.from}
        </div>
      </>
    ) : (
      <div style={{ fontSize: 18, color: WHITE_60, fontWeight: 500 }}>
        {language === 'en' ? 'No angpao yet' : '还没有红包'}
      </div>
    )}

    <div style={{ position: 'absolute', bottom: 48, fontSize: 12, color: WHITE_30, fontWeight: 500, letterSpacing: '0.08em' }}>
      🧧 Angpao Tracker
    </div>
  </div>
))
BiggestPage.displayName = 'BiggestPage'


// ─── Page 6: Closing ───
interface ClosingProps { language: 'en' | 'zh'; totalAmount: number }
export const ClosingPage = forwardRef<HTMLDivElement, ClosingProps>(({ language, totalAmount }, ref) => (
  <div ref={ref} style={{
    ...BASE_STYLE,
    background: 'linear-gradient(160deg, #7F1D1D 0%, #991B1B 50%, #B91C1C 100%)',
    padding: '80px 48px',
  }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)' }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: 250, height: 250, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)' }} />

    <div style={{ fontSize: 64, marginBottom: 40 }}>🎊</div>

    <div style={{ fontSize: 32, color: GOLD, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.3 }}>
      {language === 'zh' ? '新年快乐' : 'Happy New Year'}
    </div>
    <div style={{ fontSize: 15, color: WHITE_60, fontWeight: 500, textAlign: 'center', lineHeight: 1.6, maxWidth: 360, marginBottom: 48 }}>
      {language === 'en'
        ? `You collected $${totalAmount.toLocaleString()} this CNY! Wishing you prosperity and good fortune.`
        : `你在这个新年收到了 $${totalAmount.toLocaleString()}！祝你繁荣昌盛，万事如意。`
      }
    </div>

    <div style={{ fontSize: 13, color: WHITE_30, fontWeight: 500, letterSpacing: '0.08em' }}>
      🧧 Angpao Tracker · CNY 2025
    </div>
  </div>
))
ClosingPage.displayName = 'ClosingPage'
