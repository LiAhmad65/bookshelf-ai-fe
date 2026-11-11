import { useCallback } from 'react'
import { useAsync } from '@/hooks/useAsync'
import { booksApi } from '@/api/books/booksApi'

export function useBooks(search: string, page: number, limit: number) {
  const fetchBooks = useCallback(
    // Tag the result with its search term so we can tell a search refetch from a page change.
    async (signal: AbortSignal) => ({ ...(await booksApi.list({ search, page, limit }, signal)), search }),
    [search, page, limit],
  )
  const result = useAsync(fetchBooks)
  const isRefetching = result.isFetching && !result.isLoading
  const isSearching = isRefetching && result.data?.search !== search
  // Any other background refetch comes from moving between pages or changing the page size.
  const isPaging = isRefetching && !isSearching
  return { ...result, isSearching, isPaging }
}
