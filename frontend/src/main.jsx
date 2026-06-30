import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/i18n'
import App from './App.jsx'

// Apply persisted theme before React mounts to prevent flash
try {
  const stored = JSON.parse(localStorage.getItem('theme-storage'))
  const theme = stored?.state?.theme ?? 'dark'
  if (theme === 'dark') document.documentElement.classList.add('dark')
} catch {
  document.documentElement.classList.add('dark')
}

// Apply persisted language direction before React mounts to prevent flash
try {
  const stored = JSON.parse(localStorage.getItem('lang-storage'))
  const lang = stored?.state?.lang ?? 'en'
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('dir', dir)
} catch {
  document.documentElement.setAttribute('lang', 'en')
  document.documentElement.setAttribute('dir', 'ltr')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
