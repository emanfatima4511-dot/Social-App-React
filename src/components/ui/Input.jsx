import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, type = 'text', placeholder, ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`px-3 py-2 border rounded-md outline-none transition-colors
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        {...rest}
      />
      {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
    </div>
  )
})

export default Input