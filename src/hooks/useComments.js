import { storage } from '../utils/storage'
import { generateId } from '../utils/helpers'

export function useComments() {
  function getCommentsForPost(postId) {
    return storage
      .getComments()
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }

  function addComment(postId, authorId, text) {
    const comments = storage.getComments()
    const newComment = {
      id: generateId('cmt'),
      postId,
      authorId,
      text,
      createdAt: new Date().toISOString(),
    }
    storage.setComments([...comments, newComment])
    return newComment
  }

  function deleteComment(commentId) {
    const comments = storage.getComments()
    storage.setComments(comments.filter((c) => c.id !== commentId))
  }

  return { getCommentsForPost, addComment, deleteComment }
}