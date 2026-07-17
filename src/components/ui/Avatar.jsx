const sizeMap = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-20 h-20 text-2xl',
}

const colors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500',
  'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
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

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover`}
      />
    )
  }

  const initial = name.charAt(0).toUpperCase() || '?'

  return (
    <div
      className={`${sizeClass} ${colorForName(name)} rounded-full flex items-center justify-center text-white font-semibold`}
    >
      {initial}
    </div>
  )
}