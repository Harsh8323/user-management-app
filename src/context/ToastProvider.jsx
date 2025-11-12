import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Toast from '../components/Toast/Toast.jsx'

const ToastContext = createContext(null)

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `toast-${Math.random().toString(36).slice(2, 10)}`
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const pushToast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }) => {
      const id = generateId()
      setToasts((prev) => [...prev, { id, title, description, variant }])

      if (duration > 0) {
        const timerId = window.setTimeout(() => dismissToast(id), duration)
        timers.current.set(id, timerId)
      }

      return id
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      toasts,
      pushToast,
      dismissToast,
    }),
    [toasts, pushToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 max-w-full flex-col gap-3"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

