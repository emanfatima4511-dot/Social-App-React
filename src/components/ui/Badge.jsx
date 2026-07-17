const variantStyles = {
  draft: 'bg-gray-200 text-gray-700',
  public: 'bg-green-100 text-green-700',
  private: 'bg-orange-100 text-orange-700',
}

const labels = {
  draft: 'Draft',
  public: 'Public',
  private: 'Private',
}

export default function Badge({ variant = 'public' }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {labels[variant]}
    </span>
  )
}