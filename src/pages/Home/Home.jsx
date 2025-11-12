import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'
import UserRow from '../../components/UserRow/UserRow.jsx'
import Button from '../../components/Button/Button.jsx'
import { useUsers } from '../../hooks/use-users.js'
import { useToast } from '../../context/ToastProvider.jsx'
import { ROUTES } from '../../utils/constants.js'

const Home = () => {
  const { users, loadUsers, deleteUser, listStatus, listError, getErrorMessage } = useUsers()
  const { pushToast } = useToast()
  const [deletingId, setDeletingId] = useState(null)
  
  useEffect(() => {
    if (listStatus === 'idle') {
      loadUsers().catch((error) => {
        pushToast({
          title: 'Unable to fetch users',
          description: getErrorMessage(error),
          variant: 'error',
        })
      })
    }
  }, [listStatus, loadUsers, pushToast, getErrorMessage])

  const handleRetry = () => {
    loadUsers().catch((error) => {
      pushToast({
        title: 'Unable to fetch users',
        description: getErrorMessage(error),
        variant: 'error',
      })
    })
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteUser(id)
      pushToast({ title: 'User removed', variant: 'success' })
    } catch (error) {
      pushToast({
        title: 'Failed to delete user',
        description: getErrorMessage(error),
        variant: 'error',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const isLoading = listStatus === 'pending'
  const hasError = listStatus === 'error'

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Manage the list of users powered by JSONPlaceholder.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={ROUTES.createUser} className="btn btn-primary">
            Add user
          </Link>
          <Button variant="secondary" onClick={handleRetry} disabled={isLoading} loading={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading && users.length === 0 && (
        <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]">
          <Spinner size="lg" />
        </div>
      )}

      {hasError && users.length === 0 && (
        <div className="card card-bordered space-y-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">We hit a snag</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {getErrorMessage(listError) || 'Something unexpected happened while loading users.'}
          </p>
          <Button variant="primary" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !hasError && users.length === 0 && (
        <EmptyState
          title="No users found"
          description="Create a user to get started. JSONPlaceholder will echo your request."
          action={
            <Link to={ROUTES.createUser} className="btn btn-primary">
              Create user
            </Link>
          }
        />
      )}

      <div className="grid gap-4" aria-live="polite">
        {users.map((user) => (
          <UserRow key={user.id} user={user} onDelete={handleDelete} deleting={deletingId === user.id} />
        ))}
      </div>
    </section>
  )
}

export default Home

