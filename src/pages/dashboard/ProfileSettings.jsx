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
      <h1 className="text-lg font-bold mb-4 sm:text-xl md:text-2xl">Profile Settings</h1>

      {successMessage && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Avatar
            </label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        <Input
          label="Full Name"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            rows={3}
            maxLength={150}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-gray-100"
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