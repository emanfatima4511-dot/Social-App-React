import { Link, useParams } from 'react-router-dom'
import { storage } from '../utils/storage'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import ProfileHeader from '../components/profile/ProfileHeader'
import PostCard from '../components/post/PostCard'
import Button from '../components/ui/Button'

export default function ProfilePage() {
  const { userId } = useParams()
  const { currentUser } = useAuth()
  const { getPublicPostsByUser } = usePosts()

  const user = storage.getUsers().find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-600">This user doesn't exist.</p>
      </div>
    )
  }

  const posts = getPublicPostsByUser(userId)
  const isOwner = currentUser?.id === userId

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProfileHeader user={user} />

      {isOwner && (
        <div className="mb-4">
          <Link to="/dashboard/settings">
            <Button variant="secondary" size="sm">Edit Profile</Button>
          </Link>
        </div>
      )}

      <h2 className="font-semibold mb-3">Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm">No public posts yet</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}