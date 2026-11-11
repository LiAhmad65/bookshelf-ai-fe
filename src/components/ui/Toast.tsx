import { useEffect } from 'react'

interface ToastProps {
  message: string
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, onDismiss, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onDismiss])

  return (
    <div role="status" className="animate-slide-in fixed right-6 bottom-6 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
      {message}
    </div>
  )
}
