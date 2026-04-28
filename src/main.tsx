import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProvider } from './context/AppContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              borderRadius: '16px',
            },
          }}
        />
        <App />
      </AppProvider>
    </HashRouter>
  </StrictMode>,
)
