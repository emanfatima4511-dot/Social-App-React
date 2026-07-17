// Generates a unique ID like "usr_1703001234567_a1b2c3"
export function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// Formats an ISO date string into something readable, e.g. "Jan 15, 2025"
export function formatDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Formats a date as relative time, e.g. "2h ago", "3d ago"
export function timeAgo(isoString) {
  if (!isoString) return ''
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)

  const intervals = [
    { label: 'y', secs: 31536000 },
    { label: 'mo', secs: 2592000 },
    { label: 'd', secs: 86400 },
    { label: 'h', secs: 3600 },
    { label: 'm', secs: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.secs)
    if (count >= 1) return `${count}${interval.label} ago`
  }
  return 'just now'
}