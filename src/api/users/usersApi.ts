import { API_ROUTES } from '@/config/apiRoutes'
import { api } from '@/lib/apiClient'
import type { ApiResponse } from '@/types/api'
import type { UserDetails } from '@/types/user'

export const usersApi = {
  get: async (id: string, signal?: AbortSignal) => {
    const res = await api.get<ApiResponse<UserDetails>>(API_ROUTES.users.detail(id), { signal })
    return res.data
  },
}
