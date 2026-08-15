import { useReducer, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { storage } from '../utils/storage'
import { useAuth } from '../hooks/useAuth'
import { useFriends } from '../hooks/useFriends'
import { useMessages } from '../hooks/useMessages'
import { useAiReply } from '../hooks/useAiReply'
import { generateAutoReply } from '../utils/groq'
import { timeAgo } from '../utils/helpers'
import Avatar from '../components/ui/Avatar'

export default function MessagesPage() {
  const { userId: activePartnerId } = useParams()
  const { currentUser } = useAuth()
  const { getFriendIds } = useFriends()
  const { getConversationsFor, getConversation, sendMessage } = useMessages()
  const { isEnabled, toggle } = useAiReply()

  const [text, setText] = useState('')
  const [, setRefreshTick] = useReducer((x) => x + 1, 0)
  const [isAiThinking, setIsAiThinking] = useState(false)

  const friendIds = getFriendIds(currentUser.id)
  const conversations = getConversationsFor(currentUser.id)

  const sidebarEntries = friendIds.map((friendId) => {
    const existing = conversations.find((c) => c.partnerId === friendId)
    const user = storage.getUsers().find((u) => u.id === friendId)
    return {
      user,
      lastMessage: existing?.lastMessage || null,
    }
  })

  const activePartner = activePartnerId
    ? storage.getUsers().find((u) => u.id === activePartnerId)
    : null

  const thread = activePartnerId
    ? getConversation(currentUser.id, activePartnerId)
    : []

  const aiEnabled = activePartnerId
    ? isEnabled(currentUser.id, activePartnerId)
    : false

  function refresh() {
    setRefreshTick()
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim() || !activePartnerId) return

    sendMessage(currentUser.id, activePartnerId, text.trim())
    setText('')
    refresh()

    // If AI auto-reply is ON for this conversation, generate a reply "as" the friend
    if (aiEnabled) {
      setIsAiThinking(true)
      try {
        const updatedThread = getConversation(currentUser.id, activePartnerId)
        const messagesForContext = updatedThread.map((m) => ({
          senderName: m.senderId === currentUser.id ? currentUser.name : activePartner.name,
          text: m.text,
        }))

        const replyText = await generateAutoReply(
          messagesForContext,
          activePartner.name,
          currentUser.name
        )

        sendMessage(activePartnerId, currentUser.id, replyText)
        refresh()
      } catch (err) {
        console.error('AI reply failed:', err)
      } finally {
        setIsAiThinking(false)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 h-[75vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Messages
        </h1>
        <div className="w-24" />
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Sidebar: friend list */}
        <div className="w-20 sm:w-64 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-y-auto bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="font-bold p-3 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
          Friends
        </h2>
        {sidebarEntries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 p-3">
            Add some friends to start messaging
          </p>
        ) : (
          sidebarEntries.map(({ user, lastMessage }) => (
            <Link
              key={user.id}
              to={`/messages/${user.id}`}
              className={`flex items-center gap-2 p-3 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                activePartnerId === user.id
                  ? 'bg-blue-50 dark:bg-gray-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/60'
              }`}
            >
              <Avatar src={user.avatar} name={user.name} size="sm" />
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {lastMessage ? lastMessage.text : 'Say hi 👋'}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Chat thread */}
      <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col bg-white dark:bg-gray-800 shadow-sm">
        {!activePartner ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            Select a friend to start chatting
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Avatar src={activePartner.avatar} name={activePartner.name} size="sm" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {activePartner.name}
                </span>
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={() => {
                    toggle(currentUser.id, activePartnerId)
                    refresh()
                  }}
                  className="accent-blue-600 w-4 h-4"
                />
                AI Auto-Reply
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {thread.map((msg) => {
                const isMine = msg.senderId === currentUser.id
                return (
                  <div
                    key={msg.id}
                    className={`max-w-xs px-3.5 py-2 rounded-2xl text-sm shadow-sm ${
                      isMine
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white self-end rounded-br-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[10px] mt-1 ${
                        isMine ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {timeAgo(msg.createdAt)}
                    </div>
                  </div>
                )
              })}
              {isAiThinking && (
                <div className="self-start text-xs text-gray-400 italic">
                  {activePartner.name} is typing...
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-gray-200 dark:border-gray-700">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/25 transition-all active:scale-95"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
      </div>
    </div>
  )
}
