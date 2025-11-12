import { API_BASE_URL, REQUEST_TIMEOUT } from './constants.js'
import { AppError, NetworkError, NotFoundError, TimeoutError } from './errors.js'

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
}

export const fetchJson = async (endpoint, options = {}) => {
  const { method = 'GET', headers = {}, body, signal, timeout = REQUEST_TIMEOUT } = options

  const controller = new AbortController()
  let didTimeout = false

  if (signal) {
    if (signal.aborted) {
      controller.abort()
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true })
    }
  }

  const timeoutId = setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, timeout)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        ...jsonHeaders,
        ...headers,
      },
      body,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const contentType = response.headers.get('content-type')
    let payload = null

    if (contentType?.includes('application/json')) {
      try {
        payload = await response.json()
      } catch (error) {
        throw new AppError('Unable to parse server response', { cause: error })
      }
    } else if (response.status !== 204) {
      payload = await response.text()
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError('Requested user was not found', { status: 404 })
      }

      const message =
        typeof payload === 'string'
          ? payload
          : payload?.message || 'Unknown server error'

      throw new AppError(message, {
        status: response.status,
        code: payload?.code,
        meta: payload,
      })
    }

    return payload
  } catch (error) {
    clearTimeout(timeoutId)

    if (error.name === 'AbortError') {
      if (didTimeout) {
        throw new TimeoutError()
      }

      if (signal?.aborted) {
        throw new AppError('Request cancelled', { code: 'aborted', cause: error })
      }

      throw new TimeoutError()
    }

    if (error instanceof AppError) {
      throw error
    }

    throw new NetworkError('Unable to connect. Check your network and retry.', { cause: error })
  }
}

