import Spinner from '../Spinner/Spinner.jsx'

const variantClassNames = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  danger: 'btn btn-danger',
  ghost: 'btn text-[var(--foreground)] hover:bg-[var(--secondary)]',
}

const sizeClassNames = {
  sm: 'px-3 py-1 text-xs',
  md: '',
  lg: 'px-6 py-3 text-base',
}

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const resolvedVariant = variantClassNames[variant] ?? variantClassNames.primary
  const sizeClasses = sizeClassNames[size] ?? sizeClassNames.md

  return (
    <button
      type={type}
      className={`${resolvedVariant} ${sizeClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {icon && !loading && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}

export default Button

