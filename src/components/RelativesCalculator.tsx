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

// Character-level pinyin for building pronunciation of ANY compound kinship term.
// When a term isn't in PINYIN_MAP above, we construct pinyin character-by-character.
const CHAR_PINYIN: Record<string, string> = {
  // Core family
  '父': 'fù', '母': 'mǔ', '兄': 'xiōng', '弟': 'dì', '姐': 'jiě', '妹': 'mèi',
  '子': 'zǐ', '女': 'nǚ', '夫': 'fū', '妻': 'qī', '儿': 'ér', '男': 'nán',
  // Informal parents
  '爸': 'bà', '妈': 'mā', '爹': 'diē', '娘': 'niáng',
  // Grandparents & in-laws
  '爷': 'yé', '奶': 'nǎi', '公': 'gōng', '婆': 'pó', '翁': 'wēng',
  '姥': 'lǎo', '岳': 'yuè', '丈': 'zhàng',
  // Aunts & uncles
  '姑': 'gū', '舅': 'jiù', '叔': 'shū', '伯': 'bó', '姨': 'yí',
  // Spouses & in-laws
  '嫂': 'sǎo', '婿': 'xù', '媳': 'xí', '妇': 'fù', '婶': 'shěn',
  '妗': 'jìn', '壻': 'xù',
  // Niece/nephew/cousin modifiers
  '侄': 'zhí', '甥': 'shēng', '堂': 'táng', '表': 'biǎo',
  // Generational prefixes
  '孙': 'sūn', '曾': 'zēng', '玄': 'xuán', '太': 'tài', '外': 'wài',
  '高': 'gāo', '祖': 'zǔ', '重': 'chóng', '元': 'yuán',
  // Kinship system
  '亲': 'qīn', '家': 'jiā', '姻': 'yīn', '眷': 'juàn', '妯': 'zhóu',
  '娌': 'lǐ', '连': 'lián', '襟': 'jīn', '配': 'pèi', '偶': 'ǒu',
  // Size/order modifiers
  '大': 'dà', '小': 'xiǎo', '老': 'lǎo', '长': 'zhǎng', '幼': 'yòu',
  '少': 'shào', '仲': 'zhòng', '季': 'jì',
  // Extended/remote kinship
  '从': 'cóng', '族': 'zú', '远': 'yuǎn', '再': 'zài', '世': 'shì',
  '房': 'fáng', '门': 'mén', '胞': 'bāo', '同': 'tóng', '嗣': 'sì',
  '嫡': 'dí', '内': 'nèi',
  // Alternate/dialectal
  '哥': 'gē', '姆': 'mǔ', '阿': 'ā', '仔': 'zǎi', '崽': 'zǎi',
  '伢': 'yá', '囝': 'jiǎn', '囡': 'nān', '娃': 'wá', '嗲': 'diā',
  '嘎': 'gā', '嬷': 'mó', '嫲': 'mā', '嬢': 'niáng', '娭': 'āi',
  '毑': 'jiě', '娣': 'dì', '姒': 'sì', '娅': 'yà',
  '姊': 'zǐ', '媪': 'ǎo', '嫜': 'zhāng', '乸': 'nǎ',
  // People/person words
  '人': 'rén', '郎': 'láng', '息': 'xī', '官': 'guān', '客': 'kè',
  // Descriptor characters
  '新': 'xīn', '先': 'xiān', '半': 'bàn', '干': 'gān', '恩': 'ēn',
  '乖': 'guāi', '好': 'hǎo', '贤': 'xián', '爱': 'ài',
  '良': 'liáng', '慈': 'cí',
  // Structural/misc
  '辈': 'bèi', '自': 'zì', '己': 'jǐ', '的': 'de',
  '闺': 'guī', '宝': 'bǎo', '贝': 'bèi', '膀': 'bǎng',
  // Numbers (for birth order terms)
  '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ',
  '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
  // Generational depth
  '天': 'tiān', '烈': 'liè', '鼻': 'bí', '开': 'kāi', '始': 'shǐ',
  '来': 'lái', '耳': 'ěr', '仍': 'réng', '云': 'yún',
  '晜': 'kūn', '胎': 'tāi', '承': 'chéng', '礽': 'réng', '裔': 'yì',
  // Misc coverage
  '几': 'jǐ', '依': 'yī', '佬': 'lǎo', '细': 'xì', '孩': 'hái',
  '尕': 'gǎ', '幺': 'yāo', '桥': 'qiáo', '亚': 'yà',
  '伴': 'bàn', '挑': 'tiāo', '倌': 'guān', '晚': 'wǎn', '汉': 'hàn',
  '头': 'tóu', '担': 'dān', '生': 'shēng', '口': 'kǒu',
  '泰': 'tài', '次': 'cì', '地': 'dì', '比': 'bǐ',
  '山': 'shān', '水': 'shuǐ', '发': 'fā', '友': 'yǒu',
  '金': 'jīn', '上': 'shàng', '后': 'hòu', '末': 'mò',
  '丫': 'yā', '满': 'mǎn', '尾': 'wěi', '我': 'wǒ',
  '们': 'men', '之': 'zhī', '吾': 'wú',
}

function getPinyin(term: string): string | null {
  // Tier 1: exact whole-term match (handles natural pinyin like 爸爸→bàba)
  if (PINYIN_MAP[term]) return PINYIN_MAP[term]
  // Tier 2: build pinyin character-by-character
  const parts: string[] = []
  for (const ch of term) {
    const py = CHAR_PINYIN[ch]
    if (!py) return null // unknown character → give up
    parts.push(py)
  }
  return parts.length > 0 ? parts.join(' ') : null
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
