export interface ApiErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

/** Successful responses wrap their payload in a `data` object. */
export interface ApiResponse<T> {
  data: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** List endpoints return the page of items alongside pagination metadata. */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta
}
