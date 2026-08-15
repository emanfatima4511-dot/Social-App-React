import { storage } from '../utils/storage'
import { generateId } from '../utils/helpers'

export function useFriends() {
  // Send a friend request from one user to another
  function sendRequest(fromUserId, toUserId) {
    const requests = storage.getFriendRequests()

    // Don't allow duplicate pending/accepted requests between the same two people
    const alreadyExists = requests.some(
      (r) =>
        ((r.fromUserId === fromUserId && r.toUserId === toUserId) ||
          (r.fromUserId === toUserId && r.toUserId === fromUserId)) &&
        (r.status === 'pending' || r.status === 'accepted')
    )
    if (alreadyExists) return

    const newRequest = {
      id: generateId('freq'),
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    storage.setFriendRequests([...requests, newRequest])
  }

  function acceptRequest(requestId) {
    const requests = storage.getFriendRequests()
    const updated = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'accepted' } : r
    )
    storage.setFriendRequests(updated)
  }

  function rejectRequest(requestId) {
    const requests = storage.getFriendRequests()
    // Rejecting just removes it, so the two users can send a request again later
    storage.setFriendRequests(requests.filter((r) => r.id !== requestId))
  }

  function removeFriend(userId1, userId2) {
    const requests = storage.getFriendRequests()
    const filtered = requests.filter(
      (r) =>
        !(
          r.status === 'accepted' &&
          ((r.fromUserId === userId1 && r.toUserId === userId2) ||
            (r.fromUserId === userId2 && r.toUserId === userId1))
        )
    )
    storage.setFriendRequests(filtered)
  }

  // Returns: 'none' | 'pending_sent' | 'pending_received' | 'friends'
  function getStatusBetween(userIdA, userIdB) {
    const requests = storage.getFriendRequests()
    const found = requests.find(
      (r) =>
        (r.fromUserId === userIdA && r.toUserId === userIdB) ||
        (r.fromUserId === userIdB && r.toUserId === userIdA)
    )

    if (!found) return 'none'
    if (found.status === 'accepted') return 'friends'
    if (found.status === 'pending' && found.fromUserId === userIdA) return 'pending_sent'
    if (found.status === 'pending' && found.fromUserId === userIdB) return 'pending_received'
    return 'none'
  }

  // Incoming pending requests for a user (to show in a notifications/requests list)
  function getPendingRequestsFor(userId) {
    return storage
      .getFriendRequests()
      .filter((r) => r.toUserId === userId && r.status === 'pending')
  }

  // All accepted friends for a user, returned as an array of user IDs
  function getFriendIds(userId) {
    const requests = storage.getFriendRequests()
    return requests
      .filter((r) => r.status === 'accepted' && (r.fromUserId === userId || r.toUserId === userId))
      .map((r) => (r.fromUserId === userId ? r.toUserId : r.fromUserId))
  }

  function areFriends(userIdA, userIdB) {
    return getStatusBetween(userIdA, userIdB) === 'friends'
  }

  return {
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    getStatusBetween,
    getPendingRequestsFor,
    getFriendIds,
    areFriends,
  }
}