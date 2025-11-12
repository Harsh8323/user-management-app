const EmptyState = ({ title, description, action }) => (
  <div className="card card-bordered flex flex-col items-center justify-center gap-3 text-center">
    <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
    {description && <p className="text-sm text-[var(--muted-foreground)]">{description}</p>}
    {action}
  </div>
)

export default EmptyState

