import { useCallback, useState } from 'react'

export const useAsync = (initialState = {}) => {
  const [status, setStatus] = useState(initialState.status ?? 'idle')
  const [data, setData] = useState(initialState.data ?? null)
  const [error, setError] = useState(initialState.error ?? null)

  const run = useCallback(async (promise) => {
    if (!(promise instanceof Promise)) {
      throw new Error('useAsync.run expects a promise')
    }

    setStatus('pending')
    setError(null)

    try {
      const result = await promise
      setData(result)
      setStatus('success')
      return result
    } catch (err) {
      setError(err)
      setStatus('error')
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setData(null)
    setError(null)
  }, [])

  return {
    data,
    error,
    status,
    run,
    reset,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
  }
}

