import { Component } from 'react'
import Button from '../components/Button/Button.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (typeof window !== 'undefined') {
      console.error('Unhandled error caught by ErrorBoundary', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
        <div className="card max-w-lg space-y-4">
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Something went wrong</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            An unexpected error occurred. Please try again or refresh the page. If the problem
            persists, contact support.
          </p>
          <div className="flex justify-center">
            <Button variant="primary" onClick={this.handleReset}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary

