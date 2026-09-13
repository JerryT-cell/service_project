/**
 * Accès réseau de la fonctionnalité d’authentification. Ce fichier connaît les
 * endpoints du backend mais délègue toujours l’appel HTTP au client centralisé.
 */
import { post } from '@/lib/apiClient'

import type { AuthResponse, LoginRequest, RegisterRequest } from './types'

export function login(data: LoginRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/api/auth/login', data)
}

export function register(data: RegisterRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/api/auth/register', data)
}
