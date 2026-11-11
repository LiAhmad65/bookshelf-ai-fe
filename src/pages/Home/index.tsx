import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Toast } from '@/components/ui/Toast'
import { AddBookModal } from './components/AddBookModal'
import { DeleteBookModal } from './components/DeleteBookModal'
import { LibraryChat } from './components/LibraryChat'
import { BookList } from './components/BookList'
import { ViewToggle, type BookView } from './components/ViewToggle'
import { BOOK_VIEW_STORAGE_KEY } from '@/config/constants'
import type { Book } from '@/types/book'
import { debounce } from '@/utils/debounce'
import { storage } from '@/utils/storage'
import { useBooks } from './hooks/useBooks'

const SEARCH_DEBOUNCE_MS = 400
const DEFAULT_PAGE_SIZE = 25

export default function Home() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [view, setView] = useState<BookView>(() =>
    storage.get(BOOK_VIEW_STORAGE_KEY) === 'list' ? 'list' : 'card',
  )
  const { data, error, isLoading, isSearching, isPaging, reload } = useBooks(search, page, pageSize)
  const books = data?.books ?? null
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value)
        setPage(1)
      }, SEARCH_DEBOUNCE_MS),
    [],
  )
  useEffect(() => debouncedSetSearch.cancel, [debouncedSetSearch])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const closeModal = useCallback(() => setIsAddOpen(false), [])
  const dismissToast = useCallback(() => setToast(null), [])

  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)

  const handleDeleted = () => {
    setBookToDelete(null)
    setToast('Book deleted successfully')
    // Deleting the only book on a later page would leave it empty, so step back a page instead.
    if (books?.length === 1 && page > 1) setPage(page - 1)
    else reload()
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const handleViewChange = (next: BookView) => {
    setView(next)
    storage.set(BOOK_VIEW_STORAGE_KEY, next)
  }

  const handleAdded = () => {
    setIsAddOpen(false)
    setToast('Book added successfully')
    reload()
  }

  return (
    // Fills the viewport below the navbar; only the book list inside scrolls.
    // pb-16 keeps the pagination bar clear of the floating chat button (LibraryChat, fixed bottom-right);
    // from 2xl the centered content ends left of the button, so no gap is needed.
    <div className="flex min-h-0 flex-1 basis-0 flex-col pb-16 2xl:pb-0">
      <div className="mb-8 flex shrink-0 animate-rise items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">Your Library</h1>
          <p className="mt-1 text-muted">Browse, discover and keep track of every book you love.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>Add book</Button>
      </div>
      <div className="mb-6 flex shrink-0 items-end justify-between gap-4">
        <div className="w-full max-w-md">
          <Input
            label="Search books"
            type="search"
            placeholder="Search by title or author…"
            onChange={(e) => debouncedSetSearch(e.target.value.trim())}
            trailing={isSearching ? <Spinner size="sm" label="Searching" /> : null}
          />
        </div>
        <ViewToggle view={view} onChange={handleViewChange} />
      </div>
      <BookList
        books={books}
        pagination={data?.pagination ?? null}
        view={view}
        error={error}
        isLoading={isLoading}
        isPaging={isPaging}
        reload={reload}
        onDelete={setBookToDelete}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        search={search}
      />
      {isAddOpen && <AddBookModal onClose={closeModal} onAdded={handleAdded} />}
      {bookToDelete && (
        <DeleteBookModal
          book={bookToDelete}
          onClose={() => setBookToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
      {toast && <Toast message={toast} onDismiss={dismissToast} />}
      <LibraryChat />
    </div>
  )
}
