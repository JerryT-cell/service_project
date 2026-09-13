/**
 * Hook unique d’accès à l’authentification. Il renvoie l’utilisateur, l’état de
 * chargement et les actions de session, ou signale un provider manquant.
 */
import { useContext } from 'react'

import { AuthContext } from './authContextValue'

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider.')
  }

  return context
}
