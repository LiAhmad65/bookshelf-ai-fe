import { Link } from 'react-router-dom'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'
import { EyeIcon, TrashIcon } from '@/components/ui/icons'
import type { Book } from '@/types/book'
import { coverFor } from '../utils/bookCover'

interface BookCardProps {
  book: Book
  onDelete: (book: Book) => void
}

const squareButton =
  'flex size-11 cursor-pointer items-center justify-center rounded-md border border-transparent text-on-primary shadow-md transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export function BookCard({ book, onDelete }: BookCardProps) {
  return (
    <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/20 focus-within:-translate-y-1.5 focus-within:shadow-xl">
      <div className={`relative flex h-40 items-end bg-linear-to-br ${coverFor(book.name)} p-4`}>
        <span className="absolute inset-y-0 left-3 w-1.5 bg-white/20" aria-hidden="true" />
        <span className="absolute top-3 right-4 font-serif text-5xl font-bold text-white/20 transition-transform duration-500 group-hover:scale-125" aria-hidden="true">
          {book.name.charAt(0).toUpperCase()}
        </span>
        <h3 className="relative line-clamp-2 pl-4 text-lg leading-snug font-bold text-white">{book.name}</h3>
      </div>
      <p className="px-4 py-3 text-sm text-muted">
        by <span className="font-semibold text-text">{book.author}</span>
      </p>
      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-overlay opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <Link
          to={PROTECTED_ROUTES.bookDetail(book._id)}
          aria-label={`View ${book.name}`}
          title="View"
          className={`${squareButton} bg-accent hover:text-on-primary`}
        >
          <EyeIcon />
        </Link>
        <button
          type="button"
          aria-label={`Delete ${book.name}`}
          title="Delete"
          onClick={() => onDelete(book)}
          className={`${squareButton} bg-danger`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}
