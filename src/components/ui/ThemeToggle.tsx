import { useTheme } from '@/hooks/useTheme'
import { MoonIcon, SunIcon } from './icons'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
    >
      {/* Show the icon for the mode you'd switch to. */}
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  )
}
