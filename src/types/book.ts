/** Mirrors the backend book document. */
export interface Book {
  _id: string
  name: string
  author: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface BookListParams {
  search?: string
  page: number
  limit: number
}

export interface AddBookPayload {
  name: string
  author: string
  description: string
}
