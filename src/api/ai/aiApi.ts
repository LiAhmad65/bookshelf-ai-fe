import { API_ROUTES } from '@/config/apiRoutes'
import { api } from '@/lib/apiClient'

export interface ChatPayload {
  userQuery: string
}

export interface BookDescriptionPayload {
  title: string
  author?: string
}

export interface GeneratedBookInfo {
  author?: string
  description?: string
}

export const aiApi = {
  chat: (payload: ChatPayload, signal?: AbortSignal) =>
    api.post<{ reply: string }>(API_ROUTES.ai.chat, payload, { signal }),
  generateBookDescription: (payload: BookDescriptionPayload, signal?: AbortSignal) =>
    api.post<GeneratedBookInfo>(API_ROUTES.ai.generateBookDescription, payload, { signal }),
}
