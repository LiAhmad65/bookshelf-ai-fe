import { Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from './Navbar'

export function AppLayout() {
  const { userName, userId, logout } = useAuth()
  return (
    <div className="flex h-dvh flex-col">
      <Navbar userName={userName ?? undefined} userId={userId} onLogout={logout} />
      {/* `main` scrolls for ordinary pages; pages that manage their own scrolling (e.g. Home) fill it via flex-1. */}
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
