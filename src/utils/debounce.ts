/** Delays calling `fn` until `wait` ms have passed since the last call; `cancel` drops a pending call. */
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
  debounced.cancel = () => clearTimeout(timer)

  return debounced
}
