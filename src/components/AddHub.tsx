import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { haptic } from '../utils/haptic'
import AddEntry from './AddEntry'
import SaveForLater from './SaveForLater'
import ReviewQueue from './ReviewQueue'
import type { AngpaoEntry, Category, QueuedAngpao, TabId } from '../types'

type HubMode = 'hub' | 'record' | 'save' | 'review'

interface AddHubProps {
  recentContacts: string[]
  queuedItems: QueuedAngpao[]
  onSave: (amount: number, from: string, category: Category, chor?: number, note?: string) => void
  onUpdate?: (id: string, updates: Partial<Pick<AngpaoEntry, 'amount' | 'from' | 'category' | 'chor' | 'note'>>) => void
  editingEntry?: AngpaoEntry | null
  onCancelEdit?: () => void
  onAddToQueue: (photo: string, from: string) => void
  onRemoveFromQueue: (id: string) => void
  onNavigate: (tab: TabId) => void
}

export default function AddHub({
  recentContacts,
  queuedItems,
  onSave,
  onUpdate,
  editingEntry,
  onCancelEdit,
  onAddToQueue,
  onRemoveFromQueue,
  onNavigate,
}: AddHubProps) {
  const { language } = useLanguage()
  const [mode, setMode] = useState<HubMode>('hub')
  const [reviewItem, setReviewItem] = useState<QueuedAngpao | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Auto-switch to record mode when editing
  useEffect(() => {
    if (editingEntry) {
      setMode('record')
    }
  }, [editingEntry])

  const handleReview = (item: QueuedAngpao) => {
    setReviewItem(item)
    setMode('review')
  }

  const handleBack = () => {
    setMode('hub')
    setReviewItem(null)
  }

  // Record Opened mode → show existing AddEntry
  if (mode === 'record') {
    return (
      <div>
        <div className="px-6 pt-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-[13px] font-medium text-content-tertiary active:opacity-70 transition-opacity"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            {language === 'en' ? 'Back' : '返回'}
          </button>
        </div>
        <AddEntry
          recentContacts={recentContacts}
          onSave={onSave}
          onUpdate={onUpdate}
          editingEntry={editingEntry}
          onCancelEdit={() => {
            if (onCancelEdit) onCancelEdit()
            handleBack()
          }}
          onNavigate={onNavigate}
        />
      </div>
    )
  }

  // Save for Later mode
  if (mode === 'save') {
    return (
      <SaveForLater
        onSave={onAddToQueue}
        onBack={handleBack}
      />
    )
  }

  // Review mode
  if (mode === 'review' && reviewItem) {
    return (
      <ReviewQueue
        item={reviewItem}
        onSave={onSave}
        onRemoveFromQueue={onRemoveFromQueue}
        onBack={handleBack}
      />
    )
  }

  // Hub mode — default view
  return (
    <div className="px-6 py-6 space-y-6 animate-fade-in">
      {/* Pending Queue */}
      {queuedItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest">
              {language === 'en' ? 'Unopened' : '未开封'}
            </h3>
            <span className="text-[11px] font-medium text-cny-red">
              {queuedItems.length} {language === 'en' ? 'pending' : '个待开'}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {queuedItems.map(item => (
              <div key={item.id} className="flex-shrink-0 w-[100px] relative">
                <button
                  onClick={() => handleReview(item)}
                  className="w-full bg-white rounded-2xl border border-border overflow-hidden
                             active:scale-[0.97] transition-transform"
                >
                  <img
                    src={item.photo}
                    alt={item.from}
                    className="w-full h-[80px] object-cover"
                  />
                  <div className="px-2.5 py-2">
                    <p className="text-[11px] font-medium text-content-primary truncate">{item.from}</p>
                  </div>
                </button>
                {/* Delete button */}
                {confirmDeleteId === item.id ? (
                  <div className="absolute -top-1.5 -right-1.5 flex gap-1 z-10">
                    <button
                      onClick={() => {
                        haptic()
                        onRemoveFromQueue(item.id)
                        setConfirmDeleteId(null)
                      }}
                      className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md
                                 active:bg-red-600 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center shadow-md
                                 active:bg-gray-500 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center
                               shadow-md active:bg-black/70 transition-colors z-10"
                  >
                    <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div>
        <h3 className="text-[11px] font-semibold text-content-tertiary uppercase tracking-widest mb-4">
          {language === 'en' ? 'What would you like to do?' : '你想做什么？'}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Record Opened */}
          <button
            onClick={() => setMode('record')}
            className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center gap-4
                       active:bg-gray-50 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-cny-red-50 flex items-center justify-center">
              <span className="text-2xl">🧧</span>
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold text-content-primary">
                {language === 'en' ? 'Record' : '记录'}
              </p>
              <p className="text-[14px] font-semibold text-content-primary">
                {language === 'en' ? 'Opened' : '已开封'}
              </p>
              <p className="text-[11px] text-content-tertiary mt-1.5">
                {language === 'en' ? 'Enter amount now' : '现在输入金额'}
              </p>
            </div>
          </button>

          {/* Save for Later */}
          <button
            onClick={() => setMode('save')}
            className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center gap-4
                       active:bg-gray-50 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-cny-gold-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={1.5} className="w-7 h-7">
                <path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold text-content-primary">
                {language === 'en' ? 'Save for' : '稍后'}
              </p>
              <p className="text-[14px] font-semibold text-content-primary">
                {language === 'en' ? 'Later' : '打开'}
              </p>
              <p className="text-[11px] text-content-tertiary mt-1.5">
                {language === 'en' ? 'Photo + name first' : '先拍照记名'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Empty state hint when no queue */}
      {queuedItems.length === 0 && (
        <div className="text-center pt-8 pb-4">
          <p className="text-[13px] text-content-tertiary leading-relaxed max-w-[240px] mx-auto">
            {language === 'en'
              ? 'Received angpao but not opening yet? Save a photo first and record the amount later!'
              : '收到红包但还没开？先拍照记录，稍后再填金额！'
            }
          </p>
        </div>
      )}
    </div>
  )
}
