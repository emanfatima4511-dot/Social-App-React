import { storage } from '../utils/storage'
import { generateId } from '../utils/helpers'

export function useAiReply() {
  // Is AI auto-reply ON for "userId auto-replies to partnerId"?
  function isEnabled(userId, partnerId) {
    const settings = storage.getAiSettings()
    const found = settings.find(
      (s) => s.userId === userId && s.partnerId === partnerId
    )
    return found ? found.enabled : false
  }

  function setEnabled(userId, partnerId, enabled) {
    const settings = storage.getAiSettings()
    const existing = settings.find(
      (s) => s.userId === userId && s.partnerId === partnerId
    )

    if (existing) {
      const updated = settings.map((s) =>
        s.id === existing.id ? { ...s, enabled } : s
      )
      storage.setAiSettings(updated)
    } else {
      const newSetting = {
        id: generateId('ai'),
        userId,
        partnerId,
        enabled,
      }
      storage.setAiSettings([...settings, newSetting])
    }
  }

  function toggle(userId, partnerId) {
    setEnabled(userId, partnerId, !isEnabled(userId, partnerId))
  }

  return { isEnabled, setEnabled, toggle }
}