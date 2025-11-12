import { useEffect, useState, useRef } from 'react'
import Input from '../Input/Input.jsx'
import Button from '../Button/Button.jsx'
import { validateUser } from '../../features/users/validations.js'

const UserForm = ({ initialValues, onSubmit, submitLabel, loading }) => {
  // Normalize initial values - ensure they're always strings
  const getNormalizedValues = (vals) => ({
    name: String(vals?.name || ''),
    email: String(vals?.email || ''),
    phone: String(vals?.phone || ''),
  })
  
  const [values, setValues] = useState(() => {
    const normalized = getNormalizedValues(initialValues)
    return normalized
  })
  const [errors, setErrors] = useState({})
  const prevInitialValuesRef = useRef(initialValues)

  // Only update when initialValues actually changes (deep comparison of values)
  useEffect(() => {
    const prev = prevInitialValuesRef.current
    const current = initialValues
    
    // Check if initialValues actually changed by comparing the actual values
    const prevNormalized = getNormalizedValues(prev)
    const currentNormalized = getNormalizedValues(current)
    
    const hasChanged = 
      prevNormalized.name !== currentNormalized.name ||
      prevNormalized.email !== currentNormalized.email ||
      prevNormalized.phone !== currentNormalized.phone
    
    if (hasChanged) {
      setValues(currentNormalized)
      prevInitialValuesRef.current = current
    }
  }, [initialValues])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => {
      const newValues = { ...prev, [name]: value }
      return newValues
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validation = validateUser(values)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Input
        label="Full name"
        name="name"
        value={values.name}
        onChange={handleChange}
        placeholder="Jane Doe"
        required
        error={errors.name}
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="jane.doe@example.com"
        required
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label="Phone"
        name="phone"
        value={values.phone}
        onChange={handleChange}
        placeholder="(555) 123-4567"
        required
        error={errors.phone}
        autoComplete="tel"
      />
      <div className="flex items-center justify-end gap-3">
        <Button type="submit" loading={loading} className="min-w-[120px]">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default UserForm

