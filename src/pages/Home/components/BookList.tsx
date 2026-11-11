import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import type { PaginationMeta } from '@/types/api'
import type { Book } from '@/types/book'
import { BookCard } from './BookCard'
import { BookTable } from './BookTable'
import type { BookView } from './ViewToggle'

const stateClass = 'flex flex-col items-center gap-3 py-12 text-muted'

interface BookListProps {
  books: Book[] | null
  pagination: PaginationMeta | null
  view: BookView
  error: string | null
  isLoading: boolean
  /** A page/page-size refetch is in flight; the current page stays visible but dimmed. */
  isPaging: boolean
  reload: () => void
  onDelete: (book: Book) => void
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  search?: string
}

export function BookList({
  books,
  pagination,
  view,
  error,
  isLoading,
  isPaging,
  reload,
  onDelete,
  pageSize,
  onPageChange,
  onPageSizeChange,
  search,
}: BookListProps) {
  const cardScrollRef = useRef<HTMLDivElement>(null)

  // Each page starts at the top of the scrollable list.
  useEffect(() => {
    cardScrollRef.current?.scrollTo({ top: 0 })
  }, [pagination?.page, pagination?.limit])

  if (isLoading) return <Spinner />
  if (error) {
    return (
      <div className={stateClass} role="alert">
        <p>{error}</p>
        <Button variant="secondary" onClick={reload}>Retry</Button>
      </div>
    )
  }
  if (!books?.length || !pagination) {
    return (
      <p className={stateClass}>
        {search ? `No books match “${search}”.` : 'No books on the shelf yet — add your first one!'}
      </p>
    )
  }

  const content =
    view === 'list' ? (
      <BookTable
        books={books}
        pagination={pagination}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onDelete={onDelete}
      />
    ) : (
      <>
        {/* Padding (offset by negative margin) keeps the cards' hover lift and shadow from being clipped. */}
        <div ref={cardScrollRef} className="-mx-3 min-h-0 flex-1 overflow-y-auto px-3 pt-2 pb-4">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {books.map((book, i) => (
              <li key={book._id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 12) * 60}ms` }}>
                <BookCard book={book} onDelete={onDelete} />
              </li>
            ))}
          </ul>
        </div>
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          className="mt-4 shrink-0 justify-center border-t border-border pt-4"
        />
      </>
    )

  return (
    <>
      <div
        aria-busy={isPaging}
        className={`flex min-h-72 flex-1 basis-0 flex-col transition-opacity duration-200 ${isPaging ? 'pointer-events-none opacity-50' : ''}`}
      >
        {content}
      </div>
      {isPaging && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <div className="flex animate-pop items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-muted shadow-lg">
            <Spinner size="sm" label="Loading page" />
            Loading…
          </div>
        </div>
      )}
    </>
  )
}
