import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { storage } from '../utils/storage'
import { usePosts } from '../hooks/usePosts'
import { useLikes } from '../hooks/useLikes'
import { useAuth } from '../hooks/useAuth'
import { timeAgo } from '../utils/helpers'
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
        <p className="text-gray-600 dark:text-gray-400">This post doesn't exist or was removed.</p>
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="rounded-2xl p-4 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 shadow-sm sm:p-6 md:p-7">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/profile/${author?.id}`}>
            <Avatar src={author?.avatar} name={author?.name} size="md" />
          </Link>
          <div>
            <Link to={`/profile/${author?.id}`} className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {author?.name || 'Unknown user'}
            </Link>
            <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap leading-relaxed">{post.description}</p>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-xl mb-4"
          />
        )}

        {/* Like */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 ${
              liked ? 'text-blue-600 font-medium' : 'hover:text-blue-600'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </button>
        </div>

        <CommentSection postId={post.id} />
      </div>
    </div>
  )
}
