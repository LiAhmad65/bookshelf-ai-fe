import { API_ROUTES } from '@/config/apiRoutes'
import { api } from '@/lib/apiClient'
import type { AuthResponse, LoginPayload, SignupPayload, User } from '@/types/auth'

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>(API_ROUTES.auth.login, payload, { skipAuth: true }),
  signup: (payload: SignupPayload) =>
    api.post<AuthResponse>(API_ROUTES.auth.signup, payload, { skipAuth: true }),
  me: () => api.get<User>(API_ROUTES.auth.me),
}
