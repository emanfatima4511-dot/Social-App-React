import { formatDate } from '../../utils/helpers'
import Avatar from '../ui/Avatar'

export default function ProfileHeader({ user }) {
  return (
    <div className="mb-6">
      {/* Cover image */}
      <div
        className="h-32 rounded-t-2xl sm:h-40 md:h-48 lg:h-56 shadow-sm"
        style={
          user.coverImage
            ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {
                background:
                  'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #a855f7 100%)',
              }
        }
      />

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-2xl p-3 flex items-end gap-3 sm:p-5 sm:gap-4 md:p-6">
        <div className="-mt-8 sm:-mt-10">
          <Avatar src={user.avatar} name={user.name} size="lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl md:text-2xl">{user.name}</h1>
          {user.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.bio}</p>}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Joined {formatDate(user.joinedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
