import { storage } from '../utils/storage'
import { generateId } from '../utils/helpers'

export function useMessages() {
  // All messages between two specific users, oldest first (like a chat thread)
  function getConversation(userIdA, userIdB) {
    return storage
      .getMessages()
      .filter(
        (m) =>
          (m.senderId === userIdA && m.receiverId === userIdB) ||
          (m.senderId === userIdB && m.receiverId === userIdA)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }

  function sendMessage(senderId, receiverId, text) {
    const messages = storage.getMessages()
    const newMessage = {
      id: generateId('msg'),
      senderId,
      receiverId,
      text,
      createdAt: new Date().toISOString(),
    }
    storage.setMessages([...messages, newMessage])
    return newMessage
  }

  // Returns the list of people the user has ever messaged, each with their last message
  // Used for the inbox / conversation list view
  function getConversationsFor(userId) {
    const messages = storage.getMessages()
    const partnerIds = new Set()

    messages.forEach((m) => {
      if (m.senderId === userId) partnerIds.add(m.receiverId)
      if (m.receiverId === userId) partnerIds.add(m.senderId)
    })

    return Array.from(partnerIds)
      .map((partnerId) => {
        const thread = getConversation(userId, partnerId)
        const lastMessage = thread[thread.length - 1]
        return { partnerId, lastMessage }
      })
      .sort(
        (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
      )
  }

  // Latest message received from each sender, used for notifications
  function getIncomingNotifications(userId, cutoff) {
    const latestBySender = {}

    storage.getMessages().forEach((m) => {
      if (m.receiverId !== userId) return
      if (new Date(m.createdAt).getTime() < cutoff) return

      const prev = latestBySender[m.senderId]
      if (!prev || new Date(m.createdAt).getTime() > new Date(prev.createdAt).getTime()) {
        latestBySender[m.senderId] = m
      }
    })

    return Object.values(latestBySender).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  return { getConversation, sendMessage, getConversationsFor, getIncomingNotifications }
}