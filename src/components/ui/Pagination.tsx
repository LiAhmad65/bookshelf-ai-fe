import { useId, useState, type FormEvent } from 'react'
import { PAGE_SIZE_OPTIONS } from '@/config/constants'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from './icons'

interface PaginationProps {
  page: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  className?: string
}

const field =
  'h-9 rounded-lg border border-border bg-surface text-sm text-text shadow-xs transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary'
const iconButton =
  'flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-text shadow-xs transition-colors hover:border-accent hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-bg/60 disabled:text-muted/50 disabled:shadow-none disabled:hover:border-border'

export function Pagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange, className = '' }: PaginationProps) {
  const sizeId = useId()
  const jumpId = useId()
  const [jumpTo, setJumpTo] = useState('')
  const target = Number(jumpTo)
  const isValidTarget = Number.isInteger(target) && target >= 1 && target <= totalPages

  const handleJump = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidTarget) return
    if (target !== page) onPageChange(target)
    setJumpTo('')
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <label htmlFor={sizeId} className="text-sm text-muted">Per page</label>
        <div className="relative">
          <select
            id={sizeId}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={`${field} cursor-pointer appearance-none pr-8 pl-3 font-semibold`}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <ChevronDownIcon size={16} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <nav className="flex items-center gap-2" aria-label="Pagination">
        <button
          type="button"
          className={iconButton}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          title="Previous page"
        >
          <ChevronLeftIcon size={18} />
        </button>
        <span className="min-w-24 text-center text-sm text-muted" aria-live="polite">
          Page <span className="font-semibold text-text">{page}</span> of {totalPages}
        </span>
        <button
          type="button"
          className={iconButton}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          title="Next page"
        >
          <ChevronRightIcon size={18} />
        </button>
      </nav>

      {totalPages > 1 && (
        <form onSubmit={handleJump} className="flex items-center gap-2">
          <label htmlFor={jumpId} className="text-sm text-muted">Go to</label>
          <input
            id={jumpId}
            type="number"
            inputMode="numeric"
            min={1}
            max={totalPages}
            placeholder={String(page)}
            value={jumpTo}
            onChange={(e) => setJumpTo(e.target.value)}
            aria-invalid={jumpTo !== '' && !isValidTarget ? true : undefined}
            className={`${field} w-16 px-2 text-center aria-invalid:border-danger aria-invalid:focus-visible:outline-danger`}
          />
          <button
            type="submit"
            disabled={!isValidTarget}
            className="h-9 cursor-pointer rounded-lg bg-primary px-3 text-sm font-semibold text-on-primary shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Go
          </button>
        </form>
      )}
    </div>
  )
}
