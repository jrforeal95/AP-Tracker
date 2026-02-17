import { createContext, useContext, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../constants'
import type { Language } from '../types'
import en from './en.json'
import zh from './zh.json'

const translations = { en, zh } as const

type TranslationKeys = typeof en

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (path: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>(STORAGE_KEYS.language, 'en')

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en')
  }, [setLanguage])

  const t = useCallback((path: string, vars?: Record<string, string | number>): string => {
    let result = getNestedValue(translations[language] as TranslationKeys, path)
    if (vars) {
      for (const [key, value] of Object.entries(vars)) {
        result = result.replace(`{${key}}`, String(value))
      }
    }
    return result
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
