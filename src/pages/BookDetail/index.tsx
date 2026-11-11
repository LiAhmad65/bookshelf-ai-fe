import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { booksApi } from '@/api/books/booksApi'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Toast } from '@/components/ui/Toast'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'
import { useAsync } from '@/hooks/useAsync'
import { EditBookModal } from './EditBookModal'

const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : undefined)

export default function BookDetail() {
  const { id = '' } = useParams()
  const fetchBook = useCallback((signal: AbortSignal) => booksApi.get(id, signal), [id])
  const { data: book, error, isLoading, reload } = useAsync(fetchBook)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const closeModal = useCallback(() => setIsEditOpen(false), [])
  const dismissToast = useCallback(() => setToast(null), [])

  const handleUpdated = () => {
    setIsEditOpen(false)
    setToast('Book updated successfully')
    reload()
  }

  return (
    <>
      <Link to={PROTECTED_ROUTES.books} className="mb-6 self-start text-sm">← Back to books</Link>
      {isLoading && <Spinner />}
      {error && <p role="alert" className="text-danger">{error}</p>}
      {book && (
        <Card className="max-w-2xl animate-rise p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-primary">{book.name}</h1>
              <p className="text-muted">by {book.author}</p>
            </div>
            <Button onClick={() => setIsEditOpen(true)}>Edit</Button>
          </div>
          <p className="mt-4 leading-relaxed">{book.description || 'No description provided.'}</p>
          {(book.createdAt || book.updatedAt) && (
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-muted">
              {book.createdAt && (<><dt>Created</dt><dd>{formatDate(book.createdAt)}</dd></>)}
              {book.updatedAt && (<><dt>Updated</dt><dd>{formatDate(book.updatedAt)}</dd></>)}
            </dl>
          )}
        </Card>
      )}
      {isEditOpen && <EditBookModal bookId={id} onClose={closeModal} onUpdated={handleUpdated} />}
      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </>
  )
}
