/**
 * État global « qui est connecté ? ». Le provider restaure une session valide
 * au démarrage et rend cet état accessible uniquement au travers de `useAuth`.
 */
import { useEffect, useState, type ReactNode } from 'react'

import { TOKEN_STORAGE_KEY } from '@/lib/apiClient'

import { login as loginApi, register as registerApi } from './api'
import { AuthContext } from './authContextValue'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Utilisateur,
} from './types'

const UTILISATEUR_STORAGE_KEY = 'briko_utilisateur'

interface JwtPayload {
  exp?: number
  sub?: string
}

interface AuthProviderProps {
  children: ReactNode
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const morceaux = token.split('.')

  if (morceaux.length !== 3) {
    return null
  }

  try {
    const contenu = morceaux[1].replace(/-/g, '+').replace(/_/g, '/')
    const padding = '='.repeat((4 - (contenu.length % 4)) % 4)

    return JSON.parse(atob(`${contenu}${padding}`)) as JwtPayload
  } catch {
    return null
  }
}

function isTokenEncoreValide(token: string): boolean {
  const payload = decodeJwtPayload(token)

  return (
    typeof payload?.exp === 'number' && payload.exp * 1000 > Date.now()
  )
}

function lireUtilisateurStocke(): Utilisateur | null {
  const valeur = localStorage.getItem(UTILISATEUR_STORAGE_KEY)

  if (!valeur) {
    return null
  }

  try {
    return JSON.parse(valeur) as Utilisateur
  } catch {
    return null
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  function effacerSession() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(UTILISATEUR_STORAGE_KEY)
    setUtilisateur(null)
  }

  function enregistrerSession(
    response: AuthResponse,
    telephone: string,
  ) {
    const utilisateurConnecte: Utilisateur = {
      id: response.id,
      nom: response.nom,
      telephone,
      role: response.role,
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
    localStorage.setItem(
      UTILISATEUR_STORAGE_KEY,
      JSON.stringify(utilisateurConnecte),
    )
    setUtilisateur(utilisateurConnecte)
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    const utilisateurStocke = lireUtilisateurStocke()

    // Le navigateur vérifie seulement l’expiration. Le backend reste responsable
    // de vérifier la signature du JWT pour chaque requête protégée.
    if (token && utilisateurStocke && isTokenEncoreValide(token)) {
      // oxlint-disable-next-line react/set-state-in-effect -- Cet effet synchronise la session avec localStorage.
      setUtilisateur(utilisateurStocke)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(UTILISATEUR_STORAGE_KEY)
    }

    setIsLoading(false)
  }, [])

  async function login(data: LoginRequest) {
    const response = await loginApi(data)
    enregistrerSession(response, data.telephone)
  }

  async function register(data: RegisterRequest) {
    const response = await registerApi(data)
    enregistrerSession(response, data.telephone)
  }

  function logout() {
    effacerSession()
  }

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        isAuthentifie: utilisateur !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
