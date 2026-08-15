const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const API_KEY = import.meta.env.VITE_GROQ_API_KEY

// Fallback reply used when the Groq API is unavailable (missing/invalid key, offline).
// Keeps the auto-reply feature working even without a valid key.
export function generateLocalReply(messages, replyingAsName, otherPersonName) {
  const lastMessage = [...messages].reverse().find((m) => m.senderName === otherPersonName)
  const lastText = lastMessage?.text || ''

  if (/\?/.test(lastText)) {
    return 'Haha good question! I would say probably yes. What do you think?'
  }

  const templates = [
    `Haha, yeah totally! How's your day going?`,
    `Oh really? Tell me more about that!`,
    `I was literally just thinking the same thing!`,
    `Nice one! 😄 Talk soon.`,
    `Sounds awesome! Let's catch up later.`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

// Generates a short, casual auto-reply as `replyingAsName`, based on recent chat history.
// Falls back to a local reply if the API is unreachable.
export async function generateAutoReply(messages, replyingAsName, otherPersonName) {
  if (!API_KEY) {
    return generateLocalReply(messages, replyingAsName, otherPersonName)
  }

  // Build a simple back-and-forth transcript for context
  const transcript = messages
    .slice(-10) // only use the last 10 messages for context
    .map((m) => `${m.senderName}: ${m.text}`)
    .join('\n')

  const systemPrompt = `You are casually replying to a chat message on behalf of ${replyingAsName}, replying to ${otherPersonName}. Keep it short (1-2 sentences), casual, and natural — like a real text message reply. Do not mention that you are an AI. Just reply with the message text, nothing else.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Conversation so far:\n${transcript}\n\nWrite ${replyingAsName}'s next reply.` },
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate AI reply')
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (err) {
    console.error('AI reply failed, using local fallback:', err)
    return generateLocalReply(messages, replyingAsName, otherPersonName)
  }
}

// Generates 3 short suggested reply options (for future use / bonus mode)
export async function generateSuggestions(messages, replyingAsName, otherPersonName) {
  const transcript = messages
    .slice(-10)
    .map((m) => `${m.senderName}: ${m.text}`)
    .join('\n')

  const systemPrompt = `Suggest 3 different short, casual reply options for ${replyingAsName} to send to ${otherPersonName}, based on the conversation. Return ONLY a JSON array of 3 strings, nothing else — no markdown, no explanation.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Conversation so far:\n${transcript}` },
        ],
        max_tokens: 150,
        temperature: 0.9,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate suggestions')
    }

    const data = await response.json()
    const raw = data.choices[0].message.content.trim()

    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  } catch (err) {
    console.error('Suggestions failed:', err)
    return []
  }
}
