import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/i18n'

const SUPPORTED = ['en', 'ar']

/**
 * Apply document direction + language attributes for a given language.
 * Mirrors the approach used by themeStore.applyTheme so SSR/no-DOM is safe.
 */
const applyDirection = (lang) => {
  if (typeof document === 'undefined') return
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('dir', dir)
}

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      lang: 'en',

      setLang: (lang) => {
        if (!SUPPORTED.includes(lang)) return
        applyDirection(lang)
        i18n.changeLanguage(lang)
        set({ lang })
      },

      toggleLang: () => {
        const next = get().lang === 'ar' ? 'en' : 'ar'
        get().setLang(next)
      },
    }),
    {
      name: 'lang-storage',
      onRehydrateStorage: () => (state) => {
        if (state) applyDirection(state.lang)
      },
    },
  ),
)
