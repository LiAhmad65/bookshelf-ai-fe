import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`h-full rounded-xl border border-border bg-surface p-4 shadow-sm ${className}`} {...rest} />
}
