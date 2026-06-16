import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply persisted theme before React mounts to prevent flash
try {
  const stored = JSON.parse(localStorage.getItem('theme-storage'))
  const theme = stored?.state?.theme ?? 'dark'
  if (theme === 'dark') document.documentElement.classList.add('dark')
} catch {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
