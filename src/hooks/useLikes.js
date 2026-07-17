import { storage } from '../utils/storage'
import { generateId } from '../utils/helpers'

export function useLikes() {
  function getLikesForPost(postId) {
    return storage.getLikes().filter((l) => l.postId === postId)
  }

  function getLikeCount(postId) {
    return getLikesForPost(postId).length
  }

  function hasUserLiked(postId, userId) {
    if (!userId) return false
    return storage.getLikes().some((l) => l.postId === postId && l.userId === userId)
  }

  function toggleLike(postId, userId) {
    const likes = storage.getLikes()
    const existing = likes.find((l) => l.postId === postId && l.userId === userId)

    if (existing) {
      // Unlike
      storage.setLikes(likes.filter((l) => l.id !== existing.id))
    } else {
      // Like
      const newLike = {
        id: generateId('like'),
        postId,
        userId,
        createdAt: new Date().toISOString(),
      }
      storage.setLikes([...likes, newLike])
    }
  }

  return { getLikesForPost, getLikeCount, hasUserLiked, toggleLike }
}