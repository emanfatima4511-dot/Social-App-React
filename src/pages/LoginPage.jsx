import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectMessage = location.state?.message
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard/posts', { replace: true })
  }, [isAuthenticated, navigate])

  function onSubmit(data) {
    setServerError('')
    try {
      login(data.email, data.password)
      navigate('/dashboard/posts')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 sm:mt-12 sm:p-6 md:mt-16">
      <h1 className="text-xl font-bold mb-4 sm:text-2xl sm:mb-6">Log in</h1>

      {redirectMessage && (
        <p className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 mb-4">
          {redirectMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        {serverError && (
          <p className="text-sm text-red-600">{serverError}</p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="mt-2">
          Log In
        </Button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}