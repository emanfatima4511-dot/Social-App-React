import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDarkMode } from '../../hooks/useDarkMode'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b border-gray-200/70 bg-white/80 backdrop-blur-lg dark:bg-gray-900/80 dark:border-gray-700/70 sm:px-6">
      <Link
        to="/"
        className="flex items-center gap-2 text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-xl"
      >
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-blue-600/30">
          S
        </span>
        SocialApp
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/messages"
              title="Messages"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors sm:text-sm"
            >
              Dashboard
            </Link>
            <Link to={`/profile/${currentUser.id}`} className="transition-transform hover:scale-105">
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
              <Button size="sm" className="hidden sm:inline-flex">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
