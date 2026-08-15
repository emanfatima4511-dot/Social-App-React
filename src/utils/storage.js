// Keys used in localStorage
const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
  FRIEND_REQUESTS: 'friendRequests',
  MESSAGES: 'messages',
  AI_SETTINGS: 'aiSettings',
  NOTIFICATION_SEEN: 'notificationSeenAt',
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

  // --- FRIEND REQUESTS ---
  getFriendRequests() {
    return getArray(KEYS.FRIEND_REQUESTS)
  },
  setFriendRequests(requests) {
    setArray(KEYS.FRIEND_REQUESTS, requests)
  },

  // --- MESSAGES ---
  getMessages() {
    return getArray(KEYS.MESSAGES)
  },
  setMessages(messages) {
    setArray(KEYS.MESSAGES, messages)
  },
  // --- AI AUTO-REPLY SETTINGS ---
  getAiSettings() {
    return getArray(KEYS.AI_SETTINGS)
  },
  setAiSettings(settings) {
    setArray(KEYS.AI_SETTINGS, settings)
  },

  // --- NOTIFICATION "LAST SEEN" TIMESTAMPS (per user) ---
  getNotificationSeen(userId) {
    const raw = localStorage.getItem(KEYS.NOTIFICATION_SEEN)
    if (!raw) return 0
    try {
      const map = JSON.parse(raw)
      return map[userId] || 0
    } catch {
      return 0
    }
  },
  setNotificationSeen(userId, timestamp) {
    const raw = localStorage.getItem(KEYS.NOTIFICATION_SEEN)
    const map = (() => {
      if (!raw) return {}
      try {
        return JSON.parse(raw)
      } catch {
        return {}
      }
    })()
    map[userId] = timestamp
    localStorage.setItem(KEYS.NOTIFICATION_SEEN, JSON.stringify(map))
  },
}