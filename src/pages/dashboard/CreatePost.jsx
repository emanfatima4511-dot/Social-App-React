import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import Button from '../../components/ui/Button'

export default function CreatePost() {
  const { currentUser } = useAuth()
  const { createPost } = usePosts()
  const navigate = useNavigate()

  const [imagePreview, setImagePreview] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { description: '', visibility: 'public' },
  })

  const description = watch('description') || ''

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result) // base64 string
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setImagePreview(null)
    setValue('image', null)
    // Also reset the actual file input so selecting the same file again still fires onChange
    const fileInput = document.getElementById('post-image-input')
    if (fileInput) fileInput.value = ''
  }

  function savePost(data, isDraft) {
    createPost({
      authorId: currentUser.id,
      description: data.description,
      image: imagePreview,
      isPublic: data.visibility === 'public',
      isDraft,
    })

    if (isDraft) {
      setSuccessMessage('Post saved as draft')
      reset()
      setImagePreview(null)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-lg font-bold mb-4 sm:text-xl md:text-2xl">Create Post</h1>

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
            placeholder="What's on your mind?"
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
            id="post-image-input"
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
            onClick={handleSubmit((data) => savePost(data, true))}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((data) => savePost(data, false))}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  )
}