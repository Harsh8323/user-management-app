const sizeClasses = {
  sm: 'h-4 w-4 border-[2px]',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClass = sizeClasses[size] ?? sizeClasses.md
  return (
    <span
      className={`inline-block animate-spin rounded-full border-[var(--muted-foreground)] border-t-transparent ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner

