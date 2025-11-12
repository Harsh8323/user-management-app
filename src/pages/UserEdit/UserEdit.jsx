import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../../components/Spinner/Spinner.jsx'
import UserForm from '../../components/UserForm/UserForm.jsx'
import Button from '../../components/Button/Button.jsx'
import { useUsers } from '../../hooks/use-users.js'
import { useToast } from '../../context/ToastProvider.jsx'
import { fetchUser } from '../../features/users/api.js'
import { mapApiUserToModel } from '../../features/users/mappers.js'
import { ROUTES } from '../../utils/constants.js'
import { getErrorMessage } from '../../utils/errors.js'

const UserEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { findUser, updateUser } = useUsers()
  const { pushToast } = useToast()
  const [user, setUser] = useState(() => findUser(id))
  const [status, setStatus] = useState(user ? 'success' : 'idle')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    if (!user) {
      setStatus('pending')
      fetchUser(id)
        .then((data) => {
          if (!active) return
          const mapped = mapApiUserToModel(data)
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

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const updated = await updateUser(id, values)
      pushToast({
        title: 'User updated',
        description: `${updated.name} has been updated.`,
        variant: 'success',
      })
      navigate(ROUTES.userDetail(updated.id))
    } catch (err) {
      pushToast({
        title: 'Unable to update user',
        description: getErrorMessage(err),
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
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
    return (
      <div className="card card-bordered space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">We could not load this user</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {getErrorMessage(error) || 'Try refreshing the page or navigating back to the list.'}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button variant="primary" onClick={() => navigate(ROUTES.home)}>
            Back to list
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Edit user</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Update user information. Changes will be reflected immediately in the list.
        </p>
      </div>

      <div className="card card-bordered">
        <UserForm initialValues={user} submitLabel="Save changes" onSubmit={handleSubmit} loading={isSubmitting} />
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="ghost" onClick={() => navigate(ROUTES.userDetail(user.id))}>
          Back to detail
        </Button>
      </div>
    </section>
  )
}

export default UserEdit

