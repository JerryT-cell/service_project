/**
 * Équivalent frontend du Repository : ce module connaît les routes HTTP et
 * transforme les critères de recherche en query string. Les composants ne
 * connaissent donc ni l'URL de l'API ni la manière d'effectuer une requête.
 */
import { get } from '@/lib/apiClient'

import type {
  ArtisanDetail,
  ArtisanResume,
  ArtisanSearchParams,
  Categorie,
} from './types'

export function searchArtisans(
  params: ArtisanSearchParams,
): Promise<ArtisanResume[]> {
  const query = new URLSearchParams()

  if (params.ville?.trim()) {
    query.set('ville', params.ville.trim())
  }

  if (params.categorie?.trim()) {
    query.set('categorie', params.categorie.trim())
  }

  const suffixe = query.size > 0 ? `?${query.toString()}` : ''
  return get<ArtisanResume[]>(`/api/artisans${suffixe}`)
}

export function getArtisanById(id: number): Promise<ArtisanDetail> {
  return get<ArtisanDetail>(`/api/artisans/${id}`)
}

export function getCategories(): Promise<Categorie[]> {
  return get<Categorie[]>('/api/categories')
}
