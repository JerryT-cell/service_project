/**
 * Point d’entrée React. Il monte l’application dans la page HTML et ne doit
 * contenir aucune logique métier ni configuration de fonctionnalité.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
