import { Link, useNavigate } from 'react-router-dom'
import { storage } from '../../utils/storage'
import { useAuth } from '../../hooks/useAuth'
import { useLikes } from '../../hooks/useLikes'
import { useComments } from '../../hooks/useComments'
import { timeAgo } from '../../utils/helpers'
import Avatar from '../ui/Avatar'

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useAuth()
  const { getLikeCount, hasUserLiked, toggleLike } = useLikes()
  const { getCommentsForPost } = useComments()

  const author = storage.getUsers().find((u) => u.id === post.authorId)
  const likeCount = getLikeCount(post.id)
  const commentCount = getCommentsForPost(post.id).length
  const liked = hasUserLiked(post.id, currentUser?.id)

  function goToPost() {
    navigate(`/posts/${post.id}`)
  }

  function handleLikeClick(e) {
    e.stopPropagation() // don't trigger goToPost when clicking the like button
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } })
      return
    }
    toggleLike(post.id, currentUser.id)
  }

  function handleCommentClick(e) {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } })
      return
    }
    navigate(`/posts/${post.id}`)
  }

  return (
    <div
      onClick={goToPost}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:shadow-md transition-shadow cursor-pointer sm:p-4 md:p-5"
    >
      {/* Author row */}
      <div
        className="flex items-center gap-3 mb-3"
        onClick={(e) => e.stopPropagation()}
      >
        <Link to={`/profile/${author?.id}`}>
          <Avatar src={author?.avatar} name={author?.name} size="sm" />
        </Link>
        <div>
          <Link
            to={`/profile/${author?.id}`}
            className="font-medium hover:underline"
          >
            {author?.name || 'Unknown user'}
          </Link>
          <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-wrap">
        {post.description}
      </p>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full max-h-96 object-cover rounded-md mb-3"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3 sm:gap-6">
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-1 hover:text-blue-600 ${
            liked ? 'text-blue-600 font-medium' : ''
          }`}
        >
          {liked ? '♥' : '♡'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </button>
        <button
          onClick={handleCommentClick}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          💬 {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
        </button>
      </div>
    </div>
  )
}