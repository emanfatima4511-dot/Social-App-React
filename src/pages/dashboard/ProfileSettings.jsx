import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'

export default function ProfileSettings() {
  const { currentUser, updateCurrentUser } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar || null)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser.name || '',
      bio: currentUser.bio || '',
      location: currentUser.location || '',
    },
  })

  const bio = watch('bio') || ''

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function onSubmit(data) {
    updateCurrentUser({
      name: data.name,
      bio: data.bio,
      location: data.location,
      avatar: avatarPreview,
    })
    setSuccessMessage('Profile updated successfully')
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Profile Settings
      </h1>

      {successMessage && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
          <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
              Avatar
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Upload photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
        </div>

        <Input
          label="Full Name"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            rows={3}
            maxLength={150}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-sm transition-all"
            {...register('bio', {
              maxLength: { value: 150, message: 'Bio must be 150 characters or fewer' },
            })}
          />
          <span
            className={`text-xs ${bio.length >= 140 ? 'text-red-600' : 'text-gray-500'}`}
          >
            {bio.length} / 150 characters
          </span>
        </div>

        <Input
          label="Location"
          {...register('location')}
        />

        <Button type="submit" className="mt-2 w-fit">
          Save Changes
        </Button>
      </form>
    </div>
  )
}
