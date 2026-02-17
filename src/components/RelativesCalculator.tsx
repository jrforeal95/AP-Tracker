import { useState, useMemo } from 'react'
import relationship from 'relationship.js'
import { haptic } from '../utils/haptic'
import { useLanguage } from '../i18n/LanguageContext'

interface RelativesCalculatorProps {
  onClose: () => void
}

const RELATION_BUTTONS = [
  { label: '爸爸', en: 'Father', emoji: '👨' },
  { label: '妈妈', en: 'Mother', emoji: '👩' },
  { label: '哥哥', en: 'Elder Bro', emoji: '👦' },
  { label: '弟弟', en: 'Young Bro', emoji: '👦' },
  { label: '姐姐', en: 'Elder Sis', emoji: '👧' },
  { label: '妹妹', en: 'Young Sis', emoji: '👧' },
  { label: '儿子', en: 'Son', emoji: '👶' },
  { label: '女儿', en: 'Daughter', emoji: '👶' },
  { label: '老公', en: 'Husband', emoji: '💑' },
  { label: '老婆', en: 'Wife', emoji: '💑' },
]

// Pinyin lookup for common kinship terms returned by relationship.js
const PINYIN_MAP: Record<string, string> = {
  // Input terms (also appear in outputs)
  '爸爸': 'bàba', '妈妈': 'māma', '哥哥': 'gēge', '弟弟': 'dìdi',
  '姐姐': 'jiějie', '妹妹': 'mèimei', '儿子': 'érzi', '女儿': 'nǚ\'ér',
  '老公': 'lǎogōng', '老婆': 'lǎopó',
  // Grandparents
  '爷爷': 'yéye', '奶奶': 'nǎinai', '外公': 'wàigōng', '外婆': 'wàipó',
  '姥爷': 'lǎoyé', '姥姥': 'lǎolao',
  // Great-grandparents
  '太爷爷': 'tàiyéye', '太奶奶': 'tàinǎinai', '太外公': 'tàiwàigōng', '太外婆': 'tàiwàipó',
  // Parents' siblings
  '伯伯': 'bóbo', '叔叔': 'shūshu', '姑姑': 'gūgu', '姑妈': 'gūmā', '姑父': 'gūfu',
  '舅舅': 'jiùjiu', '舅妈': 'jiùmā', '阿姨': 'āyí', '姨妈': 'yímā', '姨父': 'yífu',
  '伯母': 'bómǔ', '婶婶': 'shěnshen',
  // Cousins (paternal)
  '堂哥': 'tánggē', '堂弟': 'tángdì', '堂姐': 'tángjiě', '堂妹': 'tángmèi',
  // Cousins (maternal)
  '表哥': 'biǎogē', '表弟': 'biǎodì', '表姐': 'biǎojiě', '表妹': 'biǎomèi',
  // Children & grandchildren
  '孙子': 'sūnzi', '孙女': 'sūnnǚ', '外孙': 'wàisūn', '外孙女': 'wàisūnnǚ',
  // In-laws
  '公公': 'gōnggong', '婆婆': 'pópo', '岳父': 'yuèfù', '岳母': 'yuèmǔ',
  '嫂子': 'sǎozi', '弟妹': 'dìmèi', '姐夫': 'jiěfu', '妹夫': 'mèifu',
  '儿媳': 'érxí', '女婿': 'nǚxù', '媳妇': 'xífù',
  // Extended
  '大伯': 'dàbó', '小叔': 'xiǎoshū', '大姑': 'dàgū', '小姑': 'xiǎogū',
  '大舅': 'dàjiù', '小舅': 'xiǎojiù', '大姨': 'dàyí', '小姨': 'xiǎoyí',
  '侄子': 'zhízi', '侄女': 'zhínǚ', '外甥': 'wàishēng', '外甥女': 'wàishēngnǚ',
  // Great-uncles/aunts
  '舅公': 'jiùgōng', '舅婆': 'jiùpó', '姑婆': 'gūpó', '姨婆': 'yípó',
  '伯公': 'bógōng', '叔公': 'shūgōng', '姑公': 'gūgōng',
  // Self reference
  '自己': 'zìjǐ',
  // Misc
  '连襟': 'liángjīn', '妯娌': 'zhóuli',
  '太姥爷': 'tàilǎoyé', '太姥姥': 'tàilǎolao',
  '曾孙': 'zēngsūn', '曾孙女': 'zēngsūnnǚ',
  '玄孙': 'xuánsūn', '玄孙女': 'xuánsūnnǚ',
}

function getPinyin(term: string): string | null {
  return PINYIN_MAP[term] ?? null
}

export default function RelativesCalculator({ onClose }: RelativesCalculatorProps) {
  const [chain, setChain] = useState<string[]>([])
  const { t } = useLanguage()

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
            <h3 className="text-[17px] font-semibold text-content-primary">{t('relatives.title')}</h3>
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
              <p className="text-[13px] text-content-tertiary">{t('relatives.placeholder')}</p>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[14px] font-medium text-content-secondary">{t('relatives.me')}</span>
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
              <p className="text-[11px] font-semibold text-cny-red uppercase tracking-widest mb-2">{t('relatives.result')}</p>
              <p className="text-[24px] font-bold text-cny-red tracking-[-0.02em]">
                {result[0]}
              </p>
              {getPinyin(result[0]) && (
                <p className="text-[14px] text-cny-red/60 mt-1 italic">
                  {getPinyin(result[0])}
                </p>
              )}
              {result.length > 1 && (
                <p className="text-[12px] text-cny-red/70 mt-2">
                  {t('relatives.alsoKnown')}{result.slice(1).map((r, i) => (
                    <span key={i}>
                      {i > 0 && '、'}{r}{getPinyin(r) ? ` (${getPinyin(r)})` : ''}
                    </span>
                  ))}
                </p>
              )}
            </div>
          )}

          {chain.length > 0 && !result && (
            <div className="bg-cny-gold-50 rounded-2xl p-5 border border-cny-gold/15 animate-fade-in">
              <p className="text-[13px] text-cny-gold font-medium">
                {t('relatives.noResult')}
              </p>
            </div>
          )}

          {/* Relation Buttons */}
          <div>
            <p className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-3">
              {t('relatives.selectRelation')}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {RELATION_BUTTONS.map(btn => (
                <button
                  key={btn.label}
                  onClick={() => addRelation(btn.label)}
                  className="bg-white border border-border rounded-2xl py-2.5 px-1 flex flex-col items-center gap-1
                             active:bg-gray-50 active:scale-95 transition-all"
                >
                  <span className="text-lg">{btn.emoji}</span>
                  <span className="text-[11px] font-medium text-content-primary leading-tight">{btn.label}</span>
                  <span className="text-[9px] text-content-tertiary leading-tight">{btn.en}</span>
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
                {t('relatives.undo')}
              </button>
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-2xl text-[14px] font-medium text-red-600
                           border border-red-200 active:bg-red-50 transition-colors"
              >
                {t('relatives.reset')}
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
