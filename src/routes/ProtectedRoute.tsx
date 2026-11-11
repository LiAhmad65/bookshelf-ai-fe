import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { AUTH_ROUTES } from '@/config/authRoutes'
import { useAuth } from '@/hooks/useAuth'

/** Requires auth; unauthenticated users are sent to login and returned afterwards. */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <Spinner />
  if (!isAuthenticated) return <Navigate to={AUTH_ROUTES.login} replace state={{ from: location.pathname }} />
  return <Outlet />
}
