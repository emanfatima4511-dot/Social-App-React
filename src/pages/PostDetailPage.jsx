import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { storage } from '../utils/storage'
import { usePosts } from '../hooks/usePosts'
import { useLikes } from '../hooks/useLikes'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../utils/helpers'
import Avatar from '../components/ui/Avatar'
import CommentSection from '../components/post/CommentSection'

export default function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { getPostById } = usePosts()
  const { getLikeCount, hasUserLiked, toggleLike } = useLikes()
  const { currentUser, isAuthenticated } = useAuth()

  const [refreshTick, setRefreshTick] = useState(0)

  const post = getPostById(postId)

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <p className="text-gray-600">This post doesn't exist or was removed.</p>
      </div>
    )
  }

  const author = storage.getUsers().find((u) => u.id === post.authorId)
  const likeCount = getLikeCount(post.id)
  const liked = hasUserLiked(post.id, currentUser?.id)

  function handleLikeClick() {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } })
      return
    }
    toggleLike(post.id, currentUser.id)
    setRefreshTick((t) => t + 1)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
        <div className="border rounded-lg p-4 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:p-5 md:p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/profile/${author?.id}`}>
            <Avatar src={author?.avatar} name={author?.name} size="md" />
          </Link>
          <div>
            <Link to={`/profile/${author?.id}`} className="font-medium hover:underline">
              {author?.name || 'Unknown user'}
            </Link>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">{post.description}</p>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-md mb-4"
          />
        )}

        {/* Like */}
        <div className="flex items-center gap-6 text-sm text-gray-600 border-t pt-3">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1 hover:text-blue-600 ${
              liked ? 'text-blue-600 font-medium' : ''
            }`}
          >
            {liked ? '♥' : '♡'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </button>
        </div>

        <CommentSection postId={post.id} />
      </div>
    </div>
  )
}