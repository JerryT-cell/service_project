/**
 * Équivalent frontend du Service : ce hook orchestre le chargement, l'erreur
 * et le rafraîchissement. La page consomme un état prêt à afficher sans porter
 * elle-même le cycle de vie asynchrone.
 */
import { useCallback, useEffect, useState } from 'react'

import { searchArtisans } from './api'
import type { ArtisanResume, ArtisanSearchParams } from './types'

export function useArtisans(params: ArtisanSearchParams) {
  const [artisans, setArtisans] = useState<ArtisanResume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const ville = params.ville
  const categorie = params.categorie

  const retry = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  useEffect(() => {
    let actif = true

    async function chargerArtisans() {
      setLoading(true)
      setError(null)

      try {
        const resultat = await searchArtisans({ ville, categorie })

        if (actif) {
          setArtisans(resultat)
        }
      } catch (cause) {
        if (actif) {
          setArtisans([])
          setError(
            cause instanceof Error
              ? cause
              : new Error('Impossible de charger les artisans.'),
          )
        }
      } finally {
        if (actif) {
          setLoading(false)
        }
      }
    }

    void chargerArtisans()

    return () => {
      actif = false
    }
  }, [categorie, refreshKey, ville])

  return { artisans, loading, error, retry }
}
