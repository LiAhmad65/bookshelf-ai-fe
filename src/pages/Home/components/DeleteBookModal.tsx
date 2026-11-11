import { useState } from 'react'
import { booksApi } from '@/api/books/booksApi'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { Book } from '@/types/book'
import { getErrorMessage } from '@/utils/getErrorMessage'

interface DeleteBookModalProps {
  book: Book
  onClose: () => void
  onDeleted: () => void
}

export function DeleteBookModal({ book, onClose, onDeleted }: DeleteBookModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirmDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await booksApi.remove(book._id)
      onDeleted()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete book'))
      setIsDeleting(false)
    }
  }

  return (
    <Modal title="Delete book" onClose={isDeleting ? () => {} : onClose}>
      <p className="mb-4 text-sm">
        Are you sure you want to delete <strong>{book.name}</strong>? This cannot be undone.
      </p>
      {error && <p role="alert" className="mb-4 text-sm text-danger">{error}</p>}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>No</Button>
        <Button variant="danger" onClick={confirmDelete} loading={isDeleting}>Yes</Button>
      </div>
    </Modal>
  )
}
