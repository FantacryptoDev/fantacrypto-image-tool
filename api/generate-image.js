import { generateOpenAIImage } from './_lib/openaiImage.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { prompt, size, n } = req.body || {}
    const data = await generateOpenAIImage({ prompt, size, n, apiKey: process.env.OPENAI_API_KEY })
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
}
