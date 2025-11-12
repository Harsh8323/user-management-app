import { Link } from 'react-router-dom'
import Button from '../Button/Button.jsx'
import { ROUTES } from '../../utils/constants.js'

const UserRow = ({ user, onDelete, deleting }) => (
  <div className="card card-bordered flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">{user.name}</h3>
      <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
      <p className="text-sm text-[var(--muted-foreground)]">{user.phone}</p>
    </div>
    <div className="flex flex-wrap gap-2">
      <Link to={ROUTES.userDetail(user.id)} className="btn btn-secondary">
        View
      </Link>
      <Link to={ROUTES.editUser(user.id)} className="btn btn-secondary">
        Edit
      </Link>
      <Button variant="danger" loading={deleting} onClick={() => onDelete(user.id)}>
        Delete
      </Button>
    </div>
  </div>
)

export default UserRow

