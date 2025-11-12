export class AppError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'AppError'
    this.status = options.status ?? null
    this.code = options.code ?? 'app_error'
    this.cause = options.cause
    this.meta = options.meta ?? {}
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed', options = {}) {
    super(message, { ...options, code: options.code ?? 'network_error' })
    this.name = 'NetworkError'
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Request timed out', options = {}) {
    super(message, { ...options, code: options.code ?? 'timeout_error' })
    this.name = 'TimeoutError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', options = {}) {
    super(message, { ...options, status: options.status ?? 404, code: options.code ?? 'not_found' })
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', options = {}) {
    super(message, { ...options, code: options.code ?? 'validation_error' })
    this.name = 'ValidationError'
    this.fieldErrors = options.fieldErrors ?? {}
  }
}

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  if (!error) return fallback
  if (typeof error === 'string') return error
  if (error instanceof AppError) return error.message || fallback
  return error.message || fallback
}

