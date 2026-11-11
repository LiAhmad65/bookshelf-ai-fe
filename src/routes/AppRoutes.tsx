import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Spinner } from '@/components/ui/Spinner'
import { AUTH_ROUTES } from '@/config/authRoutes'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

const Home = lazy(() => import('@/pages/Home'))
const BookDetail = lazy(() => import('@/pages/BookDetail'))
const UserDetail = lazy(() => import('@/pages/UserDetail'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))

export function AppRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={AUTH_ROUTES.login} element={<Login />} />
            <Route path={AUTH_ROUTES.signup} element={<Signup />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={PROTECTED_ROUTES.books} element={<Home />} />
            <Route path={PROTECTED_ROUTES.bookDetailPattern} element={<BookDetail />} />
            <Route path={PROTECTED_ROUTES.userDetailPattern} element={<UserDetail />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={PROTECTED_ROUTES.books} replace />} />
      </Routes>
    </Suspense>
  )
}
