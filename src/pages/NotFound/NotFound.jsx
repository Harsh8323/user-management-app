import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants.js'
import Button from '../../components/Button/Button.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        action={
          <Link to={ROUTES.home}>
            <Button variant="primary">Go to Home</Button>
          </Link>
        }
      />
    </div>
  )
}

export default NotFound

