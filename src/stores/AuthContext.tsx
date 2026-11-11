import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AUTH_EXPIRED_EVENT, TOKEN_STORAGE_KEY, USER_ID_STORAGE_KEY, USER_NAME_STORAGE_KEY } from '@/config/constants'
import type { AuthExpiredDetail } from '@/lib/apiClient'
import { storage } from '@/utils/storage'
import { authApi } from '@/api/auth/authApi'
import type { AuthResponse, LoginPayload, SignupPayload, User } from '@/types/auth'

export interface AuthContextValue {
  user: User | null
  /** Id of the logged-in user, persisted so it survives refreshes. */
  userId: string | null
  /** Display name of the logged-in user, persisted so it survives refreshes. */
  userName: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => void
  /** Set when a request was rejected as unauthorized; shown on the login page. */
  authMessage: string | null
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

/** Accepts either `{ token, user }` or the same wrapped in a `data` object. */
function unwrapAuth(res: AuthResponse | { data: AuthResponse }): AuthResponse {
  return 'data' in res ? res.data : res
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // The token is the source of truth: if it's stored, the session survives refreshes.
  const [token, setToken] = useState<string | null>(() => storage.get(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [userId, setUserId] = useState<string | null>(() => storage.get(USER_ID_STORAGE_KEY))
  const [userName, setUserName] = useState<string | null>(() => storage.get(USER_NAME_STORAGE_KEY))
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const isLoading = false

  const logout = useCallback(() => {
    storage.remove(TOKEN_STORAGE_KEY)
    storage.remove(USER_ID_STORAGE_KEY)
    storage.remove(USER_NAME_STORAGE_KEY)
    setToken(null)
    setUserName(null)
    setUserId(null)
    setUser(null)
  }, [])

  const handleAuth = useCallback((res: AuthResponse | { data: AuthResponse }) => {
    const { user, token } = unwrapAuth(res)
    storage.set(TOKEN_STORAGE_KEY, token)
    setToken(token)
    setAuthMessage(null)
    if (user) {
      setUser(user)
      if (user.name) {
        storage.set(USER_NAME_STORAGE_KEY, user.name)
        setUserName(user.name)
      }
      const id = user._id ?? user.id
      if (id) {
        storage.set(USER_ID_STORAGE_KEY, id)
        setUserId(id)
      }
    }
  }, [])

  // The API client fires this on any 401.
  useEffect(() => {
    const onExpired = (e: Event) => {
      setAuthMessage((e as CustomEvent<AuthExpiredDetail>).detail?.message ?? 'Unauthorized')
      logout()
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired)
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      userId,
      userName,
      isLoading,
      isAuthenticated: token !== null,
      login: async (payload) => handleAuth(await authApi.login(payload)),
      signup: async (payload) => handleAuth(await authApi.signup(payload)),
      logout,
      authMessage,
    }),
    [user, userId, userName, token, isLoading, handleAuth, logout, authMessage],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
