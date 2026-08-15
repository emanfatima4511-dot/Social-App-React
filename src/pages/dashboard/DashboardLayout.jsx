import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { storage } from '../../utils/storage'
import { useAuth } from '../../hooks/useAuth'
import { useDarkMode } from '../../hooks/useDarkMode'

export default function DashboardLayout() {
  const { currentUser } = useAuth()
  const { isDark, toggleDarkMode } = useDarkMode()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const posts = storage.getPosts()
  const myPostIds = new Set(
    posts.filter((p) => p.authorId === currentUser.id).map((p) => p.id)
  )

  const [cutoff] = useState(() => Date.now() - 30 * 24 * 60 * 60 * 1000)
  const lastSeen = storage.getNotificationSeen(currentUser.id)

  // Only count notifications created after the user last viewed the notifications page
  const isUnread = (item) =>
    new Date(item.createdAt).getTime() > lastSeen && new Date(item.createdAt).getTime() >= cutoff

  const notificationCount =
    storage
      .getFriendRequests()
      .filter(
        (r) => r.toUserId === currentUser.id && (r.status === 'pending' || r.status === 'accepted') && isUnread(r)
      ).length +
    new Set(
      storage
        .getMessages()
        .filter((m) => m.receiverId === currentUser.id && isUnread(m))
        .map((m) => m.senderId)
    ).size +
    storage
      .getLikes()
      .filter((l) => myPostIds.has(l.postId) && l.userId !== currentUser.id && isUnread(l)).length +
    storage
      .getComments()
      .filter((c) => myPostIds.has(c.postId) && c.authorId !== currentUser.id && isUnread(c)).length

  const links = [
    { to: '/dashboard', label: 'Home', end: true },
    { to: '/dashboard/posts', label: 'My Posts' },
    { to: '/dashboard/notifications', label: 'Notifications', count: notificationCount },
    { to: '/dashboard/create', label: 'Create Post' },
    { to: '/dashboard/settings', label: 'Profile Settings' },
  ]

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed z-40 inset-y-0 left-0 w-64 p-4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-transform duration-200 md:static md:translate-x-0 md:w-52 md:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-all duration-150',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>
                  {link.count > 0 && (
                    <span
                      className={clsx(
                        'ml-2 min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center',
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-blue-600 text-white'
                      )}
                    >
                      {link.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            <span>{isDark ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden m-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <main className="p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
