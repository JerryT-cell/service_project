/**
 * Ces types reproduisent les DTO publics du backend. Toute modification d'un
 * champ côté Java doit être répercutée ici afin de garder le contrat aligné.
 */
export interface ArtisanResume {
  id: number
  nomAffichage: string
  ville: string
  quartier: string | null
  categories: string[]
  noteMoyenne: number
  nombreAvis: number
  photoProfilUrl: string | null
  verifie: boolean
}

export interface ArtisanDetail extends ArtisanResume {
  description: string | null
  zoneIntervention: string | null
  anneesExperience: number | null
  telephone: string
  dateValidation: string | null
}

export interface ArtisanSearchParams {
  ville?: string
  categorie?: string
}

export interface Categorie {
  id: number
  nom: string
  slug: string
  description: string | null
  icone: string | null
}
