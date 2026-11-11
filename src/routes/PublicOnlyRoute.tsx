import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'
import { useAuth } from '@/hooks/useAuth'

/** Login/signup are not shown to users who are already signed in. */
export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Spinner />
  if (isAuthenticated) return <Navigate to={PROTECTED_ROUTES.books} replace />
  return <Outlet />
}
