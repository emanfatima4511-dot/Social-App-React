import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDarkMode } from '../../hooks/useDarkMode'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-gray-800 dark:border-gray-700 sm:px-6">
      <Link to="/" className="text-lg font-bold text-blue-600 dark:text-blue-400 sm:text-xl">
        SocialApp
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleDarkMode}
          className="text-lg px-1 sm:text-xl sm:px-2"
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/dashboard/posts"
              className="text-xs font-medium hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 sm:text-sm"
            >
              Dashboard
            </Link>
            <Link to={`/profile/${currentUser.id}`}>
              <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            </Link>
            <Button variant="secondary" size="sm" onClick={logout} className="hidden sm:inline-flex">
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm" className="hidden sm:inline-flex">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}