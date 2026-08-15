import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import Button from '../../components/ui/Button'
import clsx from 'clsx'

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

  const visibility = watch('visibility')

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

  const visibilityOptions = [
    { value: 'public', label: '🌍 Public' },
    { value: 'private', label: '🔒 Private' },
  ]

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Edit Post
      </h1>

      {successMessage && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
          {successMessage}
        </p>
      )}

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            rows={4}
            className={`px-3 py-2 border rounded-xl outline-none transition-all focus:ring-2 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-sm ${
              errors.description
                ? 'border-red-400 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image (optional)</label>
          <label className="inline-flex items-center gap-2 w-fit px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 cursor-pointer transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {imagePreview ? 'Change image' : 'Upload image'}
            <input
              id="edit-post-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 rounded-xl object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={clearImage}
                className="text-sm text-red-500 hover:text-red-600 font-medium mt-1.5 transition-colors"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</label>
          <div className="flex gap-2">
            {visibilityOptions.map((option) => (
              <label
                key={option.value}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-150',
                  visibility === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-600 shadow-sm'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('visibility')}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:gap-3">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleSubmit((data) => saveChanges(data, true))}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={handleSubmit((data) => saveChanges(data, false))}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  )
}
