import { ValidationError } from '../../utils/errors.js'

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Validates phone numbers: accepts various formats including Indian numbers and API formats
// Accepts formats: 9876543210, +91 9876543210, 1-770-736-8031 x56442, etc.
const validatePhone = (phone) => {
  if (!phone?.trim()) return false
  
  const trimmed = phone.trim()
  
  // Remove extensions (e.g., "x56442", "ext 123")
  const withoutExtension = trimmed.split(/\s*(?:x|ext|extension)[\s-]*\d+/i)[0]
  
  // Remove all non-digit characters except + at the start
  const cleaned = withoutExtension.replace(/[\s()-]/g, '')
  
  // Check if it starts with +91 (Indian country code)
  if (cleaned.startsWith('+91')) {
    const digits = cleaned.slice(3) // Remove +91
    // Should be exactly 10 digits, starting with 6-9 for mobile
    return /^[6-9]\d{9}$/.test(digits)
  }
  
  // Check if it's a 10-digit number (Indian format)
  if (/^\d{10}$/.test(cleaned)) {
    return true
  }
  
  // Accept any phone number with 7-15 digits (for international formats and API formats like "1-770-736-8031")
  const digitCount = cleaned.replace(/\D/g, '').length
  return digitCount >= 7 && digitCount <= 15
}

export const validateUser = (payload) => {
  const errors = {}

  if (!payload.name?.trim()) {
    errors.name = 'Name is required'
  }

  if (!payload.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(payload.email.trim())) {
    errors.email = 'Enter a valid email'
  }

  if (!payload.phone?.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!validatePhone(payload.phone)) {
    errors.phone = 'Enter a valid phone number'
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}

export const assertValidUser = (payload) => {
  const { errors, isValid } = validateUser(payload)
  if (!isValid) {
    throw new ValidationError('Please fix the form errors before submitting', { fieldErrors: errors })
  }
  return payload
}

