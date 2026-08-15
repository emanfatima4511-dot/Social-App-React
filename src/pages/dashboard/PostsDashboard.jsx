import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import { useLikes } from '../../hooks/useLikes'
import { useComments } from '../../hooks/useComments'
import { formatDate } from '../../utils/helpers'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

export default function PostsDashboard() {
  const { currentUser } = useAuth()
  const { getPostsByUser, deletePost, toggleVisibility, updatePost } = usePosts()
  const { getLikeCount } = useLikes()
  const { getCommentsForPost } = useComments()

  const [refreshTick, setRefreshTick] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null) // post being confirmed for deletion

  const posts = getPostsByUser(currentUser.id)

  function refresh() {
    setRefreshTick((t) => t + 1)
  }

  function handleToggleVisibility(postId) {
    toggleVisibility(postId)
    refresh()
  }

  function handlePublish(postId) {
    updatePost(postId, { isDraft: false, isPublic: true })
    refresh()
  }

  function confirmDelete() {
    deletePost(deleteTarget.id)
    setDeleteTarget(null)
    refresh()
  }

  function statusFor(post) {
    if (post.isDraft) return 'draft'
    return post.isPublic ? 'public' : 'private'
  }

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Posts</h1>
        <p className="text-gray-600 dark:text-gray-400">
          You haven't created any posts yet.{' '}
          <Link to="/dashboard/create" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Create your first post!
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Posts</h1>

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-col gap-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow sm:p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={statusFor(post)} />
                <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{post.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {getLikeCount(post.id)} Likes · {getCommentsForPost(post.id).length} Comments
              </p>
            </div>

            <div className="flex gap-1 shrink-0 sm:flex-col">
              <Link to={`/dashboard/edit/${post.id}`}>
                <Button variant="secondary" size="sm" className="w-full">
                  Edit
                </Button>
              </Link>

              {post.isDraft && (
                <Button size="sm" onClick={() => handlePublish(post.id)}>
                  Publish
                </Button>
              )}

              {!post.isDraft && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleVisibility(post.id)}
                >
                  Make {post.isPublic ? 'Private' : 'Public'}
                </Button>
              )}

              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteTarget(post)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this post?"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This action cannot be undone. Are you sure you want to delete this post?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}