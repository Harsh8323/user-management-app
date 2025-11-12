import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Spinner from '../../components/Spinner/Spinner.jsx'
import Button from '../../components/Button/Button.jsx'
import { useUsers } from '../../hooks/use-users.js'
import { useToast } from '../../context/ToastProvider.jsx'
import { fetchUser } from '../../features/users/api.js'
import { mapApiUserToModel } from '../../features/users/mappers.js'
import { getErrorMessage, NotFoundError } from '../../utils/errors.js'
import { ROUTES } from '../../utils/constants.js'

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { findUser, deleteUser } = useUsers()
  const { pushToast } = useToast()
  const [user, setUser] = useState(() => findUser(id))
  const [status, setStatus] = useState(user ? 'success' : 'idle')
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let active = true

    if (!user) {
      setStatus('pending')

      fetchUser(id)
        .then((response) => {
          if (!active) return
          const mapped = mapApiUserToModel(response)
          setUser(mapped)
          setStatus('success')
        })
        .catch((err) => {
          if (!active) return
          setError(err)
          setStatus('error')
        })
    }

    return () => {
      active = false
    }
  }, [id, user])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteUser(id)
      pushToast({ title: 'User deleted', variant: 'success' })
      navigate(ROUTES.home)
    } catch (err) {
      pushToast({
        title: 'Failed to delete user',
        description: getErrorMessage(err),
        variant: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === 'pending') {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (status === 'error') {
    const message =
      error instanceof NotFoundError
        ? 'We could not find that user. They may have been removed.'
        : getErrorMessage(error)

    return (
      <div className="card card-bordered space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">User unavailable</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{message}</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Link to={ROUTES.home} className="btn btn-primary">
            Back to list
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">JSONPlaceholder user profile</p>
        </div>
        <div className="flex gap-2">
          <Link to={ROUTES.editUser(user.id)} className="btn btn-secondary">
            Edit user
          </Link>
          <Button variant="danger" loading={isDeleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card card-bordered space-y-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Contact details</h2>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <div>
              <p className="font-medium text-[var(--foreground)]">Email</p>
              <a href={`mailto:${user.email}`} className="break-all">
                {user.email}
              </a>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Phone</p>
              <a href={`tel:${user.phone}`} className="break-all">
                {user.phone}
              </a>
            </div>
          </div>
        </div>
        <div className="card card-bordered space-y-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Actions</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            JSONPlaceholder is a fake API, so edits will not persist remotely, but we keep them synced
            inside this session.
          </p>
          <div className="flex gap-2">
            <Link to={ROUTES.home} className="btn btn-secondary">
              Back to list
            </Link>
            <Link to={ROUTES.editUser(user.id)} className="btn btn-primary">
              Edit details
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserDetail

