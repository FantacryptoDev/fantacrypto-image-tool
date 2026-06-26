const SIZE_BY_ORIENTATION = {
  landscape: '1536x1024',
  portrait: '1024x1536',
  square: '1024x1024',
  any: '1024x1024'
}

export async function generateWithOpenAI(query, options = {}) {
  const size = SIZE_BY_ORIENTATION[options.orientation] || '1024x1024'
  const [width, height] = size.split('x').map(Number)
  const n = Math.min(options.pageSize || 4, 4)

  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: query, size, n })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `OpenAI ${res.status}`)

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
