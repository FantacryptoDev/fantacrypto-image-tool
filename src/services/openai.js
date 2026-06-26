const SIZE_BY_ORIENTATION = {
  landscape: '1536x1024',
  portrait: '1024x1536',
  square: '1024x1024',
  any: '1024x1024'
}

const MAX_RETRIES = 3

export async function generateWithOpenAI(query, options = {}) {
  const size = SIZE_BY_ORIENTATION[options.orientation] || '1024x1024'
  const [width, height] = size.split('x').map(Number)
  const n = 1
  const prompt = buildImagePrompt(query)

  const data = await requestWithRetry({ prompt, size, n })

  return (data.data || [])
    .filter(item => item.b64_json)
    .map((item, index) => ({
      id: `openai-${Date.now()}-${index}`,
      source: 'OpenAI',
      title: `AI: ${query}`,
      imageUrl: `data:image/png;base64,${item.b64_json}`,
      thumbUrl: `data:image/png;base64,${item.b64_json}`,
      landingUrl: '',
      license: 'Generata con AI (OpenAI)',
      creator: 'OpenAI gpt-image-1',
      width,
      height
    }))
}

function buildImagePrompt(query) {
  const topic = String(query || '').replace(/\s+/g, ' ').trim()

  return [
    `Cinematic, atmospheric digital artwork evoking the concept of "${topic}" in the world of cryptocurrency and blockchain.`,
    'Dramatic lighting, rich depth, vibrant futuristic color palette, intricate visual metaphors, professional concept-art quality.',
    'Pure visual scene only: absolutely no text, no letters, no words, no numbers, no typography, no labels, no captions, no logos, no watermarks, no UI elements.'
  ].join(' ')
}

async function requestWithRetry(body, attempt = 0) {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  const data = await res.json()

  if (res.ok) return data

  const message = data?.error?.message || `OpenAI ${res.status}`

  if (res.status === 429 && attempt < MAX_RETRIES) {
    await wait(retryDelayMs(message))
    return requestWithRetry(body, attempt + 1)
  }

  throw new Error(message)
}

function retryDelayMs(message) {
  const match = /try again in ([\d.]+)s/i.exec(message)
  const seconds = match ? Number(match[1]) : 15
  return Math.ceil(seconds * 1000) + 1000
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
