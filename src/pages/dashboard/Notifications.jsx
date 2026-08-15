import { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { storage } from '../../utils/storage'
import { useAuth } from '../../hooks/useAuth'
import { useFriends } from '../../hooks/useFriends'
import { useMessages } from '../../hooks/useMessages'
import { timeAgo } from '../../utils/helpers'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'

const NOTIFICATION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export default function Notifications() {
  const { currentUser } = useAuth()
  const { acceptRequest, rejectRequest } = useFriends()
  const { getIncomingNotifications } = useMessages()
  const [, setRefreshTick] = useReducer((x) => x + 1, 0)

  const [cutoff] = useState(() => Date.now() - NOTIFICATION_TTL_MS)

  // Mark all notifications as seen as soon as the user views this page
  useEffect(() => {
    storage.setNotificationSeen(currentUser.id, Date.now())
  }, [currentUser.id])

  const users = storage.getUsers()
  const posts = storage.getPosts()

  const myPostIds = new Set(
    posts.filter((p) => p.authorId === currentUser.id).map((p) => p.id)
  )

  const messages = getIncomingNotifications(currentUser.id, cutoff)

  const friendRequests = storage
    .getFriendRequests()
    .filter(
      (r) =>
        r.toUserId === currentUser.id &&
        (r.status === 'pending' || r.status === 'accepted') &&
        new Date(r.createdAt).getTime() >= cutoff
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const likes = storage
    .getLikes()
    .filter(
      (l) =>
        myPostIds.has(l.postId) &&
        l.userId !== currentUser.id &&
        new Date(l.createdAt).getTime() >= cutoff
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const comments = storage
    .getComments()
    .filter(
      (c) =>
        myPostIds.has(c.postId) &&
        c.authorId !== currentUser.id &&
        new Date(c.createdAt).getTime() >= cutoff
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  function userName(userId) {
    return users.find((u) => u.id === userId)?.name || 'Unknown user'
  }

  function userAvatar(userId) {
    return users.find((u) => u.id === userId)?.avatar || null
  }

  function postPreview(postId) {
    const post = posts.find((p) => p.id === postId)
    if (!post) return 'a post'
    const text = post.description
    return text.length > 60 ? `${text.slice(0, 60)}...` : text
  }

  function handleAccept(requestId) {
    acceptRequest(requestId)
    setRefreshTick((x) => x + 1)
  }

  function handleReject(requestId) {
    rejectRequest(requestId)
    setRefreshTick((x) => x + 1)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-lg font-bold mb-6 sm:text-xl md:text-2xl">Notifications</h1>

      {friendRequests.length === 0 && likes.length === 0 && comments.length === 0 && messages.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-16">
          No notifications yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {messages.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                Messages
              </h2>
              <div className="flex flex-col gap-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link to={`/messages/${message.senderId}`} className="shrink-0">
                      <Avatar src={userAvatar(message.senderId)} name={userName(message.senderId)} size="sm" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <Link to={`/profile/${message.senderId}`} className="font-medium hover:underline">
                          {userName(message.senderId)}
                        </Link>{' '}
                        sent you a message
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate mt-1">
                        {message.text}
                      </p>
                    </div>
                    <Link to={`/messages/${message.senderId}`} className="shrink-0">
                      <Button variant="secondary" size="sm">
                        Reply
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
          {friendRequests.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                Friend Requests
              </h2>
              <div className="flex flex-col gap-2">
                {friendRequests.map((req) => {
                  const isAccepted = req.status === 'accepted'
                  return (
                    <div
                      key={req.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Link to={`/profile/${req.fromUserId}`} className="shrink-0">
                        <Avatar src={userAvatar(req.fromUserId)} name={userName(req.fromUserId)} size="sm" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/profile/${req.fromUserId}`}
                          className="font-medium hover:underline"
                        >
                          {userName(req.fromUserId)}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isAccepted
                            ? 'You are now friends · '
                            : 'sent you a friend request · '}
                          {timeAgo(req.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {isAccepted ? (
                          <Link to={`/profile/${req.fromUserId}`}>
                            <Button size="sm">View profile</Button>
                          </Link>
                        ) : (
                          <>
                            <Button size="sm" onClick={() => handleAccept(req.id)}>
                              Accept
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handleReject(req.id)}>
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {likes.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                Likes
              </h2>
              <div className="flex flex-col gap-2">
                {likes.map((like) => (
                  <div
                    key={like.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link to={`/profile/${like.userId}`} className="shrink-0">
                      <Avatar src={userAvatar(like.userId)} name={userName(like.userId)} size="sm" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <Link to={`/profile/${like.userId}`} className="font-medium hover:underline">
                          {userName(like.userId)}
                        </Link>{' '}
                        liked your post
                      </p>
                      <Link to={`/posts/${like.postId}`} className="block text-xs text-gray-500 dark:text-gray-400 truncate hover:underline">
                        “{postPreview(like.postId)}” · {timeAgo(like.createdAt)}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {comments.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                Comments
              </h2>
              <div className="flex flex-col gap-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link to={`/profile/${comment.authorId}`} className="shrink-0">
                      <Avatar src={userAvatar(comment.authorId)} name={userName(comment.authorId)} size="sm" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <Link to={`/profile/${comment.authorId}`} className="font-medium hover:underline">
                          {userName(comment.authorId)}
                        </Link>{' '}
                        commented on your post
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        “{comment.text}”
                      </p>
                      <Link to={`/posts/${comment.postId}`} className="block text-xs text-gray-500 dark:text-gray-400 truncate mt-1 hover:underline">
                        {postPreview(comment.postId)} · {timeAgo(comment.createdAt)}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
