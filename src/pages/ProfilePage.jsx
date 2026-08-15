import { Link, useParams } from 'react-router-dom'
import { useReducer } from 'react'
import { storage } from '../utils/storage'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { useFriends } from '../hooks/useFriends'
import ProfileHeader from '../components/profile/ProfileHeader'
import PostCard from '../components/post/PostCard'
import Button from '../components/ui/Button'

export default function ProfilePage() {
  const { userId } = useParams()
  const { currentUser } = useAuth()
  const { getPublicPostsByUser } = usePosts()
  const {
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    getStatusBetween,
  } = useFriends()

  const [, setRefreshTick] = useReducer((x) => x + 1, 0)

  const user = storage.getUsers().find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-600 dark:text-gray-400">This user doesn't exist.</p>
      </div>
    )
  }

  const posts = getPublicPostsByUser(userId)
  const isOwner = currentUser?.id === userId
  const friendStatus = currentUser ? getStatusBetween(currentUser.id, userId) : 'none'

  function refresh() {
    setRefreshTick()
  }

  function handleSendRequest() {
    sendRequest(currentUser.id, userId)
    refresh()
  }

  function handleAccept() {
    const requests = storage.getFriendRequests()
    const req = requests.find(
      (r) =>
        r.status === 'pending' &&
        r.fromUserId === userId &&
        r.toUserId === currentUser.id
    )
    if (req) acceptRequest(req.id)
    refresh()
  }

  function handleReject() {
    const requests = storage.getFriendRequests()
    const req = requests.find(
      (r) =>
        r.status === 'pending' &&
        r.fromUserId === userId &&
        r.toUserId === currentUser.id
    )
    if (req) rejectRequest(req.id)
    refresh()
  }

  function handleRemoveFriend() {
    removeFriend(currentUser.id, userId)
    refresh()
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>

      <ProfileHeader user={user} />

      <div className="mb-6 flex flex-wrap gap-2">
        {isOwner && (
          <Link to="/dashboard/settings">
            <Button variant="secondary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Button>
          </Link>
        )}

        {!isOwner && currentUser && (
          <>
            {friendStatus === 'none' && (
              <Button size="sm" onClick={handleSendRequest}>Add Friend</Button>
            )}
            {friendStatus === 'pending_sent' && (
              <Button size="sm" variant="secondary" disabled>Request Sent ✓</Button>
            )}
            {friendStatus === 'pending_received' && (
              <>
                <Button size="sm" onClick={handleAccept}>Accept</Button>
                <Button size="sm" variant="danger" onClick={handleReject}>Reject</Button>
              </>
            )}
            {friendStatus === 'friends' && (
              <>
                <Link to={`/messages/${user.id}`}>
                  <Button size="sm">Message</Button>
                </Link>
                <Button size="sm" variant="secondary" onClick={handleRemoveFriend}>
                  Friends ✓
                </Button>
              </>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Posts</h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:ring-blue-800">
          {posts.length}
        </span>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-12">
          No public posts yet
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}