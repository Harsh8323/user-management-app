import Button from '../Button/Button.jsx'

const variantStyles = {
  info: 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)]',
  success: 'bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--accent-foreground)]/20',
  error: 'bg-[var(--destructive)] text-[var(--destructive-foreground)]',
  warning: 'bg-yellow-100 text-yellow-900',
}

const Toast = ({ toast, onDismiss }) => {
  const { id, title, description, variant = 'info' } = toast
  const classes = variantStyles[variant] ?? variantStyles.info

  return (
    <div className={`pointer-events-auto rounded-xl p-4 shadow-md ${classes}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {title && <p className="text-sm font-semibold">{title}</p>}
          {description && <p className="mt-1 text-sm opacity-80">{description}</p>}
        </div>
        <Button variant="ghost" size="sm" onClick={() => onDismiss(id)} aria-label="Dismiss notification">
          ×
        </Button>
      </div>
    </div>
  )
}

export default Toast

