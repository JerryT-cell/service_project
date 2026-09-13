/**
 * Contrats TypeScript de l’authentification. Ils doivent rester synchronisés
 * avec les DTO `auth` du backend Spring Boot.
 */
export type RoleUtilisateur = 'CLIENT' | 'PRESTATAIRE' | 'ADMIN'

export interface LoginRequest {
  telephone: string
  motDePasse: string
}

export interface RegisterRequest {
  nom: string
  telephone: string
  email?: string
  motDePasse: string
  role: RoleUtilisateur
}

export interface AuthResponse {
  token: string
  id: number
  nom: string
  role: RoleUtilisateur
}

export interface Utilisateur {
  id: number
  nom: string
  telephone: string
  role: RoleUtilisateur
}
