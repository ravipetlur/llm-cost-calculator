import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { consumeShareUrl } from './lib/share'

// apply a shared #s= link to localStorage before React reads initial state
consumeShareUrl()

// a share link pasted into an already-open tab only changes the hash — reload so it applies
window.addEventListener('hashchange', () => {
  if (window.location.hash.startsWith('#s=')) window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
