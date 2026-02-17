import { type ReactNode } from 'react'
import type { TabId } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

interface LayoutProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  children: ReactNode
}

export default function Layout({ activeTab, onTabChange, children }: LayoutProps) {
  const { language, toggleLanguage, t } = useLanguage()

  const navItems: { id: TabId; label: string }[] = [
    { id: 'dashboard', label: t('tabs.dashboard') },
    { id: 'chart', label: t('tabs.chart') },
    { id: 'add', label: '' },
    { id: 'rankings', label: t('tabs.rankings') },
    { id: 'more', label: t('tabs.more') },
  ]

  const NavIcon = ({ id, active }: { id: TabId; active: boolean }) => {
    switch (id) {
      case 'dashboard':
        return (
          <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.5} className="w-[22px] h-[22px]">
            {active ? (
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 01-.53 1.28H18.75v7.44a.75.75 0 01-.75.75h-3.75a.75.75 0 01-.75-.75V16.5h-3v4.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-7.44H2.31a.75.75 0 01-.53-1.28l8.69-8.69z" />
            ) : (
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        )
      case 'chart':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} className="w-[22px] h-[22px]">
            <path d="M7 20V4m5 16V10m5 10V8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'rankings':
        return (
          <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth={1.5} className="w-[22px] h-[22px]">
            {active ? (
              <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a.75.75 0 000 1.5h12.75a.75.75 0 000-1.5h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.707 6.707 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744z" clipRule="evenodd" />
            ) : (
              <path d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375C18.5 12.182 16.318 10 13.625 10h-3.25C7.682 10 5.5 12.182 5.5 14.875V18.75m13 0h-13M12 3v3" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        )
      case 'more':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} className="w-[22px] h-[22px]">
            <path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm5.25 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm5.25 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" strokeLinecap="round" strokeLinejoin="round" />
            {active && (
              <>
                <circle cx="6" cy="12" r="1" fill="currentColor" stroke="none" />
                <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
                <circle cx="18" cy="12" r="1" fill="currentColor" stroke="none" />
              </>
            )}
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      {/* Header */}
      <header className="bg-cny-red">
        <div className="px-6 pt-[max(env(safe-area-inset-top),12px)] pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[17px] font-semibold text-white tracking-[-0.025em]">
                {t('appName')}
              </h1>
              <p className="text-white/40 text-[11px] font-medium mt-0.5 tracking-wide">
                {t('appNameSub')}
              </p>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-[10px] text-[11px] font-semibold text-white/80
                         border border-white/20 active:bg-white/10 transition-colors"
            >
              {language === 'en' ? '中文' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom Navigation — Wise-clean with CNY red */}
      <nav className="fixed bottom-0 left-0 right-0 bg-cny-red pb-safe z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto px-2 pt-2 relative">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            const isAdd = item.id === 'add'

            if (isAdd) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange('add')}
                  className="relative -mt-6 flex items-center justify-center"
                >
                  <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center
                                   border-[3px] border-cny-red transition-all duration-200 active:scale-90
                                   ${isActive
                                     ? 'bg-cny-gold shadow-[0_4px_12px_rgba(217,119,6,0.3)]'
                                     : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                   }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={isActive ? 'white' : '#B91C1C'} strokeWidth={2.5} className="w-6 h-6">
                      <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center gap-1 py-2 px-3 transition-colors duration-200"
              >
                <div className={isActive ? 'text-white' : 'text-white/40'}>
                  <NavIcon id={item.id} active={isActive} />
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${
                  isActive ? 'text-white' : 'text-white/40'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
