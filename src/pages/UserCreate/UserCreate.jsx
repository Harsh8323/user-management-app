import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserForm from '../../components/UserForm/UserForm.jsx'
import Button from '../../components/Button/Button.jsx'
import { useUsers } from '../../hooks/use-users.js'
import { useToast } from '../../context/ToastProvider.jsx'
import { ROUTES } from '../../utils/constants.js'
import { getErrorMessage } from '../../utils/errors.js'

const UserCreate = () => {
  const navigate = useNavigate()
  const { createUser } = useUsers()
  const { pushToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const user = await createUser(values)
      pushToast({
        title: 'User created',
        description: `${user.name} has been added.`,
        variant: 'success',
      })
      // Navigate to home so user can see the new user in the list
      navigate(ROUTES.home)
    } catch (error) {
      console.error('[UserCreate] Error creating user:', error)
      pushToast({
        title: 'Unable to create user',
        description: getErrorMessage(error),
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Create user</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Provide contact information to create a new user in the session.
        </p>
      </div>

      <div className="card card-bordered">
        <UserForm submitLabel="Create user" onSubmit={handleSubmit} loading={isSubmitting} />
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="ghost" onClick={() => navigate(ROUTES.home)}>
          Back to list
        </Button>
      </div>
    </section>
  )
}

export default UserCreate

