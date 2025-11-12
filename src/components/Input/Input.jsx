const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  name,
  placeholder,
  required,
  error,
  helperText,
  disabled,
  autoComplete,
}) => {
  const inputId = id ?? name
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
          {label}
          {required && <span className="ml-1 text-[var(--destructive)]">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={(e) => {
          if (onChange) {
            onChange(e)
          }
        }}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`form-input ${error ? 'border-[var(--destructive)] focus-visible:ring-[var(--destructive)]' : ''}`}
      />
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export default Input

