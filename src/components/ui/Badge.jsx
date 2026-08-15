const variantStyles = {
  draft: 'bg-gray-100 text-gray-700 ring-1 ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600',
  public:
    'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-800',
  private:
    'bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:ring-orange-800',
}

const dotStyles = {
  draft: 'bg-gray-400',
  public: 'bg-green-500',
  private: 'bg-orange-500',
}

const labels = {
  draft: 'Draft',
  public: 'Public',
  private: 'Private',
}

export default function Badge({ variant = 'public' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />
      {labels[variant]}
    </span>
  )
}
