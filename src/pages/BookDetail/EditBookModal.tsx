import { useCallback } from 'react'
import { booksApi } from '@/api/books/booksApi'
import { BookForm } from '@/components/books/BookForm'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useAsync } from '@/hooks/useAsync'

interface EditBookModalProps {
  bookId: string
  onClose: () => void
  onUpdated: () => void
}

export function EditBookModal({ bookId, onClose, onUpdated }: EditBookModalProps) {
  const fetchBook = useCallback((signal: AbortSignal) => booksApi.get(bookId, signal), [bookId])
  const { data: book, error, isLoading } = useAsync(fetchBook)

  return (
    <Modal title="Edit book" onClose={onClose}>
      {isLoading && <Spinner />}
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      {book && (
        <BookForm
          submitLabel="Update book"
          aiDescription
          initialValues={{ name: book.name, author: book.author, description: book.description ?? '' }}
          onSubmit={async (values) => {
            await booksApi.update(bookId, values)
            onUpdated()
          }}
        />
      )}
    </Modal>
  )
}
