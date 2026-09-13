/**
 * Service de lecture d'un profil : il isole le chargement de la fiche et son
 * état réseau afin que l'écran reste consacré à la présentation du contenu.
 */
import { useCallback, useEffect, useState } from 'react'

import { getArtisanById } from './api'
import type { ArtisanDetail } from './types'

export function useArtisan(id: number | undefined) {
  const [artisan, setArtisan] = useState<ArtisanDetail | null>(null)
  const [loading, setLoading] = useState(id !== undefined)
  const [error, setError] = useState<Error | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const retry = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  useEffect(() => {
    let actif = true

    async function chargerArtisan(artisanId: number) {
      setLoading(true)
      setError(null)

      try {
        const resultat = await getArtisanById(artisanId)

        if (actif) {
          setArtisan(resultat)
        }
      } catch (cause) {
        if (actif) {
          setArtisan(null)
          setError(
            cause instanceof Error
              ? cause
              : new Error("Impossible de charger le profil de l'artisan."),
          )
        }
      } finally {
        if (actif) {
          setLoading(false)
        }
      }
    }

    if (id !== undefined) {
      void chargerArtisan(id)
    }

    return () => {
      actif = false
    }
  }, [id, refreshKey])

  return { artisan, loading, error, retry }
}
