// Keys used in localStorage
const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
}

// Generic helpers to read/write any array from localStorage
function getArray(key) {
  const raw = localStorage.getItem(key)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function setArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr))
}

export const storage = {
  // --- USERS ---
  getUsers() {
    return getArray(KEYS.USERS)
  },
  setUsers(users) {
    setArray(KEYS.USERS, users)
  },

  // --- POSTS ---
  getPosts() {
    return getArray(KEYS.POSTS)
  },
  setPosts(posts) {
    setArray(KEYS.POSTS, posts)
  },

  // --- COMMENTS ---
  getComments() {
    return getArray(KEYS.COMMENTS)
  },
  setComments(comments) {
    setArray(KEYS.COMMENTS, comments)
  },

  // --- LIKES ---
  getLikes() {
    return getArray(KEYS.LIKES)
  },
  setLikes(likes) {
    setArray(KEYS.LIKES, likes)
  },

  // --- CURRENT USER (session) ---
  getCurrentUser() {
    const raw = localStorage.getItem(KEYS.CURRENT_USER)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  setCurrentUser(user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user))
  },
  clearCurrentUser() {
    localStorage.removeItem(KEYS.CURRENT_USER)
  },
}