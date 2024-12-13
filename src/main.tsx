import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './style.css'

import { LangueProvider } from './contexts/langue.context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangueProvider>
      <App/>
    </LangueProvider>
  </StrictMode>,
)
