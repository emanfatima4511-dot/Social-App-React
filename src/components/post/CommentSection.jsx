import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useComments } from '../../hooks/useComments'
import { storage } from '../../utils/storage'
import { timeAgo } from '../../utils/helpers'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function CommentSection({ postId }) {
  const { currentUser, isAuthenticated } = useAuth()
  const { getCommentsForPost, addComment, deleteComment } = useComments()
  const [text, setText] = useState('')
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null)

  // Re-read comments fresh each render (component re-renders after add/delete via key state below)
  const [refreshTick, setRefreshTick] = useState(0)
  const comments = getCommentsForPost(postId)

  function handleAddComment(e) {
    e.preventDefault()
    if (!text.trim()) return
    addComment(postId, currentUser.id, text.trim())
    setText('')
    setRefreshTick((t) => t + 1)
  }

  function handleDelete(commentId) {
    deleteComment(commentId)
    setConfirmingDeleteId(null)
    setRefreshTick((t) => t + 1)
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      <div className="flex flex-col gap-3 mb-4">
        {comments.map((comment) => {
          const author = storage.getUsers().find((u) => u.id === comment.authorId)
          const isOwnComment = comment.authorId === currentUser?.id

          return (
            <div key={comment.id} className="flex gap-2.5">
              <Link to={`/profile/${author?.id}`}>
                <Avatar src={author?.avatar} name={author?.name} size="sm" />
              </Link>
              <div className="flex-1 bg-gray-50 dark:bg-gray-700/60 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/profile/${author?.id}`}
                    className="text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {author?.name || 'Unknown user'}
                  </Link>
                  <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5 leading-relaxed">{comment.text}</p>

                {isOwnComment && (
                  <div className="mt-1">
                    {confirmingDeleteId === comment.id ? (
                      <span className="text-xs">
                        Are you sure?{' '}
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 font-medium hover:underline mr-2"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(null)}
                          className="text-gray-600 hover:underline"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmingDeleteId(comment.id)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="flex flex-col gap-2 sm:flex-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <Button type="submit" className="sm:w-auto w-full">Post</Button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>{' '}
          to comment
        </p>
      )}
    </div>
  )
}