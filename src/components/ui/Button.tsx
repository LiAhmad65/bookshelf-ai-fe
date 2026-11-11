import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
}

const variants = {
  primary: 'bg-primary text-on-primary shadow-sm shadow-primary/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/30',
  danger: 'bg-danger text-on-primary shadow-sm hover:-translate-y-0.5 hover:shadow-md',
  secondary: 'border-border bg-surface text-text hover:-translate-y-0.5 hover:border-accent hover:shadow-sm',
}

export function Button({ variant = 'primary', loading = false, disabled, className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-lg border border-transparent px-4 py-2.5 font-semibold transition-all duration-200 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}
