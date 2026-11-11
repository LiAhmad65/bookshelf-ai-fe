import { API_ROUTES } from '@/config/apiRoutes'
import { api } from '@/lib/apiClient'

export interface ChatPayload {
  userQuery: string
}

export const aiApi = {
  chat: (payload: ChatPayload, signal?: AbortSignal) =>
    api.post<{ reply: string }>(API_ROUTES.ai.chat, payload, { signal }),
}
