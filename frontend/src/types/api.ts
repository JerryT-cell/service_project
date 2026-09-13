/**
 * Types communs aux échanges avec le backend. Ils décrivent uniquement les
 * structures partagées ; les réponses métier restent dans leur fonctionnalité.
 */
export interface ApiError {
  timestamp: string
  status: number
  erreur: string
  message: string
  chemin: string
  champs?: Record<string, string>
}
