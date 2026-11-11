import { env } from '@/config/env'
import { AUTH_EXPIRED_EVENT, TOKEN_STORAGE_KEY } from '@/config/constants'
import type { ApiErrorBody } from '@/types/api'
import { storage } from '@/utils/storage'

export class ApiError extends Error {
  readonly status: number
  readonly body?: ApiErrorBody

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

type QueryValue = string | number | boolean | null | undefined

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  body?: unknown
  params?: Record<string, QueryValue>
  /** Skip attaching the Authorization header (e.g. login/signup). */
  skipAuth?: boolean
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const url = new URL(env.apiBaseUrl.replace(/\/$/, '') + path)
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

export interface AuthExpiredDetail {
  message: string
}

/** Common handler: a 401/403 on an authenticated request means the token is rejected, so notify the app to log out. */
function handleUnauthorized(message: string) {
  window.dispatchEvent(new CustomEvent<AuthExpiredDetail>(AUTH_EXPIRED_EVENT, { detail: { message } }))
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function request<T>(method: Method, path: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, skipAuth, headers, ...init } = options
  const finalHeaders = new Headers(headers)
  finalHeaders.set('Accept', 'application/json')
  if (body !== undefined) finalHeaders.set('Content-Type', 'application/json')

  const token = storage.get(TOKEN_STORAGE_KEY)
  if (token && !skipAuth) finalHeaders.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      ...init,
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'Network error. Please check your connection.')
  }

  const data = await parseBody(response)

  if (!response.ok) {
    const errorBody = typeof data === 'object' && data !== null ? (data as ApiErrorBody) : undefined
    const message = errorBody?.message ?? (response.statusText || 'Request failed')
    if ((response.status === 401 || response.status === 403) && !skipAuth) {
      handleUnauthorized(errorBody?.message ?? 'Unauthorized. Please log in again.')
    }
    throw new ApiError(response.status, message, errorBody)
  }

  return data as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
