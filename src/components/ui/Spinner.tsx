interface SpinnerProps {
  /** `sm` renders a bare inline ring (e.g. inside an input); `md` is the centered block loader. */
  size?: 'sm' | 'md'
  label?: string
}

export function Spinner({ size = 'md', label = 'Loading' }: SpinnerProps) {
  if (size === 'sm') {
    return (
      <span
        className="block size-4 animate-spin rounded-full border-2 border-border border-t-accent"
        role="status"
        aria-label={label}
      />
    )
  }

  return (
    <div className="flex justify-center py-12" role="status" aria-label={label}>
      <div className="size-8 animate-spin rounded-full border-3 border-border border-t-accent" />
    </div>
  )
}
