/**
 * Client HTTP centralisé : c'est le seul fichier autorisé à appeler `fetch`.
 * Il uniformise l'URL, le JWT et les erreurs pour toutes les fonctionnalités.
 */
export const TOKEN_STORAGE_KEY = 'briko_token'

const API_URL = import.meta.env.VITE_API_URL

export class ApiClientError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : `La requête a échoué avec le statut ${status}.`

    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.body = body
  }
}

function buildUrl(endpoint: string): string {
  if (!API_URL) {
    throw new Error(
      "La variable d'environnement VITE_API_URL n'est pas configurée.",
    )
  }

  const baseUrl = API_URL.replace(/\/$/, '')
  const chemin = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `${baseUrl}${chemin}`
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const texte = await response.text()

  if (!texte) {
    return undefined
  }

  try {
    return JSON.parse(texte) as unknown
  } catch {
    return texte
  }
}

async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: unknown,
): Promise<T> {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(endpoint), {
    method,
    headers,
    body: data === undefined ? undefined : JSON.stringify(data),
  })
  const body = await parseBody(response)

  if (!response.ok) {
    throw new ApiClientError(response.status, body)
  }

  return body as T
}

export function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, 'GET')
}

export function post<T>(endpoint: string, data: unknown): Promise<T> {
  return request<T>(endpoint, 'POST', data)
}

export function put<T>(endpoint: string, data: unknown): Promise<T> {
  return request<T>(endpoint, 'PUT', data)
}

export function del<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, 'DELETE')
}
