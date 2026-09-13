/**
 * Définition interne du contexte d’authentification. Les composants utilisent
 * `useAuth` ; seul le provider écrit directement dans ce contexte.
 */
import { createContext } from 'react'

import type { LoginRequest, RegisterRequest, Utilisateur } from './types'

export interface AuthContextValue {
  utilisateur: Utilisateur | null
  isAuthentifie: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
