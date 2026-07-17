import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import Button from '../../components/ui/Button'

export default function EditPost() {
  const { postId } = useParams()
  const { currentUser } = useAuth()
  const { getPostById, updatePost } = usePosts()
  const navigate = useNavigate()

  const post = getPostById(postId)

  const [imagePreview, setImagePreview] = useState(post?.image || null)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: post?.description || '',
      visibility: post?.isPublic ? 'public' : 'private',
    },
  })

  const description = watch('description') || ''

  // If the post doesn't belong to this user (or doesn't exist), kick them out
  useEffect(() => {
    if (!post || post.authorId !== currentUser.id) {
      navigate('/dashboard/posts', { replace: true })
    }
  }, [post, currentUser, navigate])

  if (!post || post.authorId !== currentUser.id) {
    return null
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setImagePreview(null)
    const fileInput = document.getElementById('edit-post-image-input')
    if (fileInput) fileInput.value = ''
  }

  function saveChanges(data, isDraft) {
    updatePost(post.id, {
      description: data.description,
      image: imagePreview,
      isPublic: data.visibility === 'public',
      isDraft,
    })

    if (isDraft) {
      setSuccessMessage('Post saved as draft')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-lg font-bold mb-4 sm:text-xl md:text-2xl">Edit Post</h1>

      {successMessage && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
          {successMessage}
        </p>
      )}

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            rows={4}
            className={`px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-gray-100 ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' },
            })}
          />
          {errors.description && (
            <span className="text-sm text-red-600">{errors.description.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image (optional)</label>
          <input
            id="edit-post-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="text-sm text-red-600 mt-1 hover:underline"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="public" {...register('visibility')} />
              Public
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="private" {...register('visibility')} />
              Private
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSubmit((data) => saveChanges(data, true))}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((data) => saveChanges(data, false))}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  )
}