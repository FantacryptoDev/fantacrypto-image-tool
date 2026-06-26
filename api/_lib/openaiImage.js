export async function generateOpenAIImage({ prompt, size, n, apiKey }) {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY non configurata')
  }

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: size || '1024x1024',
      n: n || 1
    })
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error?.message || `OpenAI ${res.status}`)
  }

  return data
}
