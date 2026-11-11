import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'

interface NavbarProps {
  userName?: string
  userId?: string | null
  onLogout?: () => void
}

export function Navbar({ userName, userId, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-border bg-bg/80 px-6 py-3 backdrop-blur">
      <span className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
        <span className="inline-block animate-[pop_0.6s_ease-out_both]" aria-hidden="true">📖</span>
        Bookshelf
      </span>
      <div className="flex items-center gap-3">
        {onLogout && (
          <>
            {userName && <span className="text-sm text-muted">Hello, {userName}</span>}
            {userId && <Link to={PROTECTED_ROUTES.userDetail(userId)} className="text-sm font-semibold">Profile</Link>}
          </>
        )}
        <ThemeToggle />
        {onLogout && <Button variant="secondary" onClick={onLogout}>Log out</Button>}
      </div>
    </header>
  )
}
