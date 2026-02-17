import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { CoverPage, StatsPage, GiversPage, CategoryPage, BiggestPage, ClosingPage } from './RecapCard'
import type { RankingEntry, CategoryBreakdown, AngpaoEntry } from '../types'

interface RecapScreenProps {
  language: 'en' | 'zh'
  totalAmount: number
  entryCount: number
  giverCount: number
  dailyAverage: number
  projection: number
  topGivers: RankingEntry[]
  categoryBreakdown: CategoryBreakdown[]
  biggestAngpao: AngpaoEntry | null
  onClose: () => void
}

export default function RecapScreen({
  language,
  totalAmount,
  entryCount,
  giverCount,
  dailyAverage,
  projection,
  topGivers,
  categoryBreakdown,
  biggestAngpao,
  onClose,
}: RecapScreenProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [scale, setScale] = useState(0.45)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Build pages array — skip pages that have no data
  const pages = useMemo(() => {
    const p: { key: string; label: string }[] = [
      { key: 'cover', label: language === 'en' ? 'Cover' : '封面' },
      { key: 'stats', label: language === 'en' ? 'Stats' : '数据' },
    ]
    if (topGivers.length > 0) {
      p.push({ key: 'givers', label: language === 'en' ? 'Top Givers' : '排名' })
    }
    if (categoryBreakdown.length > 0) {
      p.push({ key: 'category', label: language === 'en' ? 'Categories' : '类别' })
    }
    if (biggestAngpao) {
      p.push({ key: 'biggest', label: language === 'en' ? 'Biggest' : '最大' })
    }
    p.push({ key: 'closing', label: language === 'en' ? 'Closing' : '结语' })
    return p
  }, [language, topGivers, categoryBreakdown, biggestAngpao])

  const totalPages = pages.length

  // Calculate scale to fit 540x960 card in viewport
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth - 32
      const vh = window.innerHeight - 180
      const scaleW = vw / 540
      const scaleH = vh / 960
      setScale(Math.min(scaleW, scaleH, 0.65))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Navigate pages
  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1) setCurrentPage(p => p + 1)
  }, [currentPage, totalPages])

  const goPrev = useCallback(() => {
    if (currentPage > 0) setCurrentPage(p => p - 1)
  }, [currentPage])

  // Handle tap zones — left 30% = prev, right 70% = next
  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const threshold = rect.width * 0.3
    if (x < threshold) goPrev()
    else goNext()
  }, [goNext, goPrev])

  // Capture current page
  const captureCurrentPage = useCallback(async (): Promise<Blob | null> => {
    const el = cardRefs.current[currentPage]
    if (!el) return null
    setGenerating(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el, {
        scale: 2, useCORS: true, backgroundColor: null,
        width: 540, height: 960,
      })
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1)
      })
    } catch {
      return null
    } finally {
      setGenerating(false)
    }
  }, [currentPage])

  const handleSave = async () => {
    const blob = await captureCurrentPage()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `angpao-recap-${pages[currentPage].key}.png`
    a.click()
    URL.revokeObjectURL(url)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleShare = async () => {
    const blob = await captureCurrentPage()
    if (!blob) return
    const file = new File([blob], `angpao-recap-${pages[currentPage].key}.png`, { type: 'image/png' })
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: language === 'en' ? 'My CNY 2025 Angpao Recap' : '我的 2025 新年红包回顾',
        })
        return
      } catch { /* cancelled */ }
    }
    handleSave()
  }

  // Set ref for a page
  const setCardRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[idx] = el
  }, [])

  // Render the card for a given page key
  const renderCard = (key: string, idx: number) => {
    switch (key) {
      case 'cover':
        return <CoverPage ref={setCardRef(idx)} language={language} totalAmount={totalAmount} />
      case 'stats':
        return <StatsPage ref={setCardRef(idx)} language={language} entryCount={entryCount}
          giverCount={giverCount} dailyAverage={dailyAverage} projection={projection} />
      case 'givers':
        return <GiversPage ref={setCardRef(idx)} language={language} topGivers={topGivers} />
      case 'category':
        return <CategoryPage ref={setCardRef(idx)} language={language} categoryBreakdown={categoryBreakdown} />
      case 'biggest':
        return <BiggestPage ref={setCardRef(idx)} language={language} biggestAngpao={biggestAngpao} />
      case 'closing':
        return <ClosingPage ref={setCardRef(idx)} language={language} totalAmount={totalAmount} />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col animate-fade-in">
      {/* Progress bar */}
      <div className="flex gap-1 px-3 pt-[max(env(safe-area-inset-top),8px)] pb-2">
        {pages.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/15">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: i < currentPage ? '100%' : i === currentPage ? '100%' : '0%',
                backgroundColor: i <= currentPage ? 'rgba(255,255,255,0.9)' : 'transparent',
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-[max(calc(env(safe-area-inset-top)+20px),28px)] right-3 w-9 h-9 rounded-full
                   bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors z-10"
      >
        <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>

      {/* Card container — tap to navigate */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={handleTap}
        style={{ padding: '8px 16px' }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            flexShrink: 0,
          }}
        >
          {renderCard(pages[currentPage].key, currentPage)}
        </div>
      </div>

      {/* Page indicator + action buttons */}
      <div className="px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
        {/* Page counter */}
        <div className="text-center mb-3">
          <span className="text-[11px] font-medium text-white/40">
            {currentPage + 1} / {totalPages}
          </span>
        </div>

        <div className="flex gap-2.5 max-w-[360px] mx-auto">
          <button
            onClick={handleSave}
            disabled={generating}
            className="flex-1 py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-semibold text-[13px]
                       active:scale-[0.97] active:bg-white/15 transition-all disabled:opacity-50
                       flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            {generating ? '...' : saved ? '✓' : (language === 'en' ? 'Save' : '保存')}
          </button>
          <button
            onClick={handleShare}
            disabled={generating}
            className="flex-1 py-3 rounded-2xl bg-white text-black font-semibold text-[13px]
                       active:scale-[0.97] active:bg-white/90 transition-all disabled:opacity-50
                       flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.474l6.733-3.367A2.52 2.52 0 0113 4.5z" />
            </svg>
            {generating ? '...' : (language === 'en' ? 'Share' : '分享')}
          </button>
        </div>

        {/* Tap hint */}
        <div className="text-center mt-3">
          <span className="text-[10px] text-white/25 font-medium">
            {language === 'en' ? 'Tap to continue' : '点击继续'}
          </span>
        </div>
      </div>
    </div>
  )
}
