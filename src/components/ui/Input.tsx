import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  /** Validation message; also turns the field border red. */
  error?: string
  /** Decorative content pinned inside the right edge of the field (e.g. a loading spinner). */
  trailing?: ReactNode
}

export function Input({ label, hint, error, trailing, id, required, type, className = '', ...rest }: InputProps) {
  const generatedId = useId()
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-lg border bg-bg/60 px-3 py-2.5 text-text focus-visible:outline-2 focus-visible:outline-offset-1 ${
            isPassword ? 'pr-16' : trailing !== undefined ? 'pr-10' : ''
          } ${
            error
              ? 'border-danger focus-visible:outline-danger'
              : 'border-border focus-visible:outline-primary'
          } ${className}`}
          {...rest}
        />
        {trailing && !isPassword && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">{trailing}</span>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-pressed={revealed}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 cursor-pointer rounded-r-lg px-3 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error ? (
        <span id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</span>
      ) : (
        hint && <span id={`${inputId}-hint`} className="text-xs text-muted">{hint}</span>
      )}
    </div>
  )
}
