import { API_ROUTES } from '@/config/apiRoutes'
import { api } from '@/lib/apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { AddBookPayload, Book, BookListParams } from '@/types/book'

export const booksApi = {
  list: async ({ search, page, limit }: BookListParams, signal?: AbortSignal) => {
    const res = await api.get<PaginatedResponse<Book>>(API_ROUTES.books.list, {
      params: { search: search || undefined, page, limit },
      signal,
    })
    return { books: res.data, pagination: res.pagination }
  },
  get: async (id: string, signal?: AbortSignal) => {
    const res = await api.get<ApiResponse<Book>>(API_ROUTES.books.detail(id), { signal })
    return res.data
  },
  update: (id: string, payload: AddBookPayload) => api.put<unknown>(API_ROUTES.books.update(id), payload),
  remove: (id: string) => api.delete<unknown>(API_ROUTES.books.remove(id)),
  add: (payload: AddBookPayload) => api.post<unknown>(API_ROUTES.books.add, payload),
}
