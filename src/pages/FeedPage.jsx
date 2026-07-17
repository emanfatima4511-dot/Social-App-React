import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/post/PostCard'

export default function FeedPage() {
  const { getPublicPosts } = usePosts()
  const posts = getPublicPosts()

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:max-w-2xl">
      <h1 className="text-lg font-bold mb-4 sm:text-xl md:text-2xl">Feed</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-12">
          No posts yet — be the first to share!
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}