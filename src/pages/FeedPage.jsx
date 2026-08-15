import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/post/PostCard'

export default function FeedPage() {
  const { getPublicPosts } = usePosts()
  const posts = getPublicPosts()

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Feed
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          What everyone is sharing right now
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">No posts yet — be the first to share!</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
