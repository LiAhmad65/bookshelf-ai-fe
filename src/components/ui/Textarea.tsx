import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'

interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  label: string
  error?: string
  /** Content pinned to the right of the label (e.g. a small action button). */
  labelAction?: ReactNode
  /** Draws an accent border + glow (e.g. to flag freshly generated content). */
  highlighted?: boolean
  /** Content layered over the field, sized to it (e.g. a loading state). */
  overlay?: ReactNode
}

export function Textarea({ label, error, labelAction, highlighted = false, overlay, id, required, className = '', ...rest }: TextareaProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-semibold">
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <textarea
          id={inputId}
          rows={4}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`block w-full resize-y rounded-lg border bg-bg/60 px-3 py-2.5 text-text transition-[border-color,box-shadow] duration-500 focus-visible:outline-2 focus-visible:outline-offset-1 ${
            error
              ? 'border-danger focus-visible:outline-danger'
              : highlighted
                ? 'border-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-accent)_22%,transparent)] focus-visible:outline-accent'
                : 'border-border focus-visible:outline-primary'
          } ${className}`}
          {...rest}
        />
        {overlay}
      </div>
      {error && <span id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</span>}
    </div>
  )
}
