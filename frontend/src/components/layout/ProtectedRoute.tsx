/**
 * Garde des routes privées. Entourez une page avec ce composant pour attendre
 * la session puis rediriger les visiteurs non connectés vers la connexion.
 */
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthentifie, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-16" aria-label="Chargement de la session">
        <Skeleton className="h-10 w-2/3 rounded-none" />
        <Skeleton className="h-5 w-full rounded-none" />
        <Skeleton className="h-64 w-full rounded-none" />
      </div>
    )
  }

  if (!isAuthentifie) {
    return <Navigate replace state={{ from: location }} to="/connexion" />
  }

  return children
}
