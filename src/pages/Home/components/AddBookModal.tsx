import { booksApi } from '@/api/books/booksApi'
import { BookForm } from '@/components/books/BookForm'
import { Modal } from '@/components/ui/Modal'

interface AddBookModalProps {
  onClose: () => void
  onAdded: () => void
}

export function AddBookModal({ onClose, onAdded }: AddBookModalProps) {
  return (
    <Modal title="Add book" onClose={onClose}>
      <BookForm
        submitLabel="Add book"
        onSubmit={async (values) => {
          await booksApi.add(values)
          onAdded()
        }}
      />
    </Modal>
  )
}
