import { useState, useMemo } from 'react'
import relationship from 'relationship.js'
import { haptic } from '../utils/haptic'

interface RelativesCalculatorProps {
  onClose: () => void
}

const RELATION_BUTTONS = [
  { label: '爸爸', emoji: '👨' },
  { label: '妈妈', emoji: '👩' },
  { label: '哥哥', emoji: '👦' },
  { label: '弟弟', emoji: '👦' },
  { label: '姐姐', emoji: '👧' },
  { label: '妹妹', emoji: '👧' },
  { label: '儿子', emoji: '👶' },
  { label: '女儿', emoji: '👶' },
  { label: '老公', emoji: '💑' },
  { label: '老婆', emoji: '💑' },
]

export default function RelativesCalculator({ onClose }: RelativesCalculatorProps) {
  const [chain, setChain] = useState<string[]>([])

  const result = useMemo(() => {
    if (chain.length === 0) return null
    try {
      const text = chain.join('的')
      const results = relationship({ text })
      return results.length > 0 ? results : null
    } catch {
      return null
    }
  }, [chain])

  const addRelation = (label: string) => {
    haptic()
    setChain(prev => [...prev, label])
  }

  const undo = () => {
    haptic()
    setChain(prev => prev.slice(0, -1))
  }

  const reset = () => {
    haptic()
    setChain([])
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle + Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl z-10 px-6 pt-4 pb-3 border-b border-border">
          <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-semibold text-content-primary">亲戚关系计算器</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-content-tertiary">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Chain Display */}
          <div className="bg-gray-50 rounded-2xl p-5 min-h-[72px] flex items-center">
            {chain.length === 0 ? (
              <p className="text-[13px] text-content-tertiary">点击下方按钮开始计算…</p>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[14px] font-medium text-content-secondary">我</span>
                {chain.map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="text-content-tertiary">→</span>
                    <span className="text-[14px] font-medium text-content-primary">{item}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Result Card */}
          {result && (
            <div className="bg-cny-red-50 rounded-2xl p-5 border border-cny-red/15 animate-fade-in">
              <p className="text-[11px] font-semibold text-cny-red uppercase tracking-widest mb-2">称呼</p>
              <p className="text-[24px] font-bold text-cny-red tracking-[-0.02em]">
                {result[0]}
              </p>
              {result.length > 1 && (
                <p className="text-[12px] text-cny-red/70 mt-2">
                  也叫：{result.slice(1).join('、')}
                </p>
              )}
            </div>
          )}

          {chain.length > 0 && !result && (
            <div className="bg-cny-gold-50 rounded-2xl p-5 border border-cny-gold/15 animate-fade-in">
              <p className="text-[13px] text-cny-gold font-medium">
                暂无结果，继续添加关系…
              </p>
            </div>
          )}

          {/* Relation Buttons */}
          <div>
            <p className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-3">
              选择关系
            </p>
            <div className="grid grid-cols-5 gap-2">
              {RELATION_BUTTONS.map(btn => (
                <button
                  key={btn.label}
                  onClick={() => addRelation(btn.label)}
                  className="bg-white border border-border rounded-2xl py-3 px-1 flex flex-col items-center gap-1.5
                             active:bg-gray-50 active:scale-95 transition-all"
                >
                  <span className="text-lg">{btn.emoji}</span>
                  <span className="text-[11px] font-medium text-content-primary">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Undo / Reset */}
          {chain.length > 0 && (
            <div className="flex gap-3 animate-fade-in">
              <button
                onClick={undo}
                className="flex-1 py-3 rounded-2xl text-[14px] font-medium text-content-secondary
                           border border-border active:bg-gray-50 transition-colors"
              >
                ← 撤销
              </button>
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-2xl text-[14px] font-medium text-red-600
                           border border-red-200 active:bg-red-50 transition-colors"
              >
                重置
              </button>
            </div>
          )}

          {/* Padding for bottom nav + safe area */}
          <div className="h-24" />
          <div className="pb-safe" />
        </div>
      </div>
    </div>
  )
}
