import { formatDate } from '../../utils/helpers'
import Avatar from '../ui/Avatar'

export default function ProfileHeader({ user }) {
  return (
    <div className="mb-6">
      {/* Cover image */}
      <div
        className="h-32 rounded-t-lg sm:h-40 md:h-48 lg:h-56"
        style={
          user.coverImage
            ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(to right, #60a5fa, #a78bfa)' }
        }
      />

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 border-t-0 rounded-b-lg p-3 flex items-end gap-3 sm:p-5 sm:gap-4 md:p-6">
        <div className="-mt-8 sm:-mt-10">
          <Avatar src={user.avatar} name={user.name} size="lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold dark:text-gray-100 sm:text-xl md:text-2xl">{user.name}</h1>
          {user.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.bio}</p>}
          <div className="flex gap-3 text-xs text-gray-500 mt-1">
            {user.location && <span>📍 {user.location}</span>}
            <span>Joined {formatDate(user.joinedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}