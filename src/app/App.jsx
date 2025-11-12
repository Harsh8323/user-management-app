import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './routes.jsx'
import Spinner from '../components/Spinner/Spinner.jsx'
import ErrorBoundary from '../context/ErrorBoundary.jsx'
import { ToastProvider } from '../context/ToastProvider.jsx'
import { UsersProvider } from '../hooks/use-users.js'

const App = () => {
  const element = useRoutes(routes)

  return (
    <ToastProvider>
      <ErrorBoundary>
        <UsersProvider>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
                <Spinner size="lg" />
              </div>
            }
          >
            {element}
          </Suspense>
        </UsersProvider>
      </ErrorBoundary>
    </ToastProvider>
  )
}

export default App

