import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'
import { EyeIcon, TrashIcon } from '@/components/ui/icons'
import { Pagination } from '@/components/ui/Pagination'
import type { PaginationMeta } from '@/types/api'
import type { Book } from '@/types/book'
import { coverFor } from '../utils/bookCover'

interface BookTableProps {
  books: Book[]
  pagination: PaginationMeta
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onDelete: (book: Book) => void
}

const th = 'px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted uppercase'
const td = 'px-4 py-3 align-middle'
const iconButton =
  'flex size-8 cursor-pointer items-center justify-center rounded-md border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary'

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

export function BookTable({ books, pagination, pageSize, onPageChange, onPageSizeChange, onDelete }: BookTableProps) {
  const { page, limit, total, totalPages } = pagination
  const from = (page - 1) * limit + 1
  const to = from + books.length - 1
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [page, limit])

  return (
    <div className="flex h-full animate-rise flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-bg shadow-[0_1px_0_var(--color-border)]">
            <tr>
              <th scope="col" className={th}>Title</th>
              <th scope="col" className={th}>Author</th>
              <th scope="col" className={`${th} hidden md:table-cell`}>Description</th>
              <th scope="col" className={`${th} hidden whitespace-nowrap lg:table-cell`}>Added</th>
              <th scope="col" className={`${th} text-right`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((book) => (
              <tr key={book._id} className="transition-colors hover:bg-accent/5">
                <td className={td}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-8 shrink-0 items-center justify-center rounded-sm bg-linear-to-br ${coverFor(book.name)} font-serif text-sm font-bold text-white/80 shadow-sm`}
                      aria-hidden="true"
                    >
                      {book.name.charAt(0).toUpperCase()}
                    </span>
                    <Link to={PROTECTED_ROUTES.bookDetail(book._id)} className="font-semibold">
                      {book.name}
                    </Link>
                  </div>
                </td>
                <td className={`${td} whitespace-nowrap`}>{book.author}</td>
                <td className={`${td} hidden max-w-md text-muted md:table-cell`}>
                  <p className="line-clamp-2">{book.description || '—'}</p>
                </td>
                <td className={`${td} hidden whitespace-nowrap text-muted lg:table-cell`}>{formatDate(book.createdAt)}</td>
                <td className={td}>
                  <div className="flex justify-end gap-1">
                    <Link
                      to={PROTECTED_ROUTES.bookDetail(book._id)}
                      aria-label={`View ${book.name}`}
                      title="View"
                      className={`${iconButton} text-muted hover:bg-accent/15 hover:text-primary`}
                    >
                      <EyeIcon size={18} />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Delete ${book.name}`}
                      title="Delete"
                      onClick={() => onDelete(book)}
                      className={`${iconButton} text-muted hover:bg-danger/10 hover:text-danger`}
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-bg/60 px-4 py-3">
        <p className="text-sm text-muted">
          Showing <span className="font-semibold text-text">{from}–{to}</span> of{' '}
          <span className="font-semibold text-text">{total}</span> books
        </p>
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  )
}
