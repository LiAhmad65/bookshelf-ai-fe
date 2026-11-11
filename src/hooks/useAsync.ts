import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '@/utils/getErrorMessage'

interface AsyncState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  /** The fn whose call produced the current data/error. */
  settledFn: unknown
}

/**
 * Runs an abortable async fn on mount; `reload` re-runs it.
 * `isLoading` is the blocking first/reload load; `isFetching` is true whenever a request is in flight,
 * including background refetches when `fn` changes (stale data stays in place meanwhile).
 */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, isLoading: true, settledFn: null })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fn(controller.signal)
      .then((data) => setState({ data, error: null, isLoading: false, settledFn: fn }))
      .catch((err) => {
        if (controller.signal.aborted) return
        setState({ data: null, error: getErrorMessage(err), isLoading: false, settledFn: fn })
      })
    return () => controller.abort()
  }, [fn, nonce])

  const reload = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }))
    setNonce((n) => n + 1)
  }, [])

  const { settledFn, ...rest } = state
  return { ...rest, isFetching: state.isLoading || settledFn !== fn, reload }
}
