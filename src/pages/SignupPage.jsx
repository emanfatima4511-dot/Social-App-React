import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  // Redirect away if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard/posts', { replace: true })
  }, [isAuthenticated, navigate])

  const password = watch('password')

  function onSubmit(data) {
    setServerError('')
    try {
      signup({ name: data.name, email: data.email, password: data.password })
      navigate('/login')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 sm:mt-12 sm:p-6 md:mt-16">
      <h1 className="text-xl font-bold mb-4 sm:text-2xl sm:mb-6">Create your account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="Enter your Name"
          autoComplete="off"
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="off"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter a strong password"
          autoComplete="off"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d).+$/,
              message: 'Password must contain an uppercase letter and a number',
            },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          autoComplete="off"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        {serverError && (
          <p className="text-sm text-red-600">{serverError}</p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="mt-2">
          Sign Up
        </Button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-medium">
          Log in
        </Link>
      </p>
    </div>
  )
}