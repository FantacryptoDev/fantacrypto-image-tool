import { generateWithOpenAI } from './openai'

function orientationParam(orientation) {
  if (!orientation || orientation === 'any') return ''
  return orientation
}

export async function searchOpenverse(query, options = {}) {
  const pageSize = options.pageSize || 6
  const params = new URLSearchParams({
    q: query,
    page_size: String(pageSize)
  })

  if (options.license) params.set('license', options.license)
  if (options.size) params.set('size', options.size)

  const res = await fetch(`/api/openverse/v1/images/?${params.toString()}`)
  if (!res.ok) throw new Error(`Openverse ${res.status}`)

  const data = await res.json()

  return (data.results || [])
    .filter(item => item.url)
    .map(item => ({
      id: `openverse-${item.id || item.url}`,
      source: 'Openverse',
      title: item.title || 'Immagine Openverse',
      imageUrl: item.url,
      thumbUrl: item.thumbnail || item.url,
      landingUrl: item.foreign_landing_url || item.url,
      license: item.license ? item.license.toUpperCase() : '',
      creator: item.creator || '',
      width: item.width || null,
      height: item.height || null
    }))
}

export async function searchWikimedia(query, options = {}) {
  const limit = options.pageSize || 6

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mime|size',
    format: 'json',
    origin: '*'
  })

  const res = await fetch(`/api/commons/w/api.php?${params.toString()}`)
  if (!res.ok) throw new Error(`Wikimedia ${res.status}`)

  const data = await res.json()
  const pages = Object.values(data.query?.pages || {})

  return pages
    .map(page => {
      const info = page.imageinfo?.[0]
      if (!info?.url) return null

      const meta = info.extmetadata || {}
      return {
        id: `wikimedia-${page.pageid}`,
        source: 'Wikimedia Commons',
        title: page.title || 'Immagine Wikimedia',
        imageUrl: info.url,
        thumbUrl: info.thumburl || info.url,
        landingUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
        license: meta.LicenseShortName?.value || '',
        creator: stripHtml(meta.Artist?.value || ''),
        width: info.width || null,
        height: info.height || null
      }
    })
    .filter(Boolean)
}

export async function searchAllSources(query, options = {}) {
  const source = options.source || 'all'

  const tasks = []

  if (source === 'all' || source === 'openverse') {
    tasks.push(searchOpenverse(query, options).catch(() => []))
  }

  if (source === 'all' || source === 'wikimedia') {
    tasks.push(searchWikimedia(query, options).catch(() => []))
  }

  if (source === 'openai') {
    tasks.push(generateWithOpenAI(query, options))
  }

  const results = (await Promise.all(tasks)).flat()

  const orientation = orientationParam(options.orientation)
  const filtered = orientation
    ? results.filter(item => {
        if (!item.width || !item.height) return true
        if (orientation === 'landscape') return item.width >= item.height
        if (orientation === 'portrait') return item.height >= item.width
        if (orientation === 'square') return Math.abs(item.width - item.height) < Math.max(item.width, item.height) * 0.2
        return true
      })
    : results

  return filtered.slice(0, options.pageSize || 6)
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, '').trim()
}
