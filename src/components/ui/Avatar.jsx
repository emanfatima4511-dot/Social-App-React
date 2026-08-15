const sizeMap = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-20 h-20 text-2xl',
}

const colors = [
  'bg-gradient-to-br from-red-400 to-rose-600',
  'bg-gradient-to-br from-blue-400 to-indigo-600',
  'bg-gradient-to-br from-green-400 to-emerald-600',
  'bg-gradient-to-br from-yellow-400 to-amber-600',
  'bg-gradient-to-br from-purple-400 to-violet-600',
  'bg-gradient-to-br from-pink-400 to-rose-600',
  'bg-gradient-to-br from-indigo-400 to-blue-600',
]

// Picks a consistent color for a given name, so the same person
// always gets the same background color
function colorForName(name) {
  if (!name) return colors[0]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export default function Avatar({ src, name = '', size = 'md' }) {
  const sizeClass = sizeMap[size] || sizeMap.md
  const baseClass = 'shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} ${baseClass} rounded-full object-cover`}
      />
    )
  }

  const initial = name.charAt(0).toUpperCase() || '?'

  return (
    <div
      className={`${sizeClass} ${baseClass} ${colorForName(
        name
      )} rounded-full flex items-center justify-center text-white font-bold`}
    >
      {initial}
    </div>
  )
}
