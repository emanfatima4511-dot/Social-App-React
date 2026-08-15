import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  )
}
