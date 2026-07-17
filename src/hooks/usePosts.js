import { storage } from '../utils/storage'
import { generateId } from '../utils/helpers'

export function usePosts() {
  function getAllPosts() {
    return storage.getPosts()
  }

  // Public feed: only public + published posts, newest first
  function getPublicPosts() {
    return storage
      .getPosts()
      .filter((p) => p.isPublic && !p.isDraft)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // All posts by one user (used in dashboard — includes drafts/private)
  function getPostsByUser(userId) {
    return storage
      .getPosts()
      .filter((p) => p.authorId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // Only public posts by one user (used on profile page)
  function getPublicPostsByUser(userId) {
    return getPostsByUser(userId).filter((p) => p.isPublic && !p.isDraft)
  }

  function getPostById(postId) {
    return storage.getPosts().find((p) => p.id === postId) || null
  }

  function createPost({ authorId, description, image, isPublic, isDraft }) {
    const posts = storage.getPosts()
    const now = new Date().toISOString()

    const newPost = {
      id: generateId('post'),
      authorId,
      description,
      image: image || null,
      isPublic,
      isDraft,
      createdAt: now,
      updatedAt: now,
    }

    storage.setPosts([newPost, ...posts])
    return newPost
  }

  function updatePost(postId, updatedFields) {
    const posts = storage.getPosts()
    const updatedPosts = posts.map((p) =>
      p.id === postId
        ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() }
        : p
    )
    storage.setPosts(updatedPosts)
  }

  function deletePost(postId) {
    const posts = storage.getPosts()
    storage.setPosts(posts.filter((p) => p.id !== postId))
  }

  function toggleVisibility(postId) {
    const posts = storage.getPosts()
    const updatedPosts = posts.map((p) =>
      p.id === postId ? { ...p, isPublic: !p.isPublic } : p
    )
    storage.setPosts(updatedPosts)
  }

  return {
    getAllPosts,
    getPublicPosts,
    getPostsByUser,
    getPublicPostsByUser,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    toggleVisibility,
  }
}